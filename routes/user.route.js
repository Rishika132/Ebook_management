const express = require("express");
const {login,getUrl}  = require("../controller/user.controller");

const router = express.Router();

//http://localhost:3000/login

router.post("/login", login);
router.get("/get-url",getUrl);

module.exports = router;
