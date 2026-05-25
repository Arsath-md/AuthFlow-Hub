const mongo = require("mongoose")

const otpSchema = new mongo.Schema({
    email:String,
    otp:String,
    expire:Date
})

module.exports = mongo.model("Otps",otpSchema)