const Book = require('../model/book.model');
const uploadPdf = async (req, res) => {
  try {
     const { file_name, product_title,size} = req.body;
    const newBook = new Book({
      file_name,
      product_title,
      size
    });
    await newBook.save();
    res.status(200).json({
      message: ' PDF uploaded & product ID saved',
      id: newBook._id,
      fileUrl,file_name,product_title,size
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const product= async(req,res)=>{
 Book.find()
    .then(result=>{
        return res.status(200).json({products:result});
    }).catch(err =>{
        return res.status(500).json({error: "Internal Server Error"});
    });
}
module.exports = { uploadPdf,product };
