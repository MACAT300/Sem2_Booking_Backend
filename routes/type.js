const express = require("express");
// set up type router
const router = express.Router();

const {
  getTypes,
  getType,
  addType,
  updateType,
  deleteType,
} = require("../controllers/type");

/*
    GET All /types
    GET /types/:id
    POST /types
    PUT /types/:id
    DELETE /types/:id
*/

// get types
router.get("/", async (req, res) => {
  try {
    const types = await getTypes();
    res.status(200).send(types);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unknown error" });
  }
});

// get type
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const type = await getType(id);
    res.status(200).send(type);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unknown error" });
  }
});

// create new type
router.post("/", async (req, res) => {
  try {
    const label = req.body.label;
    const newtype = await addType(label);
    res.status(200).send(newtype);
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: "Unknown error" });
  }
});

// update type
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const label = req.body.label;
    const updatedtype = await updateType(id, label);
    res.status(200).send(updatedtype);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unknown error" });
  }
});

// delete type
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteType(id);
    res.status(200).send({
      message: `type #${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unknown error" });
  }
});

module.exports = router;
