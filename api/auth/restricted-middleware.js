const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if(!token){
    res.status(401).json("Token please!")
  }else{
    jwt.verify(token,"keepitsecret",(err,decoded)=>{
      
    })
  }
};
