const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ===== DB =====
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

// ===== MODELS =====
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

// ===== AUTH =====
app.post("/register", async(req,res)=>{
  const {username,password} = req.body;

  const exists = await User.findOne({username});
  if(exists) return res.json({success:false,message:"Exists"});

  const hashed = await bcrypt.hash(password,10);

  await User.create({username,password:hashed,role:"user"});
  res.json({success:true});
});

app.post("/login", async(req,res)=>{
  const user = await User.findOne({username:req.body.username});
  if(!user) return res.json({success:false});

  const match = await bcrypt.compare(req.body.password,user.password);
  if(!match) return res.json({success:false});

  const token = jwt.sign(
    {id:user._id,role:user.role},
    process.env.JWT_SECRET
  );

  res.json({success:true,token,role:user.role});
});

// ===== MIDDLEWARE =====
function auth(req,res,next){
  try{
    req.user = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
    next();
  }catch{
    res.status(401).json({error:"Unauthorized"});
  }
}

function isAdmin(req,res,next){
  if(req.user.role!=="admin") return res.status(403).json({error:"Forbidden"});
  next();
}

// ===== ADD STUDENT (dynamic) =====
app.post("/add", auth, isAdmin, async(req,res)=>{
  const s = req.body;

  // validate marks
  for(let key in s.subjects){
    if(s.subjects[key] > 100){
      return res.json({success:false,message:"Max 100"});
    }
  }

  s.total = Object.values(s.subjects).reduce((a,b)=>a+b,0);

  if(s.total>=80) s.grade="A+";
  else if(s.total>=60) s.grade="A";
  else if(s.total>=40) s.grade="B";
  else s.grade="F";

  await Student.create(s);
  res.json({success:true});
});

// ===== GET =====
app.get("/students", auth, async(req,res)=>{
  res.json(await Student.find());
});

// ===== UPDATE =====
app.put("/update/:id", auth, isAdmin, async(req,res)=>{
  await Student.findOneAndUpdate({id:req.params.id},req.body);
  res.json({success:true});
});

// ===== DELETE =====
app.delete("/delete/:id", auth, isAdmin, async(req,res)=>{
  await Student.findOneAndDelete({id:req.params.id});
  res.json({success:true});
});

app.listen(3000,()=>console.log("Server running"));
