const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const WebhookRouter = require("./routes/webhook.route");
const UserRouter = require("./routes/user.route");
const BookRouter = require("./routes/book.route");
const dotenv = require("dotenv");
const socketIo = require('socket.io');
const http = require('http');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        const server = http.createServer(app);

        // Attach socket.io to HTTP server
        const io = socketIo(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });

        // Store io globally
        global.io = io;

        io.on('connection', (socket) => {
            console.log('✅ Client connected via WebSocket');
  
             socket.on("join-room", (email) => {
    socket.join(email);
    console.log(`Socket ${socket.id} joined room: ${email}`);
  });
  
            socket.on('disconnect', () => {
                console.log('❌ Client disconnected');
            });
        });

        app.use("/", UserRouter);
        app.use("/webhook", WebhookRouter);
        app.use("/", BookRouter);
        server.listen(4000, () => {
            console.log("Server started on port 3000");
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });
