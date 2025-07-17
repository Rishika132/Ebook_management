const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    product_id:{
        type: String,
        required: true
    }
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;