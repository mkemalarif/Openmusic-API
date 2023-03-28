require('dotenv').config();

const Hapi = require('@hapi/hapi');
const song = require('./api/song');

const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      origin: ['*'],
    }
  });
}