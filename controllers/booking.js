const Booking = require("../models/booking");

// get all booking
const getBookings = async (page = 1, itemsPerPage = 6) => {
  return await Booking.find()
    .populate("user", "name email")
    .populate("room", "name price")
    .limit(itemsPerPage)
    .skip((page - 1) * itemsPerPage)
    .sort({ createdAt: -1 });
};

// get a booking
const getBooking = async (id) => {
  const booking = await Booking.findById(id)
    .populate("user", "name email")
    .populate("room", "name price");
  if (!booking) throw new Error("Booking not found");
  return booking;
};

// add booking
async function addBooking(user, room, checkInDate, checkOutDate, totalPrice) {
  //  检查是否有同房间、时间重叠的预订
  const conflictBooking = await Booking.findOne({
    room,
    $or: [
      {
        checkInDate: { $lt: new Date(checkOutDate) }, // 已存在的入住 < 新的退房
        checkOutDate: { $gt: new Date(checkInDate) }, // 已存在的退房 > 新的入住
      },
    ],
  });

  if (conflictBooking) {
    throw new Error("This room is already booked for the selected dates.");
  }

  //  没有冲突，创建新的预订
  const newBooking = new Booking({
    user,
    room,
    checkInDate,
    checkOutDate,
    totalPrice,
  });

  await newBooking.save();
  return newBooking;
}

// update booking
const updateBooking = async (id, status) => {
  const updated = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!updated) throw new Error("Booking not found");
  return updated;
};

// dalete booking
const deleteBooking = async (id) => {
  const deleted = await Booking.findByIdAndDelete(id);
  if (!deleted) throw new Error("Booking not found");
  return deleted;
};
// 根据用户获取预订记录
const getBookingsByUser = async (userId) => {
  const bookings = await Booking.find({ user: userId })
    .populate("room", "name price")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  if (!bookings || bookings.length === 0) {
    throw new Error("No bookings found for this user");
  }

  return bookings;
};

module.exports = {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
};
