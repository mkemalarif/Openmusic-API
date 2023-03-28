const {Pool} = require('pg');
const {nanoid} = require('nanoid');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({title, year}) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, title, year],
    };

    const result = await this._pool.query(query);

    // if(!result.rows[0].id){
    // throw new error;
    // }

    return result.rows[0].id;
  }
}

module.exports = AlbumService;
