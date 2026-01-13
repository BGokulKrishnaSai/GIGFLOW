const express = require('express');
const router = express.Router();

// ✅ PUBLIC ROUTE (No controller/auth needed - direct JSON)
router.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    messages: [], 
    users: [{ _id: 'demo1', name: 'Demo Freelancer' }, { _id: 'demo2', name: 'Demo Client' }], 
    gigs: []
  });
});

// ✅ PROTECTED (Your originals - add controllers later)
router.post('/', (req, res) => {
  res.status(201).json({ success: true, message: 'Message sent (demo)' });
});

router.get('/:gigId', (req, res) => {
  res.status(200).json({ 
    success: true, 
    data: [{ text: `Demo message for gig ${req.params.gigId}`, from: 'demo' }] 
  });
});

module.exports = router;
