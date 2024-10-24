import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app=express();
dotenv.config();
const PORT=process.env.PORT || 3000;
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const SECRET_KEY='mysecretkey';
//routes..

//middleware for jwt token...

function jwtchecking(req,res,next){
      const token =req.cookies.jwt;

      if(!token){
        return res.status(400).json({error:"Token is required"});
      }
      jwt.verify(token,SECRET_KEY,(err,user)=>{
        if(err){
          res.status(403).json({error:"Wrong token"});
        }
      })
      next();
}
app.get("/login",(req,res)=>{
    //jwt token
    const user={id:1,username:'cute_neha'};
   const token= jwt.sign(user,SECRET_KEY,{expiresIn:'1h'});
   res.cookie("jwt",token,{httpOnly:true});
    res.send("token send successfully");
})
app.get("/dashboard",jwtchecking,(req,res)=>{
  //if user has jwt token only then user can come to dashboard..
 res.json("Dashboard Page");

})
app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`);
})