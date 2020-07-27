const { DB_URL } = require('../config');
const xss = require('xss');
const bcrypt = require('bcryptjs');

const UsersService = {
  hasUserWithUserName(db,user_name){
    return db('idea_machine_users')
      .select('*')
      .where({user_name})
      .first();

  },
  insertUser(db,newUser){
    return db
      .insert(newUser)
      .into('idea_machine_users')
      .returning('*')
      .first();
  },
  hashPassword(password){
    return bcrypt.hash(password, 12);
  },
  serializeUser(user){
    return {
      id: user.id,
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created),
    };
  },
};

module.exports = UsersService;