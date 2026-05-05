const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

/* ==============================
FILE UPLOAD SETUP
============================== */

const storage = multer.diskStorage({

destination: function(req,file,cb){
cb(null, path.join(__dirname,"uploads"))
},

filename: function(req,file,cb){
cb(null, Date.now()+"-"+file.originalname)
}

})

const upload = multer({storage})



const Donor = require("./models/Donor");
const User = require("./models/User");
const Request = require("./models/Request");
const Volunteer = require("./models/Volunteer");
const Donation = require("./models/Donation");

const app = express();

app.use(cors());
app.use(express.json());


/* ==============================
SERVE UPLOADED DOCUMENTS
============================== */

app.use("/uploads", express.static(path.join(__dirname,"uploads")))



/* ==============================
MONGODB CONNECT
============================== */

mongoose.connect("mongodb://127.0.0.1:27017/lifeShare")
.then(()=> console.log("MongoDB Connected"))
.catch(err=>console.log(err));










// ==============================
// ADD DONOR
// ==============================

app.post("/add-donor", async (req,res)=>{

try{

const donor = new Donor(req.body);
await donor.save();

// 🔥 ADD THIS LINE
await User.updateOne(
  { phone: req.body.phone },
  { isDonor: true }
);

res.send("Donor Added Successfully");

}catch(err){

console.log(err);
res.send("Error saving donor");

}

});


// ==============================
// GET DONORS
// ==============================

app.get("/donors", async (req,res)=>{

const donors = await Donor.find().sort({ _id: -1 });
res.json(donors);

});


// ==============================
// TOTAL DONORS
// ==============================

app.get("/total-donors", async (req,res)=>{

const total = await Donor.countDocuments();
res.json({total});

});


// ==============================
// BLOOD GROUP STATS
// ==============================

app.get("/blood-stats", async (req,res)=>{

const stats = await Donor.aggregate([
{
$group:{
_id:"$blood",
count:{ $sum:1 }
}
}
]);

res.json(stats);

});


// ==============================
// DELETE DONOR
// ==============================

app.delete("/delete-donor/:id", async (req,res)=>{

await Donor.findByIdAndDelete(req.params.id);

res.send("Donor Deleted");

});


// ==============================
// USER SIGNUP
// ==============================
app.post("/signup",
upload.fields([
{ name:"nidFront", maxCount:1 },
{ name:"nidBack", maxCount:1 }
]),
async (req,res)=>{

const user = new User({

name:req.body.name,
phone:req.body.phone,
password:req.body.password,

bloodGroup:req.body.bloodGroup,
location:req.body.location,

nidFront: req.files["nidFront"] ? req.files["nidFront"][0].filename : "",
nidBack: req.files["nidBack"] ? req.files["nidBack"][0].filename : ""

})

await user.save()

res.send("User Registered")

})

// ==============================
// LOGIN
// ==============================

app.post("/login", async (req,res)=>{

const { phone, password } = req.body;

const user = await User.findOne({ phone });

if(!user){
return res.send("User not found");
}

if(user.password !== password){
return res.send("Wrong password");
}

res.send("Login Successful");

});


// ==============================
// ADD BLOOD REQUEST
// ==============================

app.post("/add-request", upload.single("document"), async (req,res)=>{

const request = {

patient: req.body.patient,
phone: req.body.phone,
blood: req.body.blood,
location: req.body.location,
units: req.body.units,
reason: req.body.reason,
document: req.file ? req.file.filename : "",

status: "Pending",
date: new Date()

}

const newRequest = new Request(request)

await newRequest.save()

res.send("Request submitted successfully")

})



// ==============================
// GET ALL REQUESTS (ADMIN PAGE)
// ==============================

app.get("/requests", async(req,res)=>{

const requests = await Request.find().sort({date:-1});

res.json(requests);

});


// ==============================
// APPROVE REQUEST
// ==============================

app.put("/approve-request/:id", async (req,res)=>{

await Request.findByIdAndUpdate(req.params.id,{
status:"Approved"
});

res.send("Request Approved");

});


// ==============================
// REJECT REQUEST
// ==============================

app.put("/reject-request/:id", async (req,res)=>{

await Request.findByIdAndUpdate(req.params.id,{
status:"Rejected"
});

res.send("Request Rejected");

});


// ==============================
// DELETE REQUEST
// ==============================

app.delete("/delete-request/:id", async (req,res)=>{

await Request.findByIdAndDelete(req.params.id);

res.send("Request Deleted");

});


// ==============================
// TOTAL REQUESTS
// ==============================

app.get("/total-requests", async(req,res)=>{

const total = await Request.countDocuments();

res.json({total});

});


// ==============================
// APPROVED REQUESTS COUNT
// ==============================

