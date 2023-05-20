// const playlist = require('../playlist');
const PlaylistSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsSong',
  version: '1.0.0',
  register: async (server, {service, playlist, validator}) => {
    const playlistSongHandler = new PlaylistSongHandler(service, playlist,
        validator);
    server.route(routes(playlistSongHandler));
  },
};
