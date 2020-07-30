require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');

const AuthRouter = require('./auth/authRouter');
const UsersRouter = require('./users/usersRouter');
const IdeasRouter = require('./ideas/ideasRouter');
const FollowedIdeasRouter = require('./followedIdeas/followedIdeasRouter');
const MyIdeasRouter = require('./ideas/myIdeasRouter');

const app = express();

const morgOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morgOption));
app.use(cors());
app.use(helmet());

app.get('/', (req,res) => {
  res.status(200).send('Hello Boilerplate');
});

app.use('/api/auth', AuthRouter);
app.use('/api/users',UsersRouter);
app.use('/api/ideas',IdeasRouter);
app.use('/api/followedIdeas',FollowedIdeasRouter);
app.use('/api/my-ideas',MyIdeasRouter);

app.use(function errorHandler(error,req,res,next){ //eslint-disable-line
  let response;
  if(NODE_ENV === 'production') {
    response = {error: {message: 'server error'}};
  }else{
    console.log(error);
    response = {message: error.message, error};
  }
  res.status(400).json(response);
});

module.exports = app;