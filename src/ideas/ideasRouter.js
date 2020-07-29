const express = require('express');
const ideasService = require('./ideasService');
const IdeasRouter = express.Router();

IdeasRouter
  .route('/')
  .get((req,res,next) => {
    ideasService.getAllPublicIdeas(req.app.get('db'))
      .then(ideas => {
        const cleanedIdeas = ideas.map(idea => ideasService.serializeIdea(idea));
        return res.json(cleanedIdeas);
      })
      .catch(next);
  })
  .post(express.json(), (req,res,next) => {
    const {title,content} = req.body;
    let newIdea = {title,content};

    for(const [key,value] of Object.entries(newIdea))
      if(!value)
        res.status(400).json(`Missing ${key}`);

    newIdea.author_id = 1;
    ideasService.insertIdea(req.app.get('db'),newIdea)
      .then(idea => {
        idea.user_name = 'dunder';
        return res.json(ideasService.serializeIdea(idea));
      })
      .catch(next);
  });

IdeasRouter
  .route('/:idea_id')
  .get((req,res,next) => {
    const {idea_id} = req.params;
    ideasService.getIdeaByIdeaId(req.app.get('db'),idea_id)
      .then(idea => {
        return res.status(200).json(ideasService.serializeIdea(idea));
      })
      .catch(next);
  })
  .patch(express.json(), (req,res,next) => {
    const {idea_id} = req.params;
    const {title,content,public_status} = req.body;

    const ideaUpdateFields = {
      title,
      content,
      public_status,
    };

    ideasService.updateIdea(req.app.get('db'),idea_id,ideaUpdateFields)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .delete(express.json(), (req,res,next) => {
    res.json('delete');
  });

IdeasRouter
  .route('/user/:user_id')
  .get((req,res,next) => {
    const {user_id} = req.params;
    ideasService.getIdeasByUserId(req.app.get('db'),user_id)
      .then(ideas => {
        const cleanedIdeas = ideas.map(idea => ideasService.serializeIdea(idea));
        return res.json(cleanedIdeas);
      })
      .catch(next);
  });

IdeasRouter
  .route('/followed/:user_id')
  .get((req,res,next) => {
    const {user_id} = req.params;
    ideasService.getFollowedIdeasByFollowerId(req.app.get('db'),user_id)
      .then(ideas => {
        const cleanedIdeas = ideas.map(idea => ideasService.serializeIdea(idea));
        return res.json(cleanedIdeas);
      })
      .catch(next);
  });

module.exports = IdeasRouter;