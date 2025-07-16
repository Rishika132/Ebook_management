const express = require("express");
const upload = require('../middleware/upload');
const {uploadPdf}  = require("../controller/book.controller");

const router = express.Router();

//http://localhost:3000/upload-pdf

router.post('/upload-pdf', upload.single('file'), uploadPdf);

module.exports = router;
