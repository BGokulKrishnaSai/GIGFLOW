const Gig = require("../models/Gig");

// @desc    Get all gigs
// @route   GET /api/gigs
// @access  Public
exports.getGigs = async (req, res) => {
  try {
    const { search, category, budget } = req.query;

    let query = { status: "open" };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Budget filter
    if (budget && budget !== 'all') {
      const budgetLimits = {
        '500': { $lte: 500 },
        '1000': { $lte: 1000 },
        '5000': { $lte: 5000 },
        '10000': { $lte: 10000 }
      };
      if (budgetLimits[budget]) {
        query.budget = budgetLimits[budget];
      }
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email avatar createdAt')
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
exports.getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email avatar createdAt')
      .populate('assignedTo', 'name email avatar');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
exports.createGig = async (req, res) => {
  try {
    const { title, description, budget, category, skills } = req.body;
    const ownerId = req.user._id;

    if (!title || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, and budget",
      });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      category: category || "General",
      skills: skills || [],
      ownerId,
    });

    await gig.populate('ownerId', 'name email avatar createdAt');

    res.status(201).json({
      success: true,
      data: gig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update gig
// @route   PATCH /api/gigs/:id
// @access  Private (Owner only)
exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own gigs.",
      });
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email avatar');

    // ensure updatedGig includes owner createdAt as well
    await updatedGig.populate('ownerId', 'name email avatar createdAt');

    res.status(200).json({
      success: true,
      data: updatedGig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private (Owner only)
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own gigs.",
      });
    }

    await Gig.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Gig deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get gigs for the authenticated user
// @route   GET /api/gigs/my
// @access  Private
exports.getMyGigs = async (req, res) => {
  try {
    const userId = req.user._id;
    const gigs = await Gig.find({ ownerId: userId })
      .populate('ownerId', 'name email avatar createdAt')
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: gigs.length, data: gigs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};