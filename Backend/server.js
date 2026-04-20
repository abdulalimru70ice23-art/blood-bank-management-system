const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Donor = require("./models/Donor");
const User = require("./models/User");
const Request = require("./models/Request"); // NEW

const app = express();

app.use(cors());
app.use(express.json());


// ==============================
// MONGODB CONNECT
// ==============================

mongoose.connect("mongodb://127.0.0.1:27017/lifeShare")
    .then(() => console.log("MongoDB Connected"));


// ==============================
// ADD DONOR
// ==============================

app.post("/add-donor", async (req, res) => {

    try {

        const donor = new Donor(req.body);

        await donor.save();

        res.send("Donor Added Successfully");

    }

    catch (err) {

        console.log(err);
        res.send("Error saving donor");

    }

});


// ==============================
// GET ALL DONORS
// ==============================

app.get("/donors", async (req, res) => {

    const donors = await Donor.find();

    res.json(donors);

});


// ==============================
// TOTAL DONOR COUNT
// ==============================

app.get("/total-donors", async (req, res) => {

    const total = await Donor.countDocuments();

    res.json({ total });

});


// ==============================
// BLOOD GROUP STATISTICS
// ==============================

app.get("/blood-stats", async (req, res) => {

    const stats = await Donor.aggregate([
        {
            $group: {
                _id: "$blood",
                count: { $sum: 1 }
            }
        }
    ]);

    res.json(stats);

});


// ==============================
// DELETE DONOR
// ==============================

app.delete("/delete-donor/:id", async (req, res) => {

    await Donor.findByIdAndDelete(req.params.id);

    res.send("Donor Deleted Successfully");

});


// ==============================
// USER SIGNUP
// ==============================

app.post("/signup", async (req, res) => {

    const user = new User(req.body);

    await user.save();

    res.send("User Registered");

});


// ==============================
// LOGIN USER
// ==============================

app.post("/login", async (req, res) => {

    const { phone, password } = req.body;

    const user = await User.findOne({ phone: phone });

    if (!user) {
        return res.send("User not found");
    }

    if (user.password !== password) {
        return res.send("Wrong password");
    }

    res.send("Login Successful");

});


// ==============================
// ADD BLOOD REQUEST
// ==============================

app.post("/add-request", async (req, res) => {

    try {

        const request = new Request(req.body);

        await request.save();

        res.send("Blood request submitted successfully");

    }

    catch (err) {

        console.log(err);
        res.send("Error submitting request");

    }

});


// ==============================
// TOTAL REQUEST COUNT
// ==============================

app.get("/total-requests", async (req, res) => {

    const total = await Request.countDocuments();

    res.json({ total });

});


// ==============================
// TOTAL VOLUNTEERS
// ==============================

app.get("/total-volunteers", (req, res) => {
    res.json({ total: 0 });
});


// ==============================
// TOTAL DONATIONS
// ==============================

app.get("/total-donations", (req, res) => {
    res.json({ total: 0 });
});


// ==============================
// SERVER START
// ==============================

app.listen(5000, () => {
    console.log("LifeShare Backend Server Running");
});


// GET ALL REQUESTS

app.get("/requests", async (req, res) => {

    const requests = await Request.find();

    res.json(requests);

});



// ADD REQUEST
// ==============================

app.post("/add-request", async (req, res) => {

    const request = new Request(req.body)

    await request.save()

    res.send("Blood request submitted")

})


// ==============================
// GET ALL REQUESTS
// ==============================

app.get("/requests", async (req, res) => {

    const requests = await Request.find();

    res.json(requests);

});


// ==============================
// APPROVE REQUEST
// ==============================

app.put("/approve-request/:id", async (req, res) => {

    await Request.findByIdAndUpdate(req.params.id, {
        status: "Approved"
    });

    res.send("Request Approved");

});


// ==============================
// DELETE REQUEST
// ==============================

app.delete("/delete-request/:id", async (req, res) => {

    await Request.findByIdAndDelete(req.params.id);

    res.send("Request Deleted");

});