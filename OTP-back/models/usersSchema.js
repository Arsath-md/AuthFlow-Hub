const mongo = require("mongoose")

const userSchema = new mongo.Schema({
    name :String,
    email:String,
    password:String
},{
    timestamps:true
})

module.exports = mongo.model("Users",userSchema)