require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.static("public"));

/* ================= DB ================= */
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

/* ================= MODELS ================= */
const User = mongoose.model("User", {
  username:String,
  password:String,
  role:String
});

const Student = mongoose.model("Student", {
  id:String,
  name:String,
  subjects:Object,
  total:Number,
  grade:String
});

/* ================= AUTH ================= */

// REGISTER
app.post("/register", async(req,res)=>{
  try{
    const {username,password} = req.body;

    if(!username || !password){
      return res.json({success:false,message:"Fill all fields"});
    }

    const exists = await User.findOne({username});
    if(exists) return res.json({success:false,message:"User exists"});

    const hashed = await bcrypt.hash(password,10);

    await User.create({username,password:hashed,role:"user"});

    res.json({success:true});
  }catch(err){
    res.status(500).json({error:"Register error"});
  }
});

// LOGIN
app.post("/login", async(req,res)=>{
  try{
    const user = await User.findOne({username:req.body.username});
    if(!user) return res.json({success:false});

    const match = await bcrypt.compare(req.body.password,user.password);
    if(!match) return res.json({success:false});

    const token = jwt.sign(
      {id:user._id,role:user.role},
      process.env.JWT_SECRET
    );

    res.json({success:true,token,role:user.role});
  }catch{
    res.status(500).json({error:"Login error"});
  }
});

/* ================= MIDDLEWARE ================= */

function auth(req,res,next){
  try{
    req.user = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
    next();
  }catch{
    res.status(401).json({error:"Unauthorized"});
  }
}

function isAdmin(req,res,next){
  if(req.user.role!=="admin"){
    return res.status(403).json({error:"Forbidden"});
  }
  next();
}

/* ================= ADD STUDENT ================= */

app.post("/add", auth, isAdmin, async(req,res)=>{
  try{
    const s = req.body;

    // validate basic
    if(!s.id || !s.name){
      return res.json({success:false,message:"ID & Name required"});
    }

    // prevent duplicate ID
    const exists = await Student.findOne({id:s.id});
    if(exists){
      return res.json({success:false,message:"ID already exists"});
    }

    // validate marks
    for(let key in s.subjects){
      if(s.subjects[key] > 100){
        return res.json({success:false,message:`${key} max 100`});
      }
    }

    // calculate total
    s.total = Object.values(s.subjects).reduce((a,b)=>a+b,0);

    // calculate average
    const avg = s.total / Object.keys(s.subjects).length;

    // grade system
    if(avg>=80) s.grade="A+";
    else if(avg>=60) s.grade="A";
    else if(avg>=40) s.grade="B";
    else s.grade="F";

    await Student.create(s);

    res.json({success:true});
  }catch(err){
    res.status(500).json({error:"Add error"});
  }
});

/* ================= GET ================= */

app.get("/students", auth, async(req,res)=>{
  try{
    const data = await Student.find();
    res.json(data);
  }catch{
    res.status(500).json({error:"Fetch error"});
  }
});

/* ================= UPDATE ================= */

app.put("/update/:id", auth, isAdmin, async(req,res)=>{
  try{
    await Student.findOneAndUpdate({id:req.params.id},req.body);
    res.json({success:true});
  }catch{
    res.status(500).json({error:"Update error"});
  }
});

/* ================= DELETE ================= */

app.delete("/delete/:id", auth, isAdmin, async(req,res)=>{
  try{
    await Student.findOneAndDelete({id:req.params.id});
    res.json({success:true});
  }catch{
    res.status(500).json({error:"Delete error"});
  }
});

/* ================= START ================= */

app.listen(3000,()=>console.log("Server running on port 3000"));

