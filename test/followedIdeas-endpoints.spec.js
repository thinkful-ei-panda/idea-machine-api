const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');
const { beforeEach } = require('mocha');


describe.only('Followed Ideas Endpoints', () => {
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

  beforeEach('seed tabls', () => {
    return helpers.seedTables(db,testUsers,testIdeas,testFollowedIdeas);
  });

  const bearerToken = helpers.makeBearerToken(testUser);

  //GET /

  describe('GET /api/followedIdeas', () => {
    it('returns 200', () => {
      return supertest(app)
        .get('/api/followedIdeas')
        .set('Authorization', `Bearer ${bearerToken}`)
        .expect(200);
    });
  });

  //POST /

  describe('POST /api/followedIdeas', () => {
    context('missing idea_id', () => {
      const missingInput = ['idea_id'];

      missingInput.forEach(key => {
        it(`returns 400 if missing ${key}`, () => {
          const followTarget = {
            idea_id:1,
            follower_id:1
          };
          delete followTarget[key];
          return supertest(app)
            .post('/api/followedIdeas')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(followTarget)
            .expect(400)
            .expect({error: `Missing ${key}`});
        });
      });
    });

    it('returns 400 if already following idea', () => {      
      const alreadyFollowedIdea = testFollowedIdeas[0];
      return supertest(app)
        .post('/api/followedIdeas')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(alreadyFollowedIdea)
        .expect(400)
        .expect({error: 'You are already following this idea'});
    });

    it('returns 400 if idea doesn\'t exist', () => {      
      const nonexistantIdea = {idea_id:300};
      return supertest(app)
        .post('/api/followedIdeas')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(nonexistantIdea)
        .expect(400)
        .expect({error: 'That idea doesn\'t exist'});
    });

    it('returns 201 if idea is valid to follow', () => {
      const ideaToFollow = {idea_id: 8};
      return supertest(app)
        .post('/api/followedIdeas')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(ideaToFollow)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.eql(8);
        });
    });
  });

  //GET /:id

  describe('GET /api/followedIdeas/:id', () => {
    it('returns 200 with the followed idea', () => {
      return supertest(app)
        .get('/api/followedIdeas/1')
        .set('Authorization', `Bearer ${bearerToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.eql(1);
        });
    });
  });

  //DELETE /:id

  describe('DELETE /api/followedIdeas/:id', () => {
    it('returns 400 if followed idea couldn\'t be found', () => {
      return supertest(app)
        .delete('/api/followedIdeas/30')
        .set('Authorization', `Bearer ${bearerToken}`)
        .expect(401)
        .expect({error: 'Could not find followed idea'});
    });

    it('returns 204', () => {
      return supertest(app)
        .delete('/api/followedIdeas/1')
        .set('Authorization', `Bearer ${bearerToken}`)
        .expect(204);
    });
  });
});