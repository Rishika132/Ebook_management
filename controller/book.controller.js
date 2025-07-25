const Book = require('../model/book.model');

const uploadPdf = async (req, res) => {
  try {
    const { file_name, product_title, size } = req.body;

    if (!file_name || !product_title || !size) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newBook = new Book({
      file_name,
      product_title,
      size
    });

    await newBook.save();

    return res.status(200).json({
      message: 'PDF uploaded & product saved successfully',
      id: newBook._id,
      file_name,
      product_title,
      size
    });

  } catch (err) {
    console.error("Upload error:", err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const product = async (req, res) => {
  try {
    const products = await Book.find();
    return res.status(200).json({ products });
  } catch (err) {
    console.error("Fetch error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { uploadPdf, product };
