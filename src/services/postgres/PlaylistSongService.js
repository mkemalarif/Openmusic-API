const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');


class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async verifySong(songId) {
    const query = {
      text: 'SELECT * FROM songs where id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async addSongOnPlaylist(playlistId, songId) {
    await this.verifySong(songId);
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan kedalam playlist');
    }

    return result.rows[0].id;
  }

  async getSongOnPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer from playlist_songs 
      RIGHT JOIN songs
      ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows;
  }

  async deleteSongOnPlaylist(songId, playlistId) {
    const query = {
      text: `DELETE FROM playlist_songs
      WHERE song_id = $1 AND playlist_id = $2 RETURNING id`,
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus karena tidak ditemukan');
    }
  }
};

module.exports = PlaylistSongService;
