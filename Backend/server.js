const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Donor = require("./models/Donor");
const User = require("./models/User");
const Request = require("./models/Request");
const Volunteer = require("./models/Volunteer");
const Donation = require("./models/Donation");

const app = express();

app.use(cors());
app.use(express.json());


// ==============================
// MONGODB CONNECT
// ==============================

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

const donors = await Donor.find();
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

app.post("/signup", async (req,res)=>{

const user = new User(req.body);

await user.save();

res.send("User Registered");

});


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

app.post("/add-request", async(req,res)=>{

const request = new Request(req.body);

await request.save();

res.send("Blood request submitted");

});


// ==============================
// GET REQUESTS
// ==============================

app.get("/requests", async(req,res)=>{

const requests = await Request.find();

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
// ADD VOLUNTEER
// ==============================

app.post("/add-volunteer", async(req,res)=>{

const volunteer = new Volunteer(req.body);

await volunteer.save();

res.send("Volunteer added");

});


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
// SERVER START
// ==============================

app.listen(5000, ()=>{

console.log("LifeShare Backend Server Running");

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



// APPROVED REQUESTS COUNT
app.get("/approved-requests", async (req, res) => {

const total = await Request.countDocuments({ status: "Approved" })

res.json({ total })

})



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




// ================================
// REQUEST STATUS REPORT
// ================================

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

// GET ALL REQUESTS

app.get("/requests", async (req,res)=>{

const requests = await Request.find()

res.json(requests)

})








// ==============================
// GET REQUESTS
// ==============================

app.get("/requests", async(req,res)=>{

const requests = await Request.find()
res.json(requests)

})


// ==============================
// APPROVE REQUEST
// ==============================

app.put("/approve-request/:id", async (req,res)=>{

await Request.findByIdAndUpdate(req.params.id,{
status:"Approved"
})

res.json({message:"Request Approved"})

})


// ==============================
// DELETE REQUEST
// ==============================

app.delete("/delete-request/:id", async (req,res)=>{

await Request.findByIdAndDelete(req.params.id)

res.json({message:"Request Deleted"})

})


// ==============================
// APPROVED REQUESTS COUNT
// ==============================

app.get("/approved-requests", async(req,res)=>{

const total = await Request.countDocuments({status:"Approved"})

res.json({total})

})

















// USER PROFILE
app.get("/user-profile", async (req,res)=>{
const user = await User.findOne().sort({_id:-1})
res.json(user)
})

// UPDATE PROFILE
app.put("/update-profile", async (req,res)=>{
const {name,blood,location,phone}=req.body
await User.findOneAndUpdate(
{phone:phone},
{name,blood,location}
)
res.send("Profile Updated")
})

// USER REQUESTS
app.get("/my-requests/:phone", async (req,res)=>{

const phone = req.params.phone

const requests = await Request.find({phone:phone})
.sort({date:-1})

res.json(requests)

})


// SERVER START (LAST LINE)
app.listen(5000, ()=>{
console.log("LifeShare Backend Server Running")
})