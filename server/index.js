const { 
  client,
  createTables,
  createUser,
  createTalent,
  createUserTalent,
  fetchUsers,
  fetchTalents,
  fetchUserTalents,
  destroyUserTalent
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

  const [reggieSurfs, reggieSkates] = await Promise.all([
    createUserTalent({ user_id: reggie.id, talent_id: surfing.id}),
    createUserTalent({ user_id: reggie.id, talent_id: skating.id}),
  ]);

  console.log(await fetchUserTalents(reggie.id));

  // test that this errors -- otto doesn't skate
  // await destroyUserTalent( { user_id: otto.id, id: reggieSkates.id});

  await destroyUserTalent(reggieSurfs); 

  console.log(await fetchUserTalents(reggie.id));

};

init();