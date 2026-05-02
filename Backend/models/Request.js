const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({

patient:String,
phone:String,
blood:String,
location:String,
units:Number,
location:String,
reason:String,

document:String,   // 👈 এইটা add করতে হবে

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