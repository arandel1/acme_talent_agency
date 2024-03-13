const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_talent_agency');

const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS user_talents;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS talents;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL
    );    
    CREATE TABLE talents(
      id UUID PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    );
    CREATE TABLE user_talents(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      talent_id UUID REFERENCES users(id) NOT NULL
    );
  `;
  await client.query(SQL);

}

module.exports = {
  client,
  createTables
}