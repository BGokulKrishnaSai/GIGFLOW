const Message = require('../models/Message');
const Gig = require('../models/Gig');

// Create a message
exports.createMessage = async (req, res) => {
  try {
    const { gigId, to, text } = req.body;
    const from = req.user._id;
    console.log('[DEBUG] Incoming message payload:', { gigId, to, text, from });
    if (!gigId || !to || !text) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    // Check participants
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });

    // Only allow owner or assigned freelancer to message
    const isParticipant = gig.ownerId.toString() === from.toString() || gig.assignedTo?.toString() === from.toString();
    const isToParticipant = gig.ownerId.toString() === to.toString() || gig.assignedTo?.toString() === to.toString();
    if (!isParticipant || !isToParticipant) {
      console.log('[DEBUG] Not allowed: isParticipant:', isParticipant, 'isToParticipant:', isToParticipant);
      return res.status(403).json({ success: false, message: 'Not allowed to message for this gig' });
    }

    let message = await Message.create({ gigId, from, to, text });
    message = await message.populate('from', 'name email');
    message = await message.populate('to', 'name email');
    const populated = message;

    // Emit socket to recipient if io exists
    const io = req.app.get('io');
    if (io) {
      try {
        io.to(`user_${to}`).emit('message', populated);
      } catch (err) {
        console.error('Error emitting message:', err);
      }
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('[DEBUG] Message send error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages for a gig (between owner and assigned)
exports.getMessagesForGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user._id;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });

    // Only participants can fetch
    const isParticipant = gig.ownerId.toString() === userId.toString() || gig.assignedTo?.toString() === userId.toString();
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not allowed' });

    // Mark all messages sent to this user as seen
    await Message.updateMany({ gigId, to: userId, seen: false }, { $set: { seen: true } });

    const messages = await Message.find({ gigId })
      .populate('from', 'name email')
      .populate('to', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
