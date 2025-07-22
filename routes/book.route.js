const express = require("express");
const upload = require('../middleware/upload');
const {uploadPdf,product}  = require("../controller/book.controller");
const router = express.Router();

//http://localhost:3000/upload-pdf

router.post('/upload-pdf', upload.single('file'), uploadPdf);
router.get("/get-url",product);
module.exports = router;
