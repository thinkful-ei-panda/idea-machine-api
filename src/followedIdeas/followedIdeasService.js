const FollowedIdeasService = {

  
  getFollowedIdeasByFollowerId(db,follower_id){
    return db
      .select('idea_machine_ideas.id','idea_machine_ideas.title','idea_machine_ideas.content','idea_machine_ideas.date_created','idea_machine_users.user_name')
      .from('idea_machine_followed_ideas')
      .join('idea_machine_ideas', 'idea_machine_followed_ideas.idea_id', '=', 'idea_machine_ideas.id')
      .join('idea_machine_users', 'idea_machine_ideas.author_id', '=', 'idea_machine_users.id')      
      .where({follower_id,public_status:true});
  },

  getById(db,id){
    return db('idea_machine_followed_ideas')
      .select('idea_machine_ideas.id','idea_machine_ideas.title','idea_machine_ideas.content','idea_machine_ideas.date_created','idea_machine_users.user_name')
      .join('idea_machine_ideas', 'idea_machine_followed_ideas.idea_id', '=', 'idea_machine_ideas.id')
      .join('idea_machine_users', 'idea_machine_ideas.author_id', '=', 'idea_machine_users.id')
      .where('idea_machine_followed_ideas.id',id)
      .first();

  },

  insertFollowedIdea(db,idea){
    return db
      .insert(idea)
      .into('idea_machine_followed_ideas')
      .returning('*')
      .then(rows => rows[0]);
  },

  deleteMatchingIdeaIdAndFollowerId(db,idea_id,follower_id){
    return db('idea_machine_followed_ideas')
      .delete()
      .where({idea_id,follower_id});

  },

  getByIdeaIdAndFollowerId(db,idea_id,follower_id){
    return db('idea_machine_followed_ideas')
      .select()
      .where({idea_id,follower_id})
      .first();
  }
};

module.exports = FollowedIdeasService;