import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();

//CONFIGURATION
const app=express();
dotenv.config();
app.use(cors());
app.use(session());
const PORT=process.env.PORT || 3000;


//MIDDLEWARE
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());


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