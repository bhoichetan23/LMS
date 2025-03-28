const User = require("../models/user");
const validateSignUpData = require("../utils/validation");

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
        password
       
      });

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

module.exports = {
  register,
  login,
  logout,
  viewProfile,
};
