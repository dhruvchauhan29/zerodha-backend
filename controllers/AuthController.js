const User = require("../model/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res) => {
  console.log("Signup request received:", req.body); // Log request body
  try {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, username });

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    console.log("User created successfully:", user);
    res.status(201).json({ message: "User signed up successfully", success: true, user });
  } catch (error) {
    console.error("Error during signup:", error); // Log error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.Login = async (req, res) => {
  console.log("Login request received:", req.body); // Log request body
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    console.log("User logged in successfully:", user);
    res.status(200).json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.error("Error during login:", error); // Log error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
