import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize Stripe (will fail gracefully if no secret key is provided yet)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');

// POST /api/stripe/create-checkout-session
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ThinkFast Quiz Pro Subscription',
              description: 'Unlimited AI Quizzes and Premium Features',
            },
            unit_amount: 500, // $5.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      client_reference_id: req.user._id.toString(),
      success_url: `${clientUrl}/premium?success=true`,
      cancel_url: `${clientUrl}/premium?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ success: false, message: 'Could not create checkout session' });
  }
});

// POST /api/stripe/webhook
// This needs to be raw body for stripe signature verification, so we use express.raw
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // For local development without webhook secret configured
      event = JSON.parse(req.body);
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Find the user and upgrade to Pro
    if (session.client_reference_id) {
      await User.findByIdAndUpdate(session.client_reference_id, {
        isPro: true,
        stripeCustomerId: session.customer
      });
      console.log(`User ${session.client_reference_id} upgraded to PRO`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    // Find the user and remove Pro status
    await User.findOneAndUpdate(
      { stripeCustomerId: subscription.customer },
      { isPro: false }
    );
    console.log(`User with customer ID ${subscription.customer} downgraded to Free`);
  }

  res.send();
});

export default router;
