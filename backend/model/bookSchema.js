const mongoose=require('mongoose');

const bookSchema=new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amazonLink: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
    required: true,
  },
  category: {  
    type: String,
    enum: ['Book', 'Comic', 'Sample'], 
    required: true
},
addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

})

const Book=mongoose.model('Book',bookSchema);
module.exports=Book;
