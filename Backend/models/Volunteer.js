const mongoose = require("mongoose")

const volunteerSchema = new mongoose.Schema({

name: String,
phone: String,
email: String,
city: String,
reason: String,

status:{
type: String,
default: "Pending"
}

})

module.exports = mongoose.model("Volunteer", volunteerSchema)