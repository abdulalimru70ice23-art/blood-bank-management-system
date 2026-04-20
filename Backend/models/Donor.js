const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({

name:String,
phone:String,
whatsapp:String,
blood:String,
age:Number,
gender:String,
weight:Number,
location:String,
profession:String,
lastDonation:String,
emergency:String,
reason:String

});

module.exports = mongoose.model("Donor", donorSchema);