const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { seedTables } = require('./test-helpers');


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
        helpers.seedTables(db,testUsers,testIdeas,testFollowedIdeas);
      });
      it('should return an array of ideas', () => {
        return supertest(app)
          .get('/api/ideas')
          .expect(200);
      });
    });
  });

  context('logged in and seeded tables', () => {
    const bearerToken = helpers.makeBearerToken(testUser);    
    beforeEach('insert test users', () => {
      return helpers.seedUsers(db,testUsers);
    });
    beforeEach('insert test ideas', () => {
      return helpers.seedIdeas(db,testIdeas);
    });
    beforeEach('insert test followed ideas', () => {
      return helpers.seedFollowedIdeas(db,testFollowedIdeas);
    });

    //POST new idea
    describe('POST /api/ideas', () => {
      const newTestIdea = {
        title: 'New Idea!',
        content: 'New Idea Content!'
      };
      it('should return the posted idea', () => {
        return supertest(app)
          .post('/api/ideas')
          .set('Authorization',`Bearer ${bearerToken}`)
          .send(newTestIdea)
          .expect(201);
        //INCOMPLETE TESTING
      });    
    });

    //Route '/:idea'
    //GET 

    describe('GET /ideas/idea/:idea', () => {
      it('should return 400 {error:\'No idea found\'}', () => {
        const idea_id = 666;
        return supertest(app)
          .get(`/api/ideas/idea/${idea_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .expect(400)
          .expect({error:'No idea found'});        
      });
      it('should return a 200 with an idea with matching id', () => {
        const idea_id = 1;
        return supertest(app)
          .get(`/api/ideas/idea/${idea_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.id).to.eql(idea_id);
            //INCOMPLETE TESTING
          });
      });
    });

    //PATCH

    describe('PATCH /ideas/idea/:idea', () => {
      it('should return 400 with missing fields', () => {
        const idea_id = 1;
        return supertest(app)
          .patch(`/api/ideas/idea/${idea_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .expect(400,{error: 'Needs at least one update field'});
            
      });
      it('should return a 401 with an idea_id that can\'t be found', () => {
        const idea_id = 666;
        return supertest(app)
          .patch(`/api/ideas/idea/${idea_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .send({title:'a different title'})
          .expect(400,{error: 'Could not find idea'});
      });
      it('should return a 401 when author_id doesn\'t match bearer token', () => {
        const ideaIdByUser2 = 2;
        const bearerTokenMatchingUser1 = bearerToken;
        return supertest(app)
          .patch(`/api/ideas/idea/${ideaIdByUser2}`)
          .set('Authorization',`Bearer ${bearerTokenMatchingUser1}`)
          .send({title:'a different title'})
          .expect(401,{error: 'Unauthorized request'});
      });
      it('should return 204', () => {        
        const idea_id = 1;
        return supertest(app)
          .patch(`/api/ideas/idea/${idea_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .send({title:'a different title'})
          .expect(204);
      });
    });

    //DELETE

    describe('DELETE /ideas/idea/:idea', () => {
      it('should return 400 if no matching id', () => {
        const idea_id = 666;
        return supertest(app)
          .delete(`/api/ideas/idea/${idea_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .expect(400,{error: 'Could not find idea'});
      });    
      it('should return 400 if author doesn\'t match idea', () => {
        const ideaIdByUser2 = 2;
        const bearerTokenMatchingUser1=bearerToken;
        return supertest(app)
          .delete(`/api/ideas/idea/${ideaIdByUser2}`)
          .set('Authorization',`Bearer ${bearerTokenMatchingUser1}`)
          .expect(401,{error: 'Unauthorized request'});
      });    
      it('should return 204', () => {
        const idea_id = 1;
        return supertest(app)
          .delete(`/api/ideas/idea/${idea_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .expect(204);
      });    
    });      
  });
});




