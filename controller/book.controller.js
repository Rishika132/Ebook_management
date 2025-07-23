const Book = require('../model/book.model');
const uploadPdf = async (req, res) => {
  try {
     const { file_name, product_title,size} = req.body;
    if (!req.file) return res.status(400).json({ message: 'No PDF uploaded' });
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const newBook = new Book({
      url: fileUrl,
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
