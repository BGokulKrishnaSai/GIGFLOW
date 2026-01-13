const express = require("express");
const router = express.Router();

// Try to load real controller (graceful fallback)
let gigController = {};
try {
  gigController = require("../controllers/gigController");
} catch (error) {
  console.log('⚠️ gigController not found - using fallback');
  // Fallback controller
  gigController = {
    getGigs: async (req, res) => {
      res.json({
        success: true,
        count: 0,
        data: [],
        message: 'GigFlow gigs API working! 🚀'
      });
    },
    getGig: async (req, res) => {
      res.status(404).json({ success: false, message: 'Gig not found' });
    },
    getMyGigs: async (req, res) => {
      res.json({ success: true, data: [] });
    },
    createGig: async (req, res) => {
      res.status(501).json({ message: 'Not implemented' });
    },
    updateGig: async (req, res) => {
      res.status(501).json({ message: 'Not implemented' });
    },
    deleteGig: async (req, res) => {
      res.status(501).json({ message: 'Not implemented' });
    }
  };
}

// Load auth middleware
let protect = (req, res, next) => next();
try {
  protect = require("../middleware/auth").protect;
} catch (error) {
  console.log('⚠️ auth middleware not found - public access');
}

// Routes
router.get("/", gigController.getGigs);
router.get("/my", protect, gigController.getMyGigs);
router.get("/:id", gigController.getGig);
router.post("/", protect, gigController.createGig);
router.patch("/:id", protect, gigController.updateGig);
router.delete("/:id", protect, gigController.deleteGig);

module.exports = router;
