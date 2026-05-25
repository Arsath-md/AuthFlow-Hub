const mongo = require("mongoose")

const googleSchema = new mongo.Schema({
    displayName:String,
    photoURL:String,
    email:String
},{
    timestamps:true
})

module.exports = mongo.model("Logins",googleSchema)