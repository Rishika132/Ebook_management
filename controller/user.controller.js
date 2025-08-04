const User = require("../model/user.model");

const login = async (req, res) => {
  try {
    const { email, system_id, logged_out } = req.body;
    console.log(req.body);

    if (!email || !system_id) {
      return res.status(400).json({ message: "Email and system_id are required" });
    }

    const existingUser = await User.findOne({ system_id });

    // ✅ LOGOUT FLOW
    if (logged_out === true) {
      if (existingUser) {
        if (existingUser.active === false) {
          await User.deleteOne({ system_id });
          if (global.io) {
            global.io.to(email).emit('user-logout', {
              message: 'User logged out successfully',
              timestamp: new Date(),
            });
          }
          return res.status(200).json({
            message: "User logged out and entry deleted",
            email,
            system_id,
            deleted: true
          });
        }
      } else {
        return res.status(404).json({
          message: "System ID not found. Cannot log out.",
          email,
          system_id,
          deleted: false
        });
      }
    }

    // ✅ If system_id already exists, block new login
    if (existingUser) {
      return res.status(409).json({
        message: "System ID already exists.",
        active: existingUser.active
      });
    }

    // ✅ Mark all old devices as inactive
    await User.updateMany({ email }, { $set: { active: false } });

    // ✅ Emit logout event to all old devices
    if (global.io) {
      global.io.to(email).emit('user-logout', {
        message: 'You have been logged out from another device',
        timestamp: new Date()
      });
    }

    // ✅ Now safe to save the new user
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
    console.error("❌ Login Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUrl = async (request, response) => {
  try {
    const result = await User.find();
    return response.status(200).json({ users: result });
  } catch (err) {
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { login, getUrl };
