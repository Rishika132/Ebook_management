const User = require("../model/user.model");
const login = async (req, res) => {
  try {
    const { email, system_id,logged_out} = req.body;
    if (!email || !system_id) {
      return res.status(400).json({ message: "Email and system_id are required" });
    }
      const existingUser = await User.findOne({ system_id });
          if (logged_out === true) {
      if (existingUser) {
        await User.deleteOne({ system_id });
        return res.status(200).json({
          message: "User logged out and entry deleted",
          email,
          system_id,
          deleted: true
        });
      } else {
        return res.status(404).json({
          message: "System ID not found. Cannot log out.",
          email,
          system_id,
          deleted: false
        });
      }
    }
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
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUrl = async(request , response)=>{
  User.find()
    .then(result=>{
        return response.status(200).json({users:result});
    }).catch(err =>{
        return response.status(500).json({error: "Internal Server Error"});
    });
}
module.exports = { login , getUrl };


