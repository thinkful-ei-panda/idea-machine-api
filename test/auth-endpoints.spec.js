const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');


describe('Auth Endpoints', () => {
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

  describe('POST /api/auth/login', () => {
    beforeEach('', () => {
      return helpers.seedUsers(db,testUsers);
    });

    context('for each missing user input', () => {
      const loginUserInputs = ['user_name','password'];    

      loginUserInputs.forEach(key => {
        it(`should return 400 when Missing  ${key}`, () => {
          const loginUser = {
            user_name: 'dunder',
            password: 'password'
          };
          delete loginUser[key];

          return supertest(app)
            .post('/api/auth/login')
            .send(loginUser)
            .expect(400)
            .expect({error: `Missing ${key}`});
        });
      });
    });

    it('should return 400 when Invalid name', () => {
      const loginUser = {
        user_name: 'INVALID NAME',
        password: 'password'
      };

      return supertest(app)
        .post('/api/auth/login')
        .send(loginUser)
        .expect(401)
        .expect({error: 'Invalid name or password'});
    });

    it('should return 400 when Invalid password', () => {
      const loginUser = {
        user_name: testUser.user_name,
        password: 'INVALIDpassword'
      };

      return supertest(app)
        .post('/api/auth/login')
        .send(loginUser)
        .expect(401)
        .expect({error: 'Invalid name or password'});
    });

    it('should return 200 with bearer token when login matches database', () => {
      const bearerToken = helpers.makeBearerToken(testUser);
      const loginUser = {
        user_name: 'dunder',
        password: 'password'
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(loginUser)
        .expect(200)
        .expect(res => {
          expect(res.body.authToken).to.exist;
          expect(helpers.verifyJwt(res.body.authToken).sub).to.eql(loginUser.user_name);
        });
    });
  });
});