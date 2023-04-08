const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapAlbumsDB} = require('../../utils');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({title, year, genre, performer, duration}) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updateAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES(' +
      '$1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, genre,
        performer, duration, createdAt, updateAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows.map(mapAlbumsDB);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapAlbumsDB);
  }

  async editSongById(id, {title, year, genre, performer, duration}) {
    const updateAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1' +
      'year = $2, genre = $3, performer = 4, duration = $5' +
      'update_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, updateAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu, id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
