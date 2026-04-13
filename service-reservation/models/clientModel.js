const db = require('../config/db');

class Client {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM clients');
    return rows;
  }

  static async create(client) {
    const { nom, email, telephone, type_piece_id, num_piece } = client;
    const [result] = await db.query(
      'INSERT INTO clients (nom, email, telephone, type_piece_id, num_piece) VALUES (?, ?, ?, ?, ?)',
      [nom, email, telephone, type_piece_id, num_piece]
    );
    return result.insertId;
  }
}

module.exports = Client;
