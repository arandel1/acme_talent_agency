const { 
  client,
  createTables,
  createUser,
  createTalent,
  fetchUsers,
  fetchTalents
   } = require('./db');

const init = async() => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  // we have to connect before we make our tables
  await createTables();
  console.log('tables created');

  const [reggie, otto, tito, surfing, skating, cooking, hockey] =  await Promise.all([
    createUser({ username: 'reggie', password: '1234'}),
    createUser({ username: 'otto', password: '5678'}),
    createUser({ username: 'tito', password: '9999'}),
    createTalent({ name: 'surfing' }),
    createTalent({ name: 'skating' }),
    createTalent({ name: 'cooking' }),
    createTalent({ name: 'hockey' }),
  ]);
  console.log(await fetchUsers());
  console.log(await fetchTalents());

};

init();