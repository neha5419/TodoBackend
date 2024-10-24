import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app=express();
dotenv.config();
const PORT=process.env.PORT || 3000;
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//routes..
//set a cookiee.
app.get("/",(req,res)=>{
    
    res.cookie("user","Neha Phadtare" ,{maxAge:900000,httpOnly:true});
    res.send("Hello");
    
})
//reading a cookie..
app.get("/get-cookie",(req,res)=>{
    let user=req.cookies.user;

    if(user){
    res.send(`cookie retrived: ${user}`);
    }else{
        res.send("Cookie not found");
    }
})

app.get("/clear",(req,res)=>{
    res.clearCookie("user");
    res.send("Cookie cleared");
})

app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`);
})