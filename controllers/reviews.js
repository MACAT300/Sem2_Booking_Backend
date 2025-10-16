const jwt = require("jsonwebtoken");
const Review = require("../models/reviews");
const Room = require("../models/room");
const { getUserByEmail } = require("./user");

// get reviews for a room
exports.getReviews = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const reviews = await Review.find({ room: roomId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

//  add review
exports.addReview = async (req, res) => {
  try {
    const { room, rating, comment } = req.body;

    const { authorization = "" } = req.headers;
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ message: "Room not found" });
    }

    const newReview = new Review({
      user: user._id,
      room,
      rating,
      comment,
    });

    await newReview.save();

    const populated = await newReview.populate("user", "name email");
    res.status(201).json(populated);
  } catch (error) {
    console.error(" Error adding review:", error);
    res.status(500).json({ message: "Failed to add review" });
  }
};

// delete review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorization = "" } = req.headers;
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      review.user.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Review.findByIdAndDelete(id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};
