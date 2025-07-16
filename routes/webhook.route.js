const express = require("express");

const {Webhook} = require("../controller/webhook.controller");

const router = express.Router();

//http://localhost:3000/webhook/order

router.post("/order",Webhook);


module.exports = router;
