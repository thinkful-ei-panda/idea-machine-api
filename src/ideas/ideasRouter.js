const express = require('express');
const ideasService = require('./ideasService');
const IdeasRouter = express.Router();

IdeasRouter
  .route('/')
  .get((req,res,next) => {
    ideasService.getAllIdeas(req.app.get('db'))
      .then(ideas => {
        return res.json(ideas);
      })
      .catch(next);
  });

module.exports = IdeasRouter;