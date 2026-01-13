const express = require('express');
const { createMessage, getMessagesForGig, getChatUsers } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public: List recent messages/users (for chat UI init, no auth)
router.get('/', async (req, res) => {
  try {
    const messages = await getMessagesForGig(req, res, 'demo');  // Fallback gig
    const users = await getChatUsers();
    res.json({ messages: messages || [], users: users || [] });[web:36]
  } catch (err) {
    res.status(200).json({ messages: [], users: [] });  // Always respond empty gracefully[web:39]
  }
});

// Protected gig chat
router.post('/', protect, createMessage);
router.get('/:gigId', protect, getMessagesForGig);

module.exports = router;
