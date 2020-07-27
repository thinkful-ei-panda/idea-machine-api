const express = require('express');
const UsersService = require('./usersService');

const UsersRouter = express.Router();

UsersRouter
  .route('/')
  .post(express.json(), (req,res,next) => {
    const {user_name,password} = req.body;
    let newUser = {
      user_name,
      password,
    };

    //Check Username and password are valid

    for(const [key,value] of Object.entries(newUser))
      if(value == null)
        return res.status(400).json({error: `Missing ${key} in request body`});
      
    if(password.length < 8)
      return res.status(401).json({error: 'Password must be longer than 8 characters'});

    UsersService.hasUserWithUserName(req.app.get('db'),newUser.user_name)
      .then(hasUserWithUserName => {
        if(hasUserWithUserName)
          return res.status(400).json({error: 'Username already in use'});
        
        //Hash password and post to database

        UsersService.hashPassword(password)
          .then(hashedPassword => {
            newUser.password = hashedPassword;
            return UsersService.insertUser(req.app.get('db'),newUser)
              .then(user => {
                res.status(201).json(UsersService.serializeUser(user));
              });
          });
      })
      .catch(next);    
  });

module.exports = UsersRouter;