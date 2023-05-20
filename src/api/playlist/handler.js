const ClientError = require('../../exceptions/ClientError');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);
      const {name} = request.payload;
      const {id: credentialId} = request.auth.credentials;

      const playlistId = await this._service.addPlaylist({
        name, owner: credentialId,
      });

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }

  async getPlaylistHandler(request, h) {
    try {
      const {id: credentialId} = request.auth.credentials;
      const playlist = await this._service.getPlaylist(credentialId);

      return {
        status: 'success',
        data: {
          playlists: playlist,
        },
      };
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const {id} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylist(id);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus.',
      };
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }
}

module.exports = PlaylistHandler;
