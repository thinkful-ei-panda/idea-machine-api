const { default: xss } = require('xss');

const ideasService = {
  getAllIdeas(db){
    return db
      .select('*')
      .from('idea_machine_ideas')
      .join('idea_machine_users', 'idea_machine_ideas.author_id', '=', 'idea_machine_users.id');
  },

  serializeIdea(idea){
    return {
      id: idea.id,
      title: xss(idea.title),
      content: xss(idea.content),
      user_name: xss(idea.user_name),
      date_created: new Date(idea.date_created),      
    };
  },

  // getByUser(db,user_name){
  //   return db('idea_machine_ideas')
  //     .where({user_name});
  // }
};

module.exports = ideasService;