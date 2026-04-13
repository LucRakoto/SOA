const db = require('../config/db');

exports.getFacture = async (req, res) => {
  const { reservationId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT r.*, c.nom as client_nom, c.email as client_email, 
             ch.numero as chambre_numero, ch.type as chambre_type, ch.tarif as chambre_tarif
      FROM reservations r
      JOIN clients c ON r.client_id = c.id
      JOIN chambres ch ON r.chambre_id = ch.id
      WHERE r.id = ?
    `, [reservationId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    const reservation = rows[0];
    
    // Calcul du nombre de nuits
    const dateEntreeObj = new Date(reservation.date_entree);
    const dateSortieObj = new Date(reservation.date_sortie);
    const nuits = Math.ceil((dateSortieObj - dateEntreeObj) / (1000 * 3600 * 24));

    // Calculs de prix
    const montantTotalTTC = parseFloat(reservation.prix_total);
    const TAUX_TVA = 0.20; // 20%
    const prixHT = +(montantTotalTTC / (1 + TAUX_TVA)).toFixed(2);
    const montantTVA = +(montantTotalTTC - prixHT).toFixed(2);

    res.json({
      reservation_id: reservation.id,
      client: {
        nom: reservation.client_nom,
        email: reservation.client_email
      },
      chambre: {
        numero: reservation.chambre_numero,
        type: reservation.chambre_type,
        tarif_nuit: reservation.chambre_tarif
      },
      sejour: {
        date_entree: reservation.date_entree,
        date_sortie: reservation.date_sortie,
        nuits: nuits
      },
      facturation: {
        prix_ht: prixHT,
        tva: montantTVA,
        montant_total: montantTotalTTC,
        statut_paiement: reservation.statut_paiement
      }
    });

  } catch (error) {
    console.error('Erreur getFacture:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la facture' });
  }
};

exports.enregistrerPaiement = async (req, res) => {
  const { reservationId } = req.body;
  if (!reservationId) {
    return res.status(400).json({ message: 'Le paramètre reservationId est requis' });
  }

  try {
    const [result] = await db.query(
      "UPDATE reservations SET statut_paiement = 'paye' WHERE id = ?",
      [reservationId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    res.json({ message: 'Paiement enregistré avec succès, le statut est maintenant "paye"' });
  } catch (error) {
    console.error('Erreur enregistrerPaiement:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement du paiement' });
  }
};
