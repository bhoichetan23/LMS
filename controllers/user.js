const User = require("../models/user");
const validateSignUpData = require("../utils/validation");
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    validateSignUpData(req);

    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new Error("User already exists");
    }

    if (!userExists) {
      const user = new User({
        fullName,
        email,
        password,
        avatar: {
          public_id: email,
          secure_url: ""

          
        }

       
      });

      // file upload

      if(req.file){
        try{
          const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "lms",
            width: 250,
            height: 250,
            gravity: "face",
            crop: fill,
          });

          if(result){
            user.avatar.public_id = result.public_id;
            user.avatar.secure_url = result.secure_url;

            // remove file from server 

            fs.rm(`uploads/${req.file.filename}`);

          }

        }catch(err){
           console.error("Fie upload failed");

        }

      }

      const savedUser = await user.save();

      if (savedUser) {
        res.status(201).json({ message: "User registered successfully" });
      }

      if (!savedUser) {
        throw new Error("User registration failed");
      }

      const token = await savedUser.generateJWTToken();

      res.cookie("token", token);
    }
  } catch (err) {
    console.error(err.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await user.validatePassword(password);

  if (isPasswordValid) {
    const token = await generateJWTToken();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.send(user);
  }

  if (user && isPasswordValid) {
    res.send("Login successfull");
  } else {
    throw new Error("Login failed");
  }
};

const logout = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now() + 8 * 3600000),
  });
};

const viewProfile = (req, res) => {};

const forgotPassword = async (req, res)=>{
 const {email} = req.body;

 const user = User.findOne({email});

 if(!email){
     throw new Error("Email is required");

 }

 if(!user){
  throw new Error("Email not registerd");

 }

 const resetToken = await user.generatePasswordResetToken();

   await user.save();

   const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

   const subject = "Reset Password";
   const message = `You can reset your password by clicking <a href=${resetPasswordURL} target="_blank">`;

   try{
    await sendEmail(email, subject, message);


   }catch(err){
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    throw new Error("Something went wrong");

    
   }

}

const resetPassword = async (req, res)=>{
  const {resetToken} = req.params;

  const {password} = req.body;

  const forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

      const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()}

      });

      if(!user){
        throw new Error("Invaid token, please try again");

      }

      user.password = password;
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;

      await user.save();

      res.status(200).json({
        message: "Password cghanged successfully"
      });

  


  
}

const changePassword = async(req, res)=>{
  

}

module.exports = {
  register,
  login,
  logout,
  viewProfile,
  forgotPassword,
  resetPassword

};
