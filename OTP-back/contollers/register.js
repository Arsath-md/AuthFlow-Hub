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
        await mail.sendMail({

            from:"studytamilah@gmail.com",
            to:email,
            subject:`your verification code `,

            html:`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333; line-height: 1.6; border: 1px solid #e5e5e5; border-radius: 10px;">

  <h2 style="color: #222;">Email Verification</h2>

  <p>Hello,</p>

  <p>
    Thank you for registering. Please verify your email address by clicking the button below:
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a 
      href="http://localhost:5000/verify?otp=${OTPm}&email=${email}"
      style="
        background-color: #000;
        color: #fff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
        font-weight: bold;
      "
    >
      Verify Email
    </a>
  </div>

  <p>
    This verification link will expire in <strong>5 minutes</strong>.
  </p>

  <p>
    If you did not create this account, you can safely ignore this email.
  </p>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />

  <p style="font-size: 12px; color: #777;">
    © 2026 HIFI . All rights reserved.
  </p>

</div>
`

            


        })


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

        return res.redirect(`http://localhost:5173/show`);

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