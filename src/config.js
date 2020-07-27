module.exports = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL:!(process.env.NODE_ENV === 'test')
    ?process.env.DB_URL
    :process.env.TEST_DB_URL
};