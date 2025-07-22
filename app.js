const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require("cors");
const WebhookRouter = require("./routes/webhook.route");
const UserRouter = require("./routes/user.route");
const BookRouter = require("./routes/book.route");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.use("/", UserRouter);
        app.use("/webhook", WebhookRouter);
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
        app.use("/",BookRouter);
        app.listen(3000, () => {
            console.log("Server started on port 3000");
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });
