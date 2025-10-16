const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/auth");
const Booking = require("../models/booking");

// 前置 Bearer 检查（管理员接口使用）
const requireBearerAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ error: "Authorization token missing or invalid" });
  }
  next();
};

const {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
} = require("../controllers/booking");

// 根据房间获取预订（
router.get("/room/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const bookings = await Booking.find({ room: roomId });
    res.status(200).send(bookings);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});
// get all bookings for a user (user)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await getBookingsByUser(userId);
    res.json(bookings);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//  get all bookings for a user (admin)
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ user: userId })
      .populate("room", "name price")
      .sort({ createdAt: -1 });

    res.status(200).send(bookings);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

//get all bookings (admin)
router.get("/", requireBearerAuth, isAdmin, async (req, res) => {
  try {
    const page = req.query.page;
    const bookings = await getBookings(page);
    res.status(200).send(bookings);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

//  get one booking
router.get("/:id", async (req, res) => {
  try {
    const booking = await getBooking(req.params.id);
    res.status(200).send(booking);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

//  addd booking
router.post("/", async (req, res) => {
  try {
    const { user, room, checkInDate, checkOutDate, totalPrice } = req.body;
    if (!user || !room || !checkInDate || !checkOutDate || !totalPrice)
      return res.status(400).send({ message: "All fields are required" });

    const booking = await addBooking(
      user,
      room,
      checkInDate,
      checkOutDate,
      totalPrice
    );
    res.status(200).send(booking);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

// update booking status
router.put("/:id", requireBearerAuth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await updateBooking(req.params.id, status);
    res.status(200).send(booking);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

//  delete booking
router.delete("/:id", requireBearerAuth, isAdmin, async (req, res) => {
  try {
    await deleteBooking(req.params.id);
    res.status(200).send({ message: "Booking deleted" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
