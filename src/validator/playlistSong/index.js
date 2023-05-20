const {PlaylistSongPayloadSchema} = require('./schema');

const InvariantError = require('../../exceptions/InvariantError');

const PlaylistSongValidator = {
  validatePlaylistSongPayload: (payload) => {
    const playlistSongResult = PlaylistSongPayloadSchema.validate(payload);
    if (playlistSongResult.error) {
      throw new InvariantError(playlistSongResult.error.message);
    }
  },
};

module.exports = PlaylistSongValidator;
