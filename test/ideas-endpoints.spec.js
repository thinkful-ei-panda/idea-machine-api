const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const supertest = require('supertest');


describe('Ideas Endpoints', () => {
  let db;

  const {
    testUsers,
    testIdeas,
    testFollowedIdeas,
  } = helpers.makeIdeasFixtures();

  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });
  
  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));  

  //Route '/'
  //GET public ideas

  describe('GET /api/ideas', () => {
    context('given some ideas', () =>{
      beforeEach('insert ideas', () => {
        helpers.populateTables(db,testUsers,testIdeas,testFollowedIdeas);
      });
      it('should return an array of ideas', () => {
        return supertest(app)
          .get('/api/ideas')
          .expect(200);
      });
    });
  });

  context('logged in with test user', () => {
    const bearerToken = helpers.makeBearerToken(testUser);    
    beforeEach('insert test users', () => {
      helpers.populateUsers(db,testUsers);
    });    

    //POST new idea
    describe('POST /api/ideas', () => {
      const newTestIdea = {
        title: 'New Idea!',
        content: 'New Idea Content!'
      };
      it.only('should return the posted idea', () => {
        return supertest(app)
          .post('/api/ideas')
          .set('Authorization',`Bearer ${bearerToken}`)
          .send({
            title: 'New Idea!',
            content: 'New Idea Content!'
          })
          .expect(201)
          .expect(newTestIdea);
      });    
    });

    //Route '/:idea'
    //GET 

    describe('GET /ideas/:idea', () => {
      it('should return an array of ideas', () => {
        const idea_id = 1;
        return supertest(app)
          .get(`/api/ideas/${idea_id}`)
          .expect(200);
      });
    
    });

    //PATCH

    describe('PATCH /ideas/:idea', () => {
      it('should return an array of ideas', () => {
        const idea_id = 1;
        return supertest(app)
          .patch(`/api/ideas/${idea_id}`)
          .expect(200);
      });
    
    });

    //DELETE

    describe('DELETE /ideas/:idea', () => {
      it('should return an array of ideas', () => {
        const idea_id = 1;
        return supertest(app)
          .delete(`/api/ideas/${idea_id}`)
          .expect(200);
      });
    
    });
      
  });

  
});




