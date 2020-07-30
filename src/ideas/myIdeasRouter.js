const express = require('express');
const MyIdeasRouter = express.Router();
const requireAuth = require('../middleware/jwt-auth');
const ideasService = require('./ideasService');


MyIdeasRouter  
  .route('/')
  .all(requireAuth)

  //GET get all ideas made by logged in user
  .get((req,res,next) => {
    const user_id = req.user.id;

    ideasService.getIdeasByUserId(req.app.get('db'),user_id)
      .then(ideas => {
        const cleanedIdeas = ideas.map(idea => ideasService.serializeIdea(idea));
        return res.json(cleanedIdeas);
      })
      .catch(next);
  });

module.exports = MyIdeasRouter;