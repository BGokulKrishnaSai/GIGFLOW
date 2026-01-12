const express = require("express");
const {
  getGigs,
  getGig,
  createGig,
  updateGig,
  deleteGig,
  getMyGigs,
} = require("../controllers/gigController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getGigs);

// Protected routes (place before '/:id' to avoid param capture)
router.get("/my", protect, getMyGigs);

// Public single-gig route
router.get("/:id", getGig);

// Protected routes
router.post("/", protect, createGig);
router.patch("/:id", protect, updateGig);
router.delete("/:id", protect, deleteGig);

module.exports = router;
