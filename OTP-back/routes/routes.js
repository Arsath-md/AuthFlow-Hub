const express = require("express")
const route = express.Router()
const {register , verify ,getregister} = require("../contollers/register")
const {setdata ,getdata} = require("../contollers/login")

route.post("/register",register)
route.get("/verify",verify)
route.post("/getter",setdata)
route.get("/shows",getdata)

route.get("/getregister",getregister)
module.exports = route