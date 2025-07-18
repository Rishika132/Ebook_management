const Book = require('../model/book.model');

const uploadPdf = async (req, res) => {
  try {
    console.log(req.body);

    if (!req.file) return res.status(400).json({ message: 'No PDF uploaded' });

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ message: 'Product ID missing' });

    const newBook = new Book({
      url: fileUrl,
      product_id: product_id, 
    });

    await newBook.save();

    res.status(200).json({
      message: '✅ PDF uploaded & product ID saved',
      id: newBook._id,
      fileUrl,
    });
  } catch (err) {
    console.error(err);
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
