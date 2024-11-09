const express = require('express');
const multer = require('multer');
const path = require('path');
const Book = require('../model/bookSchema');
const router = express.Router();
const authenticateUser = require('../authenticateUser');

// Configure Multer storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });


router.post('/create', authenticateUser, upload.single('pdf'), async (req, res) => {
  const { image, title, author, description, price, amazonLink, category } = req.body;
  const pdf = req.file ? req.file.path : null;
  
 
  const userId = req.user.id; 

  try {
      
      const newBook = new Book({
          image,
          title,
          author,
          description,
          price,
          amazonLink,
          pdf,
          category,
          addedBy: userId, 
      });

      await newBook.save();
      res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error in bookRoutes' });
  }
});



router.get('/all',authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
        const books = await Book.find({ addedBy: userId });
        if (!books) {
          return res.status(404).json({ message: 'No books found' });
        }
    
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error in bookRoutes' });
    }
});

// Route to get book by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error in finding ID of book' });
    }
});

module.exports = router;
