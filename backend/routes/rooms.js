const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Create a new room
router.post("/", async (req, res) => {
  try {
    const { name, topic, isPrivate } = req.body;
    
    // Generate code
    const code = `${name.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRoom = new Room({
      name,
      code,
      isPrivate,
      topic,
      members: [] // Starts empty until someone joins
    });

    const room = await newRoom.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a room
router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    await room.deleteOne();
    res.json({ msg: "Room removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Join a room (HTTP fallback)
router.post("/:id/join", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    const { userId, name, avatar } = req.body;
    
    // check if member exists
    const exists = room.members.find(m => m.userId === userId);
    if (!exists) {
      room.members.push({ userId, name, avatar, status: "studying" });
      await room.save();
    }
    
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
