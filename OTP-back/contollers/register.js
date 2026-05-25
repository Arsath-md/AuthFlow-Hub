
const user = require("../models/usersSchema");
const crypt = require("bcrypt");
const otps = require("../models/otpSchema");

const SibApiV3Sdk = require("sib-api-v3-sdk");

// BREVO API CONFIG
const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];

apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// REGISTER
exports.register = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // VALIDATION
    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        msg: "All fields are required"
      });

    }

    // CHECK USER
    const existing = await user.findOne({ email });

    if (existing) {

      return res.status(400).json({
        success: false,
        msg: "Email already exists"
      });

    }

    // HASH PASSWORD
    const hashed = await crypt.hash(password, 10);

    // CREATE USER
    const setdata = await user.create({
      name,
      email,
      password: hashed
    });

    if (!setdata) {

      return res.status(400).json({
        success: false,
        msg: "Cannot add user"
      });

    }

    // GENERATE OTP
    const OTPm = Math.floor(100000 + Math.random() * 900000);

    // HASH OTP
    const otphash = await crypt.hash(OTPm.toString(), 10);

    // SAVE OTP
    await otps.create({
      email,
      otp: otphash,
      expire: new Date(Date.now() + 5 * 60 * 1000)
    });

    // FAST RESPONSE
    res.status(200).json({
      success: true,
      msg: "Registered Successfully"
    });

    // SEND EMAIL USING BREVO API
    try {

      const data = await tranEmailApi.sendTransacEmail({

        sender: {
          email: "vippismart@gmail.com",
          name: "HIFI SMART"
        },

        to: [
          {
            email: email
          }
        ],

        subject: "Verification Code",

        htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333; line-height: 1.6; border: 1px solid #e5e5e5; border-radius: 10px;">

          <h2 style="color: #222;">Email Verification</h2>

          <p>Hello,</p>

          <p>
            Thank you for registering. Please verify your email address by clicking the button below:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="https://authflow-hub.onrender.com/verify?otp=${OTPm}&email=${email}"
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
            © 2026 HIFI SMART. All rights reserved.
          </p>

        </div>
        `
      });

      console.log("MAIL SENT:", data);

    } catch (err) {

      console.log("MAIL ERROR:", err);

    }

  } catch (e) {

    console.log("REGISTER ERROR:", e);

    res.status(500).json({
      success: false,
      msg: "Server Error"
    });

  }

};

// VERIFY OTP
exports.verify = async (req, res) => {

  try {

    const { otp, email } = req.query;

    console.log("OTP:", otp);
    console.log("EMAIL:", email);

    const data = await otps.findOne({ email }).sort({ _id: -1 });

    if (!data) {

      return res.json({
        success: false,
        msg: "OTP not found"
      });

    }

    // COMPARE OTP
    const decrypt = await crypt.compare(
      otp.toString().trim(),
      data.otp
    );

    if (!decrypt) {

      return res.json({
        success: false,
        msg: "Invalid OTP"
      });

    }

    // CHECK EXPIRY
    const currentDate = new Date();

    if (data.expire < currentDate) {

      return res.json({
        success: false,
        msg: "OTP expired"
      });

    }

    // DELETE USED OTP
    await otps.deleteMany({ email });

    // REDIRECT
    return res.redirect(
      "https://auth-flow-hub.vercel.app/show"
    );

  } catch (e) {

    console.log("VERIFY ERROR:", e);

    res.status(500).json({
      success: false,
      msg: "Server Error"
    });

  }

};

// GET REGISTERED USERS
exports.getregister = async (req, res) => {

  try {

    const users = await user.find({});

    res.json(users);

  } catch (e) {

    console.log("GET REGISTER ERROR:", e);

    res.status(500).json({
      success: false,
      msg: "Server Error"
    });

  }

};