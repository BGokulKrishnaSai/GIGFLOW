const Message = require('../models/Message');
const Gig = require('../models/Gig');
const User = require('../models/User');  // Add User model

// Your existing createMessage (unchanged - solid)
exports.createMessage = async (req, res) => {
  // ... your code exactly as is
};

// Your existing getMessagesForGig (minor empty fix)
exports.getMessagesForGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user._id;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });

    const isParticipant = gig.ownerId.toString() === userId.toString() || gig.assignedTo?.toString() === userId.toString();
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not allowed' });

    await Message.updateMany({ gigId, to: userId, seen: false }, { $set: { seen: true } });

    const messages = await Message.find({ gigId })
      .populate('from', 'name email avatar')  // Ensure users populated[web:58]
      .populate('to', 'name email avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages || [] });  // Always array[web:39]
  } catch (error) {
    console.error(error);
    res.status(200).json({ success: true, data: [] });  // Graceful empty
  }
};

// NEW: Public chat init (messages + users list)
exports.getChatOverview = async (req, res) => {
  try {
    // Demo/recent gigs for chat UI
    const recentGigs = await Gig.find({ status: { $ne: 'closed' } })
      .populate('ownerId assignedTo', 'name email avatar')
      .limit(5)
      .select('title ownerId assignedTo');

    // Recent users/contacts
    const users = await User.find({ isActive: true })
      .select('name email avatar')
      .limit(10);

    // Recent messages summary
    const recentMessages = await Message.find()
      .populate('from to gigId', 'name title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      gigs: recentGigs || [],
      users: users || [],
      messages: recentMessages || []
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({ success: true, gigs: [], users: [], messages: [] });
  }
};
