const Bid = require("../models/Bid");
const Gig = require("../models/Gig");

// @desc    Create a bid
// @route   POST /api/bids
// @access  Private
exports.createBid = async (req, res) => {
  try {
    const { gigId, message, bidAmount } = req.body;
    const freelancerId = req.user._id;

    if (!gigId || !message || !bidAmount) {
      return res.status(400).json({
        success: false,
        message: "Please provide gigId, message, and bidAmount",
      });
    }

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }
    if (gig.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This gig is no longer accepting bids",
      });
    }

    // Check if user already bid on this gig
    const existingBid = await Bid.findOne({ gigId, freelancerId });
    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: "You have already bid on this gig",
      });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId,
      message,
      bidAmount,
    });

    await bid.populate('freelancerId', 'name email avatar');

    res.status(201).json({
      success: true,
      data: bid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all bids for a gig
// @route   GET /api/bids/gig/:gigId
// @access  Private (Gig owner only)
exports.getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user._id;

    // Check if gig exists and user is the owner
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }
    if (gig.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view bids for your own gigs.",
      });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's bids
// @route   GET /api/bids/user/my-bids
// @access  Private
exports.getUserBids = async (req, res) => {
  try {
    const userId = req.user._id;

    const bids = await Bid.find({ freelancerId: userId })
      .populate('gigId', 'title description budget status category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Hire a freelancer (CRITICAL HIRING LOGIC with Transactional Integrity)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Gig owner only)
exports.hireBid = async (req, res) => {
  const session = await Bid.startSession();
  session.startTransaction();
  let committed = false;

  try {
    const { bidId } = req.params;
    const userId = req.user._id;
    const io = req.app.get('io'); // Get Socket.io instance

    // Find the bid to be hired
    const bidToHire = await Bid.findById(bidId).session(session);
    if (!bidToHire) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    // Check if gig exists and user is the owner
    const gig = await Gig.findById(bidToHire.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }
    if (gig.ownerId.toString() !== userId.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only hire for your own gigs.",
      });
    }

    // Check if gig is still open
    if (gig.status !== "open") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "This gig has already been assigned",
      });
    }

    // Check if bid is still pending
    if (bidToHire.status !== "pending") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "This bid has already been processed",
      });
    }

    // ATOMIC OPERATION: Update gig status, hire the selected bid, reject all others
    await Gig.findByIdAndUpdate(
      bidToHire.gigId,
      { status: "assigned", assignedTo: bidToHire.freelancerId },
      { session }
    );

    // Hire the selected bid
    await Bid.findByIdAndUpdate(
      bidId,
      { status: "hired" },
      { session }
    );

    // Reject all other pending bids for this gig
    await Bid.updateMany(
      {
        gigId: bidToHire.gigId,
        _id: { $ne: bidId },
        status: "pending"
      },
      { status: "rejected" },
      { session }
    );

    await session.commitTransaction();
    committed = true;

    // Populate the hired bid for response
    const hiredBid = await Bid.findById(bidId)
      .populate('freelancerId', 'name email avatar')
      .populate('gigId', 'title description budget');

    // REAL-TIME NOTIFICATION: Notify the hired freelancer (guard if io present)
    if (io) {
      try {
        io.to(`user_${bidToHire.freelancerId}`).emit('hired', {
          message: `Congratulations! You have been hired for "${gig.title}"`,
          gig: {
            _id: gig._id,
            title: gig.title,
            budget: gig.budget,
            description: gig.description
          },
          bid: hiredBid
        });
      } catch (emitErr) {
        console.error('Error emitting hired event:', emitErr);
      }
    }

    res.status(200).json({
      success: true,
      message: "Freelancer hired successfully",
      data: {
        gig: { ...gig.toObject(), status: "assigned" },
        hiredBid
      }
    });

  } catch (error) {
    if (!committed) {
      try {
        await session.abortTransaction();
      } catch (abortErr) {
        console.error('Error aborting transaction:', abortErr);
      }
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// @desc    Reject a bid with reason
// @route   PATCH /api/bids/:bidId/reject
// @access  Private (Gig owner only)
exports.rejectBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;
    const io = req.app.get('io');

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    const gig = await Gig.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. You can only reject bids for your own gigs.' });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This bid has already been processed' });
    }

    bid.status = 'rejected';
    bid.rejectionReason = reason || null;
    await bid.save();

    const populated = await Bid.findById(bidId).populate('freelancerId', 'name email avatar').populate('gigId', 'title');

    // Notify freelancer about rejection
    if (io) {
      io.to(`user_${bid.freelancerId}`).emit('bidRejected', {
        message: `Your bid for "${gig.title}" was rejected`,
        reason: reason || null,
        bid: populated,
      });
    }

    res.status(200).json({ success: true, message: 'Bid rejected', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
