const User = require("../model/user.model");
const login = async (req, res) => {
  try {
    const { email, system_id, first } = req.body;
    if (!email || !system_id) {
      return res.status(400).json({ message: "Email and system_id are required" });
    }
      const existingUser = await User.findOne({ system_id });
      if (existingUser) {
        return res.status(409).json({message: "System ID already exists.", active: existingUser.active});
      }
      await User.updateMany(
        { email },
        { $set: { active: false } }
      );
      const newUser = new User({
        email,
        system_id,
        active: true,
        last_checked: new Date()
      });
      await newUser.save();
      return res.status(200).json({
        message: "New system registered successfully",
        email,
        system_id,
        active: true
      });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate system_id not allowed" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { login };