const db = require('../config/db');

class Chambre {
  static async findAll(statut_dispo = null) {
    if (statut_dispo) {
      const [rows] = await db.query('SELECT * FROM chambres WHERE statut_dispo = ?', [statut_dispo]);
      return rows;
    }
    const [rows] = await db.query('SELECT * FROM chambres');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM chambres WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(chambre) {
    const { numero, type, tarif, statut_dispo } = chambre;
    const [result] = await db.query(
      'INSERT INTO chambres (numero, type, tarif, statut_dispo) VALUES (?, ?, ?, COALESCE(?, "disponible"))',
      [numero, type, tarif, statut_dispo]
    );
    return result.insertId;
  }
}

module.exports = Chambre;
