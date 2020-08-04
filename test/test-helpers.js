const { JWT_SECRET } = require('../src/config');

const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {user_name: 'dunder', password: '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'},
    {user_name: 'b.deboop', password: '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'},
    {user_name: 'c.bloggs', password: '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK'},
    {user_name: 's.smith', password: '$2a$12$/4P5/ylaB7qur/McgrEKwuCy.3JZ6W.cRtqxiJsYCdhr89V4Z3rp.'},
    {user_name: 'lexlor', password: '$2a$12$Hq9pfcWWvnzZ8x8HqJotveRHLD13ceS7DDbrs18LpK6rfj4iftNw.'},
    {user_name: 'wippy', password: '$2a$12$ntGOlTLG5nEXYgDVqk4bPejBoJP65HfH2JEMc1JBpXaVjXo5RsTUu'},
  ];
}

function makeIdeasArray () {
  return [
    {title: 'First post!', author_id: 1,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?'},
    {title: 'Second post!', author_id:2,
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'},
    {title: 'Third post!', author_id:3,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'},
    {title: 'Fourth post', author_id: 4,
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, consequuntur. Cum quo ea vero, fugiat dolor labore harum aut reprehenderit totam dolores hic quaerat, est, quia similique! Aspernatur, quis nihil?'},
    {title: 'Fifth post', author_id: 5,
      content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet soluta fugiat itaque recusandae rerum sed nobis. Excepturi voluptas nisi, labore officia, nobis repellat rem ab tempora, laboriosam odio reiciendis placeat?'},
    {title: 'Sixth post', author_id: 6,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
    {title: 'Seventh post', author_id: 1,
      content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, voluptatum nam culpa minus dolore ex nisi recusandae autem ipsa assumenda doloribus itaque? Quos enim itaque error fuga quaerat nesciunt ut?'},
    {title: 'Eigth post', author_id: 2,
      content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur sequi sint beatae obcaecati voluptas veniam amet adipisci perferendis quo illum, dignissimos aspernatur ratione iusto, culpa quam neque impedit atque doloribus!'},
    {title: 'Ninth post', author_id: 3,
      content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos architecto repellat, in amet soluta exercitationem perferendis eius perspiciatis praesentium voluptate nisi deleniti eaque? Rerum ea quisquam dolore, non error earum?'},
    {title:  'Tenth post', author_id: 4,
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum molestiae accusamus veniam consectetur tempora, corporis obcaecati ad nisi asperiores tenetur, autem magnam. Iste, architecto obcaecati tenetur quidem voluptatum ipsa quam?'},
  ];
}

function makeFollowedIdeasArray() {
  return [
    {follower_id: 1, idea_id:1},
    {follower_id: 1, idea_id:2},
    {follower_id: 1, idea_id:3},
    {follower_id: 1, idea_id:4},
    {follower_id: 1, idea_id:5},
    {follower_id: 1, idea_id:6},
    {follower_id: 2, idea_id:1},
    {follower_id: 2, idea_id:2},
    {follower_id: 2, idea_id:3},
    {follower_id: 2, idea_id:4},
    {follower_id: 2, idea_id:5},
    {follower_id: 2, idea_id:6},
    {follower_id: 3, idea_id:1},
    {follower_id: 3, idea_id:2},
    {follower_id: 3, idea_id:3},
    {follower_id: 3, idea_id:4},
    {follower_id: 3, idea_id:5},
  ];
}

function makeIdeasFixtures(){
  const testUsers = makeUsersArray();
  const testIdeas = makeIdeasArray();
  const testFollowedIdeas = makeFollowedIdeasArray();
  return { testUsers, testIdeas, testFollowedIdeas};
}

function seedUsers(db,testUsers){
  return db.into('idea_machine_users').insert(testUsers);
}

function seedIdeas(db,testIdeas){
  return db.into('idea_machine_ideas').insert(testIdeas);
}

function seedFollowedIdeas(db,testFollowedIdeas){
  return db.into('idea_machine_followed_ideas').insert(testFollowedIdeas);
}
        
function seedTables(db,testUsers,testIdeas,testFollowedIdeas){
  // return Promise.all([
    return db.transaction(async (trx) => {
      await seedUsers(trx,testUsers);
      await seedIdeas(trx,testIdeas);
      await seedFollowedIdeas(trx,testFollowedIdeas);
    })
    
  // ]);
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        idea_machine_users,
        idea_machine_ideas,
        idea_machine_followed_ideas
      RESTART IDENTITY
      `
    )
  );
}

function makeBearerToken(testUser){
  const token = jwt.sign({user_id: testUser.id},process.env.JWT_SECRET,{subject : testUser.user_name});
  
  return token;
}

function verifyJwt(token) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
  });
}

module.exports = {
  makeUsersArray,
  makeIdeasArray,
  makeIdeasFixtures,

  seedUsers,
  seedIdeas,
  seedFollowedIdeas,
  seedTables,

  cleanTables,
  makeBearerToken,
  verifyJwt,

};