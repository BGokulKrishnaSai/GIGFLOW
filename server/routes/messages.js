const express = require('express');
const { createMessage, getMessagesForGig, getChatOverview } = require('../controllers/messageController');  // Use getChatOverview
const { protect } = require('../middleware/auth');

const router = express.Router();

// ✅ FIXED: Public chat overview (no auth, safe empty arrays)
router.get('/', getChatOverview);  // Single controller handles messages/users/gigs

// Protected gig chat (your originals)
router.post('/', protect, createMessage);
router.get('/:gigId', protect, getMessagesForGig);

module.exports = router;
