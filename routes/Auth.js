const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const FetchUser = require("../middleware/FetchUser");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;


// register user
router.post(
  "/register",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user:{
          id: user.id,
        }
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      // console.log(authToken);

      res.json({msg:"Registration succesful", user, authToken });
    } catch (error) {
      res.status(500).send("internal server error");
    }
  }
);


// login user
router.post('/login',async(req,res)=>{
  const {email,password} = req.body
  try {
    let user = await User.findOne({email});
    if(!user){
     return res.status(400).json({msg:"Invalid credentials"});
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      return res.status(400).json({msg:"Invalid credentials"});
    }

    const data ={
      user:{
      id:user.id
      }
    }
    const authToken = await jwt.sign(data,JWT_SECRET);
    res.status(200).json({
      msg:"login successful",
      user,
      authToken
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:'Internal Server Error!'}) 
  }
})


// getloginusers
router.get('/getloginusers',FetchUser, async(req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
      
        res.status(200).json({
          success:true,
            user:user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        });
    }
});

module.exports = router;