app.get("/approved-requests", async (req, res) => {

const total = await Request.countDocuments({ status: "Approved" })

res.json({ total })

})


// ==============================
// ADD VOLUNTEER
// ==============================

app.post("/add-volunteer", async(req,res)=>{

const volunteer = new Volunteer(req.body);

await volunteer.save();

res.send("Volunteer added");

});


// ==============================
// GET ALL VOLUNTEERS
// ==============================

app.get("/volunteers", async (req,res)=>{

const volunteers = await Volunteer.find()

res.json(volunteers)

})


// ==============================
// APPROVE VOLUNTEER
// ==============================

app.put("/approve-volunteer/:id", async (req,res)=>{

await Volunteer.findByIdAndUpdate(req.params.id,{
status:"Approved"
})

res.send("Volunteer Approved")

})


// ==============================
// DELETE VOLUNTEER
// ==============================

app.delete("/delete-volunteer/:id", async (req,res)=>{

await Volunteer.findByIdAndDelete(req.params.id)

res.send("Volunteer Deleted")

})


// ==============================
// TOTAL VOLUNTEERS
// ==============================

app.get("/total-volunteers", async(req,res)=>{

const total = await Volunteer.countDocuments();

res.json({total});

});


// ==============================
// ADD DONATION
// ==============================

app.post("/add-donation", async(req,res)=>{

const donation = new Donation(req.body);

await donation.save();

res.send("Donation recorded");

});


// ==============================
// TOTAL DONATIONS
// ==============================

app.get("/total-donations", async(req,res)=>{

const total = await Donation.countDocuments();

res.json({total});

});


// ==============================
// TOP CITIES WITH DONORS
// ==============================

app.get("/top-cities", async(req,res)=>{

const cities = await Donor.aggregate([
{
$group:{
_id:"$location",
count:{ $sum:1 }
}
},
{ $sort:{ count:-1 } },
{ $limit:5 }
])

res.json(cities)

})


// ==============================
// REQUEST STATUS REPORT
// ==============================

app.get("/request-status", async (req, res) => {

try{

const pending = await Request.countDocuments({status:"Pending"})
const approved = await Request.countDocuments({status:"Approved"})

res.json({
pending: pending,
approved: approved
})

}catch(err){
res.status(500).json({error:err.message})
}

})

// ==============================
// USER PROFILE (BY PHONE)
// ==============================

app.get("/user/:phone", async (req,res)=>{

const phone = req.params.phone

try{

const user = await User.findOne({phone:phone})

if(!user){
return res.status(404).json({message:"User not found"})
}

res.json(user)

}catch(err){

res.status(500).json({error:"Server error"})

}

})


// ==============================
// UPDATE PROFILE
// ==============================

app.put("/update-profile", async (req,res)=>{

const {name,bloodGroup,location,phone,password} = req.body

const updateData = {
name,
bloodGroup,
location
}

if(password){
updateData.password = password
}

try{

await User.findOneAndUpdate(
{phone:phone},
updateData
)

res.send("Profile Updated Successfully")

}catch(err){

res.status(500).send("Update Failed")

}

})


// ==============================
// USER REQUESTS
// ==============================

app.get("/my-requests/:phone", async (req,res)=>{

const phone = req.params.phone

try{

const requests = await Request.find({phone:phone})
.sort({date:-1})

res.json(requests)

}catch(err){

res.status(500).json({error:"Server error"})

}

})





// ==============================
// TOGGLE DONOR STATUS
// ==============================

app.put("/toggle-donor/:phone", async (req,res)=>{

try{

const user = await User.findOne({phone:req.params.phone})

if(!user){
return res.status(404).send("User not found")
}

user.isDonor = req.body.isDonor
await user.save()

res.json({isDonor:user.isDonor})

}catch(err){

res.status(500).send("Error")

}

})




// ==============================
// admin donor list page update 
// ==============================
app.put("/toggle-donor-status/:id", async (req, res) => {

try{

const donor = await Donor.findById(req.params.id);

if(!donor){
return res.status(404).json({message:"Donor not found"});
}

donor.isActive = !donor.isActive;

await donor.save();

res.json({message:"Status updated", isActive: donor.isActive});

}catch(err){
res.status(500).json({error: err.message});
}

});





// ===============================
// GET ALL USERS (ADMIN)
// ===============================
app.get("/all-users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});


// ===============================
// VERIFY USER
// ===============================
app.put("/verify-user/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isVerified: true });
  res.send("User Verified");
});


// ===============================
// DELETE USER
// ===============================
app.delete("/delete-user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send("User Deleted");
});



// ==============================
// SERVER START
// ==============================

app.listen(5000, ()=>{

console.log("LifeShare Backend Server Running")

})