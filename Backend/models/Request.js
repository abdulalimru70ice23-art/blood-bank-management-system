const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({

patient:String,
phone:String,
blood:String,
location:String,
reason:String,

status:{
type:String,
default:"Pending"
},

date:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Request",requestSchema)