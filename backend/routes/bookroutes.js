const express = require('express');
const multer = require('multer');
const path = require('path');
const Book = require('../model/bookSchema');
const router = express.Router();

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

// Route to create a new book
router.post('/create', upload.single('pdf'), async (req, res) => {
    const { image, title, author, description, price, amazonLink, category } = req.body;
    const pdf = req.file ? req.file.path : null;

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
        });
        await newBook.save();
        res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error in bookRoutes' });
    }
});

// Route to get all books
router.get('/all', async (req, res) => {
    try {
        const books = await Book.find();
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
