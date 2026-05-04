const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

name:String,
phone:String,
password:String,

bloodGroup:String,
location:String,

nidFront:String,
nidBack:String,

isDonor: {
  type: Boolean,
  default: false
}

})

module.exports = mongoose.model("User",userSchema)