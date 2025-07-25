const express = require("express");
const { uploadPdf, product } = require("../controller/book.controller");

const router = express.Router();

// POST http://localhost:3000/upload-pdf
router.post("/upload-pdf", uploadPdf);

// GET http://localhost:3000/get-url
router.get("/get-url", product);

module.exports = router;
