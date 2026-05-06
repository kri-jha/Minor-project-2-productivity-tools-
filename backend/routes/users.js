const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const User = require("../models/User");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + "-" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  const { username, full_name, bio, theme, avatar_url } = req.body;
  const profileFields = {};
  if (username !== undefined) profileFields.username = username;
  if (full_name !== undefined) profileFields.full_name = full_name;
  if (bio !== undefined) profileFields.bio = bio;
  if (theme !== undefined) profileFields.theme = theme;
  if (avatar_url !== undefined) profileFields.avatar_url = avatar_url;

  try {
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/users/avatar
// @desc    Upload avatar and return url
// @access  Private
router.post("/avatar", auth, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const avatar_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ avatar_url });
});
// @route   GET api/users/leaderboard
// @desc    Get top users by xp
// @access  Public
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find().sort({ xp: -1 }).limit(50).select("username full_name avatar_url xp totalStudySeconds _id");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/users/:id/xp
// @desc    Add xp and time to a user
// @access  Public (mock validation for dev, normally checked using Auth)
router.post("/:id/xp", async (req, res) => {
  try {
    const { seconds } = req.body;
    
    // 2 minutes = 1 XP
    const minutes = Math.floor(seconds / 60);
    let xpGain = Math.floor(minutes / 2);
    
    // Deep Work Bonus: +2 Extra XP for every continuous hour studied!
    if (minutes >= 60) {
      xpGain += Math.floor(minutes / 60) * 2;
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.totalStudySeconds += seconds;
    user.xp += xpGain;
    
    // Track streak — record today's date if not already recorded
    const today = new Date().toISOString().split("T")[0];
    if (!user.studyDays.includes(today)) {
      user.studyDays.push(today);
    }
    
    await user.save();

    res.json({ xp: user.xp, totalStudySeconds: user.totalStudySeconds, xpGain });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
