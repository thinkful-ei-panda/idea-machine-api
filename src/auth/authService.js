

const AuthService = {
  getByUserName(db,user_name){
    
    return db('idea_machine_users')
      .select('*')
      .where({ user_name })
      .first();
  }
};

module.exports = AuthService;