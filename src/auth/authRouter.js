const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthService = require('./authService');

const AuthRouter = express.Router();

AuthRouter
  .route('/login')
  .post(express.json(), (req,res,next) => {
    const {user_name,password} = req.body;
    const loginUser = {
      user_name,
      password
    };

    for(const [key,value] of Object.entries(loginUser))
      if(value == null)
        return res.status(400).json({error: `Missing ${key}`});

    AuthService.getByUserName(req.app.get('db'), loginUser.user_name)
      .then(user => {
        if(!user)
          return res.status(401).json({error: 'Invalid name or password'});

        return bcrypt.compare(password, user.password)
          .then(passwordMatch => {
            if(!passwordMatch)
              return res.status(401).json({error: 'Invalid name or password'});

            const token = jwt.sign({user_id: user.id},process.env.JWT_SECRET,{subject : user.user_name});
            return res.json({authToken:token});
          });
      })
      .catch(next);
  });

module.exports = AuthRouter;