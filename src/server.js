require('dotenv').config();

const Hapi = require('@hapi/hapi');
const song = require('./api/song');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/song');

const init = async () => {
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      origin: ['*'],
    },
  });

  await server.register({
    plugin: song,
    options: {
      service: songService,
      validator: SongValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
