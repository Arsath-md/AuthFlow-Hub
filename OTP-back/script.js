const { config } = require("dotenv");
const express = require("express")
const app = express();
const route = require("./routes/routes")
const cors = require("cors")

require('dotenv'),config()
app.use(express.json())
app.use(cors())


const mongo = require("mongoose")

mongo.connect(process.env.MONGO_URL)
    .then(()=> console.log("mongo db is connected"))
    .catch((err)=> console.error("there is an error in mongo connect"+err))
app.use("/",route)

app.listen(process.env.PORT,()=>{
    console.log(`server is running in the port:${process.env.PORT} `)
})