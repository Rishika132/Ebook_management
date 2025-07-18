// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true
//     },
//     system_id: {
//         type: String,
//         required: true,
//         unique:true
//     }
// }, { timestamps: true });

// const User = mongoose.model("user", userSchema);

// module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  system_id: { type: String, required: true, unique: true }, 
  active: { type: Boolean, default: true },
  last_checked: { type: Date, default: Date.now }
});



module.exports = mongoose.model('User', userSchema);
