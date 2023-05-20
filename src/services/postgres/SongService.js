const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapSongDB} = require('../../utils');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({title, year, genre, performer, duration, albumId}) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updateAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES(' +
      '$1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre,
        duration, createdAt, updateAt, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query(
        `SELECT id, title, performer FROM songs`);
    return result.rows.map(mapSongDB);
  }
  async getSongsByTitle(title) {
    const query = {
      text: `SELECT id, title, performer 
      FROM songs WHERE LOWER(title) LIKE $1`,
      values: [`%${title}%`],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapSongDB);
  }
  async getSongsByPerformer(performer) {
    const query = {
      text: `SELECT id, title, performer
      FROM songs WHERE LOWER(performer) LIKE $1`,
      values: [`%${performer}%`],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapSongDB);
  }

  async getSongsByQuery(title, performer) {
    const query = {
      text: `SELECT id, title, performer
      FROM songs WHERE LOWER(title) LIKE $1
      AND LOWER(performer) LIKE $2`,
      values: [`%${title}%`, `%${performer}%`],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapSongDB);
  }

  async getSongAlbum(id) {
    const query = {
      text: `SELECT albums.id, albums.name, albums.year,
      songs.* FROM albums INNER JOIN songs 
      ON songs.album_id = albums.id
      WHERE albums.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapSongDB);
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

    return result.rows.map(mapSongDB)[0];
  }

  async editSongById(id, {title, year, performer, genre, duration}) {
    const updateAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1,' +
      'year = $2, performer = $3, genre = $4, duration = $5,' +
      'updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updateAt, id],
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
