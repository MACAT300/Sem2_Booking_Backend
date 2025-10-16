const express = require("express");
const router = express.Router();
const { isValidUser, isAdmin } = require("../middleware/auth");

const {
  getRooms,
  getRoom,
  addRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/room");

// get all rooms
router.get("/", async (req, res) => {
  try {
    const type = req.query.type || "all";
    const page = parseInt(req.query.page) || 1;
    const rooms = await getRooms(type, page);
    res.status(200).send(rooms);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: "unknown error" });
  }
});

// 获取单个房间
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const room = await getRoom(id);
    res.status(200).send(room);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: "unknown error" });
  }
});

// 添加新房间
router.post("/", isAdmin, async (req, res) => {
  try {
    const { name, type, description, price, capacity, image } = req.body;

    if (!name || !type || !price || !capacity) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const room = await addRoom(name, type, description, price, capacity, image);
    res.status(200).send(room);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: "unknown error" });
  }
});

// 更新房间
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const { name, type, description, price, capacity, image } = req.body;
    const id = req.params.id;

    if (!name || !type || !price || !capacity) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const room = await updateRoom(
      id,
      name,
      type,
      description,
      price,
      capacity,
      image
    );
    res.status(200).send(room);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: "unknown error" });
  }
});

//  delete room
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteRoom(id);
    res.status(200).send({ message: `Room ${id} deleted` });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: "unknown error" });
  }
});

module.exports = router;
