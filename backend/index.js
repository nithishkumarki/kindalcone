const express=require('express');
const cors=require("cors");
const dotenv=require("dotenv");
const authRoute=require("./routes/authroutes");
const bookRoute=require("./routes/bookroutes");
const bodyParser=require("body-parser");

require('./db');
const app=express();

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.use(express.json());

//configure cors
const corsOperation={
    origin:'*',// allows for all origin ,(for developemen)for production spefiy your domain
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-type','Authorization']
};

app.use(cors(corsOperation));

app.use("/api/books",bookRoute);
app.use("/api/auth",authRoute);

//form uploads show as static files, fronten will able to read from uploads files
app.use('/uploads',express.static('uploads'));

const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`Listening on port ${port}`));



