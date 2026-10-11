const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

//register user

const registerUser = async (req, res) => {
  try 
{
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
} 
  
catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//user login

const loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(404).json({message:"User not Found",})
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect)
        {
            return res.status(400).json({message:"Invalid email or password"})
        }
        const token=generateToken(user._id);
        res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                username:user.username,
                email:user.email
            }
        })
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message,
        })
    }
}

module.exports = {
  registerUser,
  loginUser
};
