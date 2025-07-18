const User = require("../model/user.model");

const login = async (req, res) => {
  try {
    const { email, system_id, logged_out, first } = req.body;

    if (!email || !system_id) {
      return res.status(400).json({ message: "Email and system_id are required" });
    }

    if (first === true) {
      const existingUser = await User.findOne({ system_id });

        if (logged_out && existingUser) {
      await User.deleteOne({ system_id });
      return res.status(200).json({
        message: "User logged out and entry deleted",
        email,
        system_id,
        deleted: true
      });
    }

      if (existingUser) {
        return res.status(409).json({message: "System ID already exists."});
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
    } else {
      return res.status(400).json({
        email,
        system_id,
        active: false
      });
    }
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate system_id not allowed" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { login };
