const express = require("express");
const {
  createBid,
  getBidsForGig,
  getUserBids,
  hireBid,
  rejectBid,
} = require("../controllers/bidController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Protected routes
router.post("/", protect, createBid);
router.get("/gig/:gigId", protect, getBidsForGig);
router.get("/user/my-bids", protect, getUserBids);
router.patch("/:bidId/hire", protect, hireBid);
router.patch("/:bidId/reject", protect, rejectBid);

module.exports = router;
