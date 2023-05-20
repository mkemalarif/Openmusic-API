const {PlaylistPayloadSchema} = require('./schema');

const InvariantError = require('../../exceptions/InvariantError');

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const playlistResult = PlaylistPayloadSchema.validate(payload);
    if (playlistResult.error) {
      throw new InvariantError(playlistResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
