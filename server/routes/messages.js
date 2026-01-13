const express = require('express');
const router = express.Router();

// PUBLIC - Chat overview (no auth)
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    messages: [],
    users: [
      { _id: 'demo1', name: 'Demo Freelancer', avatar: '👨‍💻' },
      { _id: 'demo2', name: 'Demo Client', avatar: '👨‍💼' }
    ],
    gigs: []
  });
});

// POST message (protected stub)
router.post('/', (req, res) => {
  res.status(201).json({ success: true, message: 'Message sent!' });
});

// GET gig messages (protected stub)
router.get('/:gigId', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { _id: 'msg1', text: `Demo chat for gig ${req.params.gigId}`, from: 'demo' }
    ]
  });
});

module.exports = router;
