var express = require('express');
var router = express.Router();

//register route
router.get('/register', (req, res)=>{
  res.render('register');
});

// login route
router.get('/login', (req, res)=>{
  res.render('login');
});

module.exports = router;
