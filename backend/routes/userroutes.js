const express = require('express');
const User = require('../model/userSchema');
const Book = require('../model/bookSchema');
const router = express.Router();


router.get('/all', async (req, res) => {
    try {
        const users = await User.find({}, { name: 1, email: 1 });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error in fetching users' });
    }
});


router.get('/user/:userId', async (req, res) => {
    try {
        const books = await Book.find({ addedBy: req.params.userId });
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching books for user' });
    }
});

module.exports = router;

