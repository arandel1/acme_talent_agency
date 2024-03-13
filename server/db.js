const pg = require('pg');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_talent_agency');

// TABLES
const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS user_talents;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS talents;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );    
    CREATE TABLE talents(
      id UUID PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    );
    CREATE TABLE user_talents(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      talent_id UUID REFERENCES talents(id) NOT NULL,
      CONSTRAINT user_talent_unique UNIQUE (user_id, talent_id)
    );
  `;
  await client.query(SQL);

}

// CREATE A USER
const createUser = async({ username, password }) => {
  const SQL = `
    INSERT INTO users(id, username, password)
    VALUES($1, $2, $3)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)])
  return response.rows[0];
}

// CREATE A TALENT
const createTalent = async({ name }) => {
  const SQL = `
    INSERT INTO talents(id, name)
    VALUES($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name])
  return response.rows[0];
}

// CREATE A USER TALENT
const createUserTalent = async({ user_id, talent_id }) => {
  const SQL = `
    INSERT INTO user_talents(id, user_id, talent_id)
    VALUES($1, $2, $3)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, talent_id])
  return response.rows[0];
}

// FETCH USERS
const fetchUsers = async() => {
  const SQL = `
    SELECT *
    FROM users
  `;
  const response = await client.query(SQL)
  return response.rows;
}

// FETCH TALENTS
const fetchTalents = async() => {
  const SQL = `
    SELECT *
    FROM talents
  `;
  const response = await client.query(SQL)
  return response.rows;
}

// FETCH USER TALENTS
const fetchUserTalents = async(user_id) => {
  const SQL = `
    SELECT *
    FROM user_talents
    WHERE user_id = $1
  `;
  const response = await client.query(SQL, [user_id])
  return response.rows;
}

// DESTROY USER TALENT
const destroyUserTalent = async({ user_id, id }) => {
  const SQL = `
    DELETE FROM user_talents
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const response = await client.query(SQL, [id, user_id])
  if(!response.rows.length){
    const error = Error('no user talent found');
    error.status = 500;
    throw error;
  }
}

// MODULE EXPORTS
module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  fetchTalents, 
  createTalent,
  createUserTalent,
  fetchUserTalents,
  destroyUserTalent
} 