import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { loadStripe } from '@stripe/stripe-js';
import { Check, Star, Zap, Crown, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// Make sure to set VITE_STRIPE_PUBLIC_KEY in your frontend .env file!
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_dummy_key');

export default function Premium() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Subscription successful! Welcome to Pro!');
    }
    if (searchParams.get('canceled')) {
      toast.error('Subscription was canceled.');
    }
  }, [searchParams]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await apiClient.post('/stripe/create-checkout-session');
      window.location.href = data.url;
    } catch (error) {
      toast.error('Failed to start checkout. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-12 font-medium">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-6">
            Upgrade your Quiz Experience
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Get unlimited AI generation, premium avatars, and ad-free gameplay with a ThinkFast Pro subscription.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm opacity-90">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Standard</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Perfect for casual players</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-slate-800 dark:text-white">$0</span>
              <span className="text-slate-500">/forever</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Check className="text-emerald-500 flex-shrink-0" size={20} /> Play unlimited standard quizzes
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Check className="text-emerald-500 flex-shrink-0" size={20} /> Access to Global Leaderboards
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Check className="text-emerald-500 flex-shrink-0" size={20} /> Limited AI Quiz Generation (10/hr)
              </li>
              <li className="flex items-center gap-3 text-slate-400 dark:text-slate-500 opacity-50">
                <Check className="flex-shrink-0" size={20} /> Premium Avatar Frames
              </li>
            </ul>
            
            <button disabled className="w-full py-4 rounded-xl font-bold bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed">
              Your Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-b from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-xl shadow-purple-500/20 transform md:-translate-y-4 border border-indigo-400/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Crown className="text-yellow-300 w-12 h-12 opacity-50 rotate-12" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              Pro <Star className="fill-yellow-300 text-yellow-300" size={20} />
            </h3>
            <p className="text-indigo-100 mb-6">For power users and teachers</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-white">$5</span>
              <span className="text-indigo-200">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white">
                <Zap className="text-yellow-300 flex-shrink-0" size={20} fill="currentColor" /> UNLIMITED AI Quiz Generation
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check className="text-indigo-200 flex-shrink-0" size={20} /> Priority support
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check className="text-indigo-200 flex-shrink-0" size={20} /> Exclusive Pro Avatar Frames & Badges
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check className="text-indigo-200 flex-shrink-0" size={20} /> Ad-free experience
              </li>
            </ul>
            
            <button 
              onClick={handleSubscribe}
              disabled={loading || user?.isPro}
              className="w-full py-4 rounded-xl font-bold bg-white text-indigo-600 hover:bg-slate-50 transition-colors shadow-lg shadow-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : user?.isPro ? 'You are a PRO!' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
