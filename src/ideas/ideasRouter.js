const express = require('express');
const ideasService = require('./ideasService');
const IdeasRouter = express.Router();
const requireAuth = require('../middleware/jwt-auth');

IdeasRouter
  .route('/')

  //GET All public ideas
  .get((req,res,next) => {
    ideasService.getAllPublicIdeas(req.app.get('db'))
      .then(ideas => {
        const cleanedIdeas = ideas.map(idea => ideasService.serializeIdea(idea));
        return res.json(cleanedIdeas);
      })
      .catch(next);
  })

  //POST post an idea
  .post(requireAuth, express.json(), (req,res,next) => {
    const {title,content} = req.body;
    let newIdea = {title,content};

    for(const [key,value] of Object.entries(newIdea))
      if(!value)
        return res.status(400).json(`Missing ${key}`);

    
    newIdea.author_id = req.user.id;
    ideasService.insertIdea(req.app.get('db'),newIdea)
      .then(idea => {
        idea.user_name = newIdea.author;
        return res.status(201).json(ideasService.serializeIdea(idea));
      })
      .catch(next);
  });

IdeasRouter
  .route('/idea/:idea_id')
  .all(requireAuth)

  //GET
  .get((req,res,next) => {
    const {idea_id} = req.params;    
    ideasService.getIdeaByIdeaId(req.app.get('db'),idea_id)
      .then(idea => {
        if(!idea)
          return res.status(400).json({error:'No idea found'});
        
        return res.status(200).json(ideasService.serializeIdea(idea));
      })
      .catch(next);
  })

  //PATCH update an idea
  .patch(express.json(), (req,res,next) => {
    const {idea_id} = req.params;
    const {title,content,public_status} = req.body;
    
    const ideaUpdateFields = {
      title: (title === '') ? undefined : title,
      content: (content === '') ? undefined :content,
      public_status,
    };

    if(ideaUpdateFields.title == null && ideaUpdateFields.content == null && ideaUpdateFields.public_status === undefined){    
      return res.status(400).json({error: 'Needs at least one update field'});
    }

    ideasService.getIdeaByIdeaId(req.app.get('db'),idea_id)
      .then(idea => {
        if(!idea)
          return res.status(400).json({error: 'Could not find idea'});    
          
        if(idea.user_name !== req.user.user_name)
          return res.status(401).json({error: 'Unauthorized request'});

        ideasService.updateIdea(req.app.get('db'),idea_id,ideaUpdateFields)
          .then(() => {
            return res.status(204).end();
          })
          .catch(next);
      })
      .catch(next);
  })

  //DELETE delete an idea
  .delete(express.json(), (req,res,next) => {
    const {idea_id} = req.params;
    ideasService.getIdeaByIdeaId(req.app.get('db'),idea_id)
      .then(idea => {
        if(!idea)
          return res.status(400).json({error: 'Could not find idea'});      

        if(idea.user_name !== req.user.user_name)
          return res.status(401).json({error: 'Unauthorized request'});

        ideasService.deleteIdea(req.app.get('db'),idea_id)
          .then(() => res.status(204).end())
          .catch(next);
      })        
      .catch(next);
  });

IdeasRouter  
  .route('/my-ideas')
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





module.exports = IdeasRouter;