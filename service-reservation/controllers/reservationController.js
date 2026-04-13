const Reservation = require('../models/reservationModel');
const Chambre = require('../models/chambreModel');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { client_id, chambre_id, date_entree, date_sortie } = req.body;
    if (!client_id || !chambre_id || !date_entree || !date_sortie) {
      return res.status(400).json({ message: 'Informations de réservation manquantes (client_id, chambre_id, date_entree, date_sortie)' });
    }

    if (new Date(date_entree) >= new Date(date_sortie)) {
      return res.status(400).json({ message: 'La date d\'entrée doit être strictement inférieure à la date de sortie' });
    }

    const chambre = await Chambre.findById(chambre_id);
    if (!chambre) {
      return res.status(404).json({ message: 'Chambre introuvable' });
    }

    const dateEntreeObj = new Date(date_entree);
    const dateSortieObj = new Date(date_sortie);
    const nuits = Math.ceil((dateSortieObj - dateEntreeObj) / (1000 * 3600 * 24));
    const prix_total = nuits * chambre.tarif;

    const id = await Reservation.create({ client_id, chambre_id, date_entree, date_sortie, prix_total });
    res.status(201).json({ message: 'Réservation créée avec succès', id });
  } catch (error) {
    if (error.message === 'CHAMBRE_OVERLAP') {
      return res.status(400).json({ message: 'Désolé, cette chambre est déjà occupée pour la période sélectionnée.' });
    }
    if (error.message === 'CHAMBRE_NOT_FOUND') {
      return res.status(404).json({ message: 'Chambre introuvable' });
    }
    if (error.message === 'CHAMBRE_INDISPONIBLE') {
      return res.status(409).json({ message: "La chambre demandée n'est pas disponible." });
    }
    res.status(500).json({ message: 'Erreur lors de la réservation', error: error.message });
  }
};
