const pg = require('pg');
const uuid = require('uuid');

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

const createUser = async({ username, password }) => {
  const SQL = `
    INSERT INTO users(id, username, password)
    VALUES($1, $2, $3)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, password])
  return response.rows[0];
}

const createTalent = async({ name }) => {
  const SQL = `
    INSERT INTO talents(id, name)
    VALUES($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name])
  return response.rows[0];
}

const fetchUsers = async() => {
  const SQL = `
    SELECT *
    FROM users
  `;
  const response = await client.query(SQL)
  return response.rows;
}

const fetchTalents = async() => {
  const SQL = `
    SELECT *
    FROM talents
  `;
  const response = await client.query(SQL)
  return response.rows;
}

module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  createTalent,
  fetchTalents
} 