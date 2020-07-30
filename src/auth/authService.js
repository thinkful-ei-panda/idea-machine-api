const jwt = require('jsonwebtoken');
const config = require('../config');


const AuthService = {
  getByUserName(db,user_name){
    
    return db('idea_machine_users')
      .select('*')
      .where({ user_name })
      .first();
  },

  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
};

module.exports = AuthService;