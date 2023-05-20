const ClientError = require('../../exceptions/ClientError');

class PlaylistSongHandler {
  constructor(service, playlist, validator) {
    this._service = service;
    this._playlist = playlist;
    this._validator = validator;
  }

  async postSongOnPlaylistHandler(request, h) {
    try {
      await this._validator.validatePlaylistSongPayload(request.payload);
      const {id} = request.params;
      const {songId} = request.payload;
      const {id: credentialId} = request.auth.credentials;

      await this._playlist.verifyPlaylistOwner(id, credentialId);
      const newSongId = await this._service.addSongOnPlaylist(id, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          newSongId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }

  async getAllSongOnPlaylistHandler(request, h) {
    try {
      const {id} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._playlist.verifyPlaylistOwner(id, credentialId);
      const playlists = await this._playlist.getOwnerPlaylist(credentialId, id);
      const songs = await this._service.getSongOnPlaylist(id);
      playlists.songs = songs;
      return {
        status: 'success',
        data: {
          playlist: playlists,
        },
      };
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }

  async deleteSongOnPlaylistHandler(request, h) {
    try {
      await this._validator.validatePlaylistSongPayload(request.payload);

      const {id: credentialId} = request.auth.credentials;
      const {songId} = request.payload;
      const {id} = request.params;

      await this._playlist.verifyPlaylistOwner(id, credentialId);
      await this._service.deleteSongOnPlaylist(songId, id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      console.log(error);
      throw new ClientError(error.message, error.statusCode);
    }
  }
}

module.exports = PlaylistSongHandler;
