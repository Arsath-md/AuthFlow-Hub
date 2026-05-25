const googles = require("../models/googleSchema")

exports.setdata =async(req , res)=>{
    try{
        const {email,photoURL,displayName} = req.body;
        const exiting = await googles.findOne({email:email})
        if(exiting){
            return res.json({msg:false})
        }

        const additem = await googles.create({
            email:email,
            photoURL:photoURL,
            displayName:displayName
        })
        res.json({msg:true})
        


    }catch(e){
        console.log("error in ggooles")
    }
}

exports.getdata= async(req , res)=>{
    try{
        const additem = await googles.find({})
        res.json(additem)
        
    }catch(e){
        console.log("error in show data")
    }}