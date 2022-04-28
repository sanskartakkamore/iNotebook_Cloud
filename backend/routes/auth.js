const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Sanskarisagoodb$oy'; //Signature for Jwt

//ROUTE 1: Create a User Using: Post "api/auth/createuser" .     No login required 

router.post('/createuser',[
    body('name','Enter a Valid Name').isLength({ min: 3 }),
    body('email','Enter a Valid Email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({ min: 5 }),
],async(req,res)=>{
    let success = false;
// if there are errors then , return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
      } 
// Check weather the user with the same email is already exits 
try {
    

let user = await User.findOne({email:req.body.email});
if(user){//Create a User Using: Post "api/auth/createuser" .     No login required 
    return res.status(400).json({success,error:"Sorry the use with this email is already exists"})
}
const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password,salt);
//create a new user 
user = await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass,
      })
      
      
      
    //   .then(user => res.json(user))
    //   .catch(err=> {console.log(err)
    // res.json({error:'Please Enter a unique value for email', message:err.message})})
    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    //console.log(jwtData);

    //res.json(user)
    success = true;
    res.json({success,authtoken})
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Occured");
}
})


//ROUTE 2: Authenticate a User Using: Post "api/auth/login" .     No login required 
router.post('/login',[
    body('email','Enter a Valid Email').isEmail(),
    body('password','Password cannot be blank').exists(),
],async(req,res)=>{
    let success = false;
    // if there are errors then , return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } 

    const {email,password} = req.body;
    try {
        let user =await User.findOne({email});
        if(!user){
            success=false
            return res.status(400).json({error:"Try to login with correct credentials"});
        }

        const passwordCompare =await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success=false
            return res.status(400).json({success,error:"Try to login with correct credentials"});     
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true; 
        res.json({success,authtoken})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Occured");
    }
})

//ROUTE 3: Get loggedin User Details Using: Post "api/auth/getuser"....login required
router.post('/getuser',fetchuser,async(req,res)=>{
try {
    userId = req.user.id;
    user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Occured");
}
})


module.exports = router;