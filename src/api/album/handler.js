const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, song, validator) {
    this._service = service;
    this._song = song;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const {name = 'untitled', year} = request.payload;
      const albumId = await this._service.addAlbum({name, year});

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const album = await this._service.getAlbumById(id);
      const songs = await this._song.getSongAlbum(id);
      album.songs = songs;

      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (error) {
      console.log(error);
      throw new ClientError(error.message, error.statusCode);
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const {id} = request.params;
      await this._service.editAlbumById(id, request.payload);

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const {id} = request.params;
      await this._service.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } catch (error) {
      throw new ClientError(error.message, error.statusCode);
    }
  }
}

module.exports = AlbumsHandler;
