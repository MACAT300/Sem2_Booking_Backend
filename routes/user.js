require("dotenv").config();

const express = require("express");
const router = express.Router();

const User = require("../models/user");

const { login, signup } = require("../controllers/user");

/*
get all users
get one user
update user
delete user
    POST /users/
    POST /users/signup
    POST /users/login
*/

// get all user
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// get one users

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message || "unknown error" });
  }
});

// POST /users/login
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await login(email, password);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

// POST /users/signup
router.post("/signup", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const user = await signup(name, email, password);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

const { isAdmin } = require("../middleware/auth");
const { updateUser } = require("../controllers/user");

//  Update user
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password, role } = req.body;

    // check error - required fields
    if (!name || !email) {
      return res.status(400).send({
        message: "Name and Email are required",
      });
    }

    const updatedUser = await updateUser(id, { name, email, password, role });
    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
