const express=require('express');
const bcrypt=require('bcryptjs');
const User=require('../model/userSchema');

const jwt=require('jsonwebtoken');
const router=express.Router();

router.post('/signup', async(req,res)=>
    { 
    const {name,email,password}=req.body;
    try{
        let user= await User.findOne({email});

        if(user)
        {
            return res.status(400).json({message:'user already exist'})
        }

        //Hashing paasword
        const salt=await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);

        user=new User({name,email,password:hashedPassword,})

        await user.save();//save to db
        res.status(201).json({message:'User created successfully'});

    }
    catch (error){
        console.error(error);
        res.status(500).json({message:'Server error in routes'});
        
    }

})

router.post('/login', async(req,res)=>{ 
    const {email,password}=req.body;
    try{
       
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({message:'user not found'});
        }
        
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch)
        {
            return res.status(200).json({message:'Invalid Credientals'});
        }

        const payload={
            user:{
                id: user.id,
            },
        };
       
        jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:'1h'},(err,token)=>{if(err) throw err;res.json({token});})

    }
    catch (error){
        console.error(error);
        res.status(500).json({message:'Server error in routes'});

    }

})


module.exports=router;
