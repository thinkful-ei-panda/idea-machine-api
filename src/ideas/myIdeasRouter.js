const express = require('express');
const MyIdeasRouter = express.Router();
const requireAuth = require('../middleware/jwt-auth');
const ideasService = require('./ideasService');




module.exports = MyIdeasRouter;