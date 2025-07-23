const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
     file_name:{
         type: String,
        required: true
     },
    url: {
        type: String,
        required: true
     },
     product_title:{
         type: String,
        required: true
     },
     size:{
         type: String,
        required: true
     }
    
});
const Book = mongoose.model("book", bookSchema);
module.exports = Book;