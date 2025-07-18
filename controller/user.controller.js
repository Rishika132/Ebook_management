
const User = require("../model/user.model");

const login = async (req, res) => {
  try {
    const { email, system_id, logged_out,first } = req.body;

    if (!email || !system_id) {
      return res.status(400).json({ message: "Email and system_id are required" });
    }

    const existingUser = await User.findOne({ email });

 
    if (logged_out && existingUser) {
      await User.deleteOne({ system_id }); 
      return res.status(200).json({
        message: "User logged out and entry deleted",
        email,
        system_id,
        deleted: true
      });
    }

 

    if (first) {
      if(existingUser){
    
      await User.updateMany(
        { email, system_id: { $ne: system_id } },
        { $set: { active: false } }
      );
      }

       const newUser = new User({
      email,
      system_id,
      active: true,
      login_count: loginCount,
      last_checked: new Date()
    });
     
    newUser.save();

      return res.status(200).json({
        message: "System reactivated",
        email,
        system_id,
        active: true
      });
    }

    const loginCount = await User.countDocuments({ email }) + 1;

    const newUser = new User({
      email,
      system_id,
      active: true,
      login_count: loginCount,
      last_checked: new Date()
    });

    await User.updateMany(
      { email },
      { $set: { active: false } }
    );

    await newUser.save();

    return res.status(200).json({
      message: "New system registered & logged in",
      email,
      system_id,
      active: true,
      login_count: loginCount
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