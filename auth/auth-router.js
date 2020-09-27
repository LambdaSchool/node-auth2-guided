const bcryptjs = require("bcryptjs");
const jwt=require("jsonwebtoken")
const router = require("express").Router();

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");



router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    // hash the password
    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    // save the user to the database
    Users.add(credentials)
      .then(user => {
        const token = jwt.sign({
          userID:user.id,
          userRole:"admin",
        }, process.env.JWT_SECRET, {expiresIn:"2d"})
        res.status(201).json({ data: user, token });

                      // const existingUser = await User.findOne({email:email})
              // if(existingUser)
              // return res.status(400).json("an account with this email already exits")

      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        // compare the password the hash stored in the database
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = jwt.sign({
            userID:user.id,
            userRole:"admin",
          },process.env.JWT_SECRET, {expiresIn:"9d"})

          // res.cookie("token", token)

console.log("KITTY", user.username)
          res.status(200).json({ message: "Welcome to our API" , id:user.id, username:user.username, token});
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});
const maxAge = 3*24*60*60
const createToken=(id)=>{
return jwt.sign({id}, process.env.JWT_SECRET,{
  expiresIn:maxAge
})
}

module.exports = router;



