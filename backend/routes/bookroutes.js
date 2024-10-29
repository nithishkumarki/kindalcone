const express = require('express');
const multer=require('multer');
const path=require('path');
const Book=require('../model/bookSchema');
const router=express.Router();

const storage=multer.diskStorage({
    destination : function (req,file,cd)
    {
        cd(null,'uploads/');
    },
    filename : function(req,file,cd)
    {
        cd(null, `${Date.now()}-${file.originalname}`);

    }
})


//sorted in upload ,this fun wold be called
const upload=multer({storage: storage});
//uploading books to mongo db
router.post('/create',upload.single('pdf') ,async(req,res)=>{
  
    const {image,title,author,description,price,amazonLink}=req.body;
    const pdf=req.file.path;
    try {
    const newBook = new Book({
        image,
        title,
        author,
        description,
        price,
        amazonLink,
        pdf,
      });

    await newBook.save();
    res.status(201).json({ message: 'Book created successfully', book: newBook });


  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in bookRoutes' });
  }

})
///showing all books
router.get('/all',async (req,res)=>{
       try{
         const books=await Book.find();
         res.status(200).json(books);
       }
       catch(error)
       {
        console.error(error);
        res.status(500).json({ message: 'Server error in bookRoutes' });
       }
})
// get book by specific id
router.get('/:id',async(req,res)=>{
    const {id}=req.params;

    try{
        const book=await Book.findById(id);
        if(!book)
        {
            return res.status(404).json({message:'book not found'});

        }
        res.status(200).json(book);
    }
    catch(error)
       {
        console.error(error);
        res.status(500).json({ message: 'Server error in finding id of book' });
       }

})




module.exports=router;
