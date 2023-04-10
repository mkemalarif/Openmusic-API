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
        title = 'untitled', year, genre, performer, duration} = request.payload;
      const songId = await this._service.addSong({
        title, year, genre, performer, duration});

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

  async getSongsHandler() {
    // try {
    const songs = await this._service.getSongs();

    return {
      status: 'success',
      data: {
        songs,
      },
    };
    // } catch (error) {
    //   console.log(error);
    // }
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
