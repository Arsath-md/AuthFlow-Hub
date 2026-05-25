const user = require("../models/usersSchema")
const crypt = require("bcrypt")
const otps = require("../models/otpSchema")
const nodemail = require("nodemailer")

exports.register = async(req , res )=>{
    try{
        const {name,email,password} = req.body
        console.log(password);
        
        const hashed = await crypt.hash(password,10)
        const setdata = await user.create({
            name:name,
            email:email,
            password:hashed
        })
        if(!setdata){
            return res.json({msg:"cant add to db "})
        }

        const OTPm = Math.floor(100000 + Math.random()* 900000)
        const otphash =await crypt.hash(OTPm.toString(),10)

        const otpsave = await otps.create({
            email:email,
            otp:otphash,
            expire:new Date(Date.now()+5*60*1000)
        })
        const mail =await nodemail.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.APP_PASS
            }
        })
       try {

   await mail.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your verification code",
     html:` 
      <h2>Email Verification</h2>

      <a href="https://authflow-hub.onrender.com/verify?otp=${OTPm}&email=${email}">
        Verify Email
      </a>`
   });

   console.log("MAIL SENT");

} catch(err) {
   console.log("MAIL ERROR:", err);
}

        res.json({msg:true})

    }catch(e){
        res.json({msg:`error in mongo ${e}`})
    }

}
exports.verify = async (req, res) => {
    try {
        const { otp, email } = req.query;

        console.log("the otp " + otp + " email: " + email);

        const data = await otps.findOne({ email }).sort({ _id: -1 });
        console.log("Received OTP:", otp);
        console.log("DB HASH:", data.otp);

        if (!data) {
            return res.json({ msg: "OTP not found" });
        }

        const decrypt = await crypt.compare(
                otp.toString().trim(),
                data.otp
            );
            console.log(decrypt)

        const dates = new Date();

        if (!decrypt) {
            return res.json({ msg: "no password decrypt" });
        }

        if (data.expire < dates) {
            return res.json({ msg: "expired" });
        }

       await otps.deleteMany({email});

return res.redirect("https://auth-flow-hub.vercel.app/show");

    } catch (e) {
        res.json({ msg: `there is an error in verify otp: ${e}` });
    }
}

exports.getregister=async(req ,res )=>{
    try{
        const name =await user.find({})
        res.json(name)

    }catch(e){
        console.log("there is an errro r i get regiter")
    }
}