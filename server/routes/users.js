const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

router.post('/register', async(req, res) => {
  const {name, email, password} = req.body;
  const user = await User.findOne({email: email});

  if(user) return res.status(400).json({msg: 'Email already exists'});

  const newUser = new User({
    name, email, password
  });

  const hashedPassword = await bcrypt.hash(newUser.password, await bcrypt.genSalt(10));
  newUser.password = hashedPassword;

  newUser.save()
    .then(user => {
      return res.status(201).json({
        success: true,
        msg: 'User registered'
      })
    }).catch(err => console.log(err));
});

router.post('/login', async(req, res) => {
  const user = await User.findOne({email: req.body.email});
  
  if(!user) return res.status(404).json({msg: 'Email not found', success: false});
 
  const matchPassword = await bcrypt.compare(req.body.password, user.password);

  if(!matchPassword) {
    return res.status(404).json({
      msg: 'Passwords dont match',
      success: false
    });
  }

  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email
  }

  jwt.sign(payload, process.env.SECRET, {expiresIn: '24h'}, (err, token) => {
    res.status(200).json({
      success: true,
      user: user,
      token: `Bearer ${token}`,
      msg: 'You are now logged in'
    })
  });
});

router.get('/profile', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  return res.json({
    user: req.user
  });
});

module.exports = router;