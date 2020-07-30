const express = require('express');
const FollowedIdeasService = require('./followedIdeasService');
const ideasService = require('../ideas/ideasService');
const requireAuth = require('../middleware/jwt-auth');

const FollowedIdeasRouter = express.Router();

FollowedIdeasRouter
  .route('/')
  .all(requireAuth)

//GET Displays Tracked Ideas

  .get((req,res,next) => {
    const follower_id = req.user.id;
    FollowedIdeasService.getFollowedIdeasByFollowerId(req.app.get('db'),follower_id)
      .then(ideas => {
        const cleanedIdeas = ideas.map(idea => ideasService.serializeIdea(idea));
        return res.json(cleanedIdeas);
      })
      .catch(next);      
  })

//POST Follows an idea

  .post(express.json(), (req,res,next) => {
    const {idea_id} = req.body;

    let targetIdeaToFollow = {
      idea_id,
      follower_id:req.user.id
    };

    for(const [key,value] of Object.entries(targetIdeaToFollow)){
      if(!value){
        return res.status(400).json({error: `Missing ${key}`});
      }
    }

    FollowedIdeasService.insertFollowedIdea(req.app.get('db'),targetIdeaToFollow)
      .then(followedIdea => {
        FollowedIdeasService.getById(req.app.get('db'),followedIdea.id)
          .then(idea => {
            res.json(ideasService.serializeIdea(idea));
          })
          .catch(next);
      })
      .catch(next);
  });

FollowedIdeasRouter
  .route('/:id')
  .all(requireAuth)
  .get((req,res,next) => {
    const {id} = req.params;
    FollowedIdeasService.getById(req.app.get('db'),id)
      .then(idea => {
        res.json(idea);
      });
    
  })
  .delete((req,res,next) => {
    const {id} = req.params;
    FollowedIdeasService.getByIdeaIdAndFollowerId(req.app.get('db'),id,req.user.id)
      .then(followedIdea => {
        if(!followedIdea)
          return res.status(401).json({error: 'Could not find followed idea'});        
      })
      .then(() => {
        FollowedIdeasService.deleteMatchingIdeaIdAndFollowerId(req.app.get('db'),id,req.user.id)
          .then(() => res.status(204).json());
      });
    
      

    
  });


  


module.exports = FollowedIdeasRouter;
