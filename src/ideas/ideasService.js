const xss = require('xss');

const ideasService = {
  getAllPublicIdeas(db){
    return db
      .select('idea_machine_ideas.id','idea_machine_ideas.title','idea_machine_ideas.content','idea_machine_ideas.date_created','idea_machine_users.user_name')
      .from('idea_machine_ideas')
      .join('idea_machine_users', 'idea_machine_ideas.author_id', '=', 'idea_machine_users.id')
      .where('public_status',true);
  },

  getIdeasByUserId(db,author_id){
    return db
      .select('idea_machine_ideas.id','idea_machine_ideas.title','idea_machine_ideas.content','idea_machine_ideas.date_created','idea_machine_users.user_name','idea_machine_ideas.public_status')
      .from('idea_machine_ideas')
      .join('idea_machine_users', 'idea_machine_ideas.author_id', '=', 'idea_machine_users.id')
      .where({author_id});
  },

  getIdeaByIdeaId(db,id){
    return db('idea_machine_ideas')
      .select('idea_machine_ideas.id','idea_machine_ideas.title','idea_machine_ideas.content','idea_machine_ideas.date_created','idea_machine_users.user_name','idea_machine_ideas.public_status')
      .join('idea_machine_users', 'idea_machine_ideas.author_id', '=', 'idea_machine_users.id').select()
      .where('idea_machine_ideas.id',id)
      .first();
  },

  insertIdea(db,newIdea){
    return db
      .insert(newIdea)
      .into('idea_machine_ideas')
      .returning('*')
      .then(rows => rows[0]);
  },

  updateIdea(db,id,ideaUpdateFields){
    console.log(ideaUpdateFields);
    return db('idea_machine_ideas')
      .update(ideaUpdateFields)
      .where({id});
  },

  deleteIdea(db,id){
    return db('idea_machine_ideas')
      .delete()
      .where({id});
  },

  serializeIdea(idea){
    return {
      id: idea.id,
      title: xss(idea.title),
      content: xss(idea.content),
      user_name: xss(idea.user_name),
      date_created: new Date(idea.date_created),
      public_status: idea.public_status 
    };
  },

  // getByUser(db,user_name){
  //   return db('idea_machine_ideas')
  //     .where({user_name});
  // }
};

module.exports = ideasService;