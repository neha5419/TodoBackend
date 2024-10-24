import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();

//CONFIGURATION
const app=express();
dotenv.config();
app.use(cors());
const PORT=process.env.PORT || 3000;


//MIDDLEWARE
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

//ROUTES

//allow user to create todo;
//allow to read there todo;
//allow user to update todo;
//allow user to delete todo;

//ROUTES

app.post("/api/auth/login",async(req,res)=>{
    const {email,password}=req.body;
try{
    const user=await prisma.users.findUnique({
        where:{email:email}
    })

    if(user){
      const hashPassword=user.password
      const match=await bcrypt.compare(password,hashPassword);
       if(match){
        res.status(200).json(user);
        
       }
       else{
        res.status(400).json("wrong password")
       }
    }else{
        return res.status(404).json({error:"no users exists"});
    }
}catch(error){
 res.status(400).json({error:"Wrong user input"})
}
})



app.post("/api/auth/register",async(req,res)=>{
  const {name,email,password} =req.body;

  
  try{
      
    const checkMail=await prisma.users.findUnique({
      where:{email:email}
    })
   if(checkMail){
    return res.status(400).json({message:"User already registered"})
   }

     const saltRounds = 10; // Recommended salt rounds: 10
    const hashPassword = await bcrypt.hash(password, saltRounds);
  
    const newUser=await prisma.users.create({
        data:{
            email:email,
            password:hashPassword,
            name:name,
        }
    })
      return res.status(200).json({ user: newUser });
  }catch(error){
    console.log(error);
    return res.status(400).json({error:"error"});
  }
})

//user id corresponding -todos table apna content -store
//findMany
//create
//update
//delete


app.patch("/api/forget",async(req,res)=>{
    
  const {email,password}=req.body;

  try{
    const hashPass=await bcrypt.hash(password,4);
    const updatePass=await prisma.users.update({
      where:{email:email},
      data:{password:hashPass}
    })

    if(updatePass){
      if(updatePass.password){
        res.status(200).json("Updated password successfully");
      }else{
        res.status(400).json("password not entered");
      }
    }
    else{
      res.status(400).json("No input encountered..");
    }
  }catch(error){
      console.log(error);
  }

})

app.get("/api/todos",async(req,res)=>{
       const u_id=Number(req.headers.u_id);
    try{
      const check=await prisma.todo.findMany({
        where:{u_id:u_id}

      })
      res.json(check);
    }catch(error){
      console.log(error);
        res.status(400).json({error:"no such email found"});
    }
    
})


app.post("/api/add/todos",async(req,res)=>{
   const {content,id}=req.body;
   

   try{
    const posttodo=await prisma.todo.create({
        data:{
            content:content,
            u_id:id
        }
    })
    
    res.status(200).json(posttodo)

   }catch(error){
    console.log(error);
     res.status(400).json("cannot add todo");
   }
})


//patch todo

app.patch("/api/patch/todos",async(req,res)=>{
            
               const {content,id}=req.body;

            try{
               const patches=await prisma.todo.update({
                where:{t_id:id},
                data:{content:content}
               })

               res.status(200).json({data:patches})
            }catch(error){
                res.status(400).json({error:"Cannot find id"})
            }
})

//delete todo

app.delete("/api/del/todos",async(req,res)=>{
  const {id}=req.body;
  console.log("Received ID:", id);
  try{
    const del=await prisma.todo.delete({
      where:{t_id:Number(id)}
    })

    res.status(200).json({deluser:del})
  }catch(error){
    res.status(400).json({error:"Cannot find id"})
  }
})

app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`);
})