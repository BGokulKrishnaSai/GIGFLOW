const express = require('express');
const { createMessage, getMessagesForGig } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createMessage);
router.get('/:gigId', protect, getMessagesForGig);

module.exports = router;
