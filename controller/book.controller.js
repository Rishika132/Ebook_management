
const Book = require('../model/book.model');

const uploadPdf = async (req, res) => {
  try {
     const {product_id}=req.body;
    if (!req.file) return res.status(400).json({ message: 'No PDF uploaded' });

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const newBook = new Book({ url: fileUrl , product_id});
    await newBook.save();

    res.status(200).json({ message: 'PDF uploaded & URL saved.',   id: newBook._id ,fileUrl,product_id  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { uploadPdf };
