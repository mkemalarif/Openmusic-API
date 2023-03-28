const {Pool} = require('pg');
const {nanoid} = require('nanoid');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong()
}

module.exports = SongService;
