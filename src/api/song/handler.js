const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {
        title = 'untitled', year,
        genre, performer, duration, albumId} = request.payload;
      const songId = await this._service.addSong({
        title, year, genre, performer, duration, albumId});

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }

  async getSongsHandler(request, h) {
    try {
      const {title, performer} = request.query;
      let songs;

      if (title !== undefined && performer !== undefined) {
        songs = await this._service.getSongsByQuery(title, performer);
      } else if (title !== undefined) {
        songs = await this._service.getSongsByTitle(title);
      } else if (performer !== undefined) {
        songs = await this._service.getSongsByPerformer(performer);
      } else {
        songs = await this._service.getSongs();
      }

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {id} = request.params;
      await this._service.editSongById(id, request.payload);

      return {
        status: 'success',
        message: 'Lagu berhasil dirubah',
      };
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const {id} = request.params;
      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }
}

module.exports = SongsHandler;
