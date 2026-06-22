import Certificate from '../models/Certificate.js';
import crypto from 'crypto';

export const generateCertificate = async (req, res) => {
  try {
    const { quizCategory, score } = req.body;
    
    // Generate unique ID
    const certificateId = 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const certificate = await Certificate.create({
      userId: req.user._id,
      certificateId,
      quizCategory,
      score
    });

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate certificate', error: error.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.id }).populate('userId', 'name');
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found or invalid' });
    }
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify certificate', error: error.message });
  }
};

export const getUserCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id }).sort({ dateIssued: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
};
