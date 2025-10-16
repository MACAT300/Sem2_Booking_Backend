const Room = require("../models/room");

// 获取所有房间
const getRooms = async (type, page = 1, itemsPerPage = 6) => {
  let filter = {};

  // 如果 type 不是 all 且不为空，就加上过滤条件
  if (type && type !== "all") {
    filter.type = type;
  }

  // 查询房间
  const rooms = await Room.find(filter)
    .limit(itemsPerPage)
    .skip((page - 1) * itemsPerPage)
    .sort({ _id: -1 });

  return rooms;
};

// 获取单个房间
const getRoom = async (id) => {
  const room = await Room.findById(id);
  if (!room) throw new Error("Room not found");
  return room;
};

// 添加房间
const addRoom = async (name, type, description, price, capacity, image) => {
  const newRoom = new Room({
    name,
    type,
    description,
    price,
    capacity,
    image,
  });
  await newRoom.save();
  return newRoom;
};

// 更新房间
const updateRoom = async (
  id,
  name,
  type,
  description,
  price,
  capacity,
  image
) => {
  const updatedRoom = await Room.findByIdAndUpdate(
    id,
    { name, type, description, price, capacity, image },
    { new: true }
  );
  return updatedRoom;
};

// 删除房间
const deleteRoom = async (id) => {
  const deletedRoom = await Room.findByIdAndDelete(id);
  if (!deletedRoom) throw new Error("Room not found");
  return deletedRoom;
};

module.exports = {
  getRooms,
  getRoom,
  addRoom,
  updateRoom,
  deleteRoom,
};
