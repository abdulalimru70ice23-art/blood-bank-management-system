const mongoose = require("mongoose")

const donationSchema = new mongoose.Schema({

donor:String,
blood:String,
location:String,
date:String

})

module.exports = mongoose.model("Donation",donationSchema)