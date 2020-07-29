const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');


describe('App', () => {
  let db;

  // const {
  //   testUsers,
  //   testIdeas,
  //   testFollowedIdeas,
  // } = helpers.makeIdeasFixtures;

  // const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });
  
  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));  


  it('GET responds with 200 and \'Hello Boilerplate\'', () =>{
    return supertest(app)
      .get('/')
      .expect(200,'Hello Boilerplate');
  });
});




