const db = require('../config/db');

class Reservation {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM reservations');
    return rows;
  }
  
  static async create(reservation) {
    const { client_id, chambre_id, date_entree, date_sortie, prix_total } = reservation;
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Vérifier si la chambre est disponible avec verrouillage pessimiste
      const [chambres] = await connection.query(
        'SELECT id, statut_dispo FROM chambres WHERE id = ? FOR UPDATE',
        [chambre_id]
      );

      if (chambres.length === 0) {
        throw new Error('CHAMBRE_NOT_FOUND');
      }
      if (chambres[0].statut_dispo !== 'disponible') {
        throw new Error('CHAMBRE_INDISPONIBLE');
      }

      // Vérification de chevauchement de dates
      const [chevauchements] = await connection.query(
        'SELECT id FROM reservations WHERE chambre_id = ? AND (date_entree < ? AND date_sortie > ?)',
        [chambre_id, date_sortie, date_entree]
      );

      if (chevauchements.length > 0) {
        throw new Error('CHAMBRE_OVERLAP');
      }

      // Création de la réservation
      const [result] = await connection.query(
        'INSERT INTO reservations (client_id, chambre_id, date_entree, date_sortie, statut, prix_total, statut_paiement) VALUES (?, ?, ?, ?, "confirmee", ?, "en_attente")',
        [client_id, chambre_id, date_entree, date_sortie, prix_total]
      );

      // Mise à jour de la chambre
      await connection.query(
        'UPDATE chambres SET statut_dispo = "occupee" WHERE id = ?',
        [chambre_id]
      );

      await connection.commit();
      return result.insertId;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Reservation;
