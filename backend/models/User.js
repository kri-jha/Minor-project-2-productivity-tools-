const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profile fields matching current Supabase schema functionality
  username: { type: String },
  full_name: { type: String },
  avatar_url: { type: String },
  bio: { type: String },
  theme: { type: String, default: "system" },
  // XP and Stats
  xp: { type: Number, default: 0 },
  totalStudySeconds: { type: Number, default: 0 },
  // Streak Tracking: array of ISO date strings ("YYYY-MM-DD") when user studied
  studyDays: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
