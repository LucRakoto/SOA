const Chambre = require('../models/chambreModel');

exports.getAllChambres = async (req, res) => {
  try {
    const { statut_dispo } = req.query;
    const chambres = await Chambre.findAll(statut_dispo);
    res.json(chambres);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createChambre = async (req, res) => {
  try {
    const id = await Chambre.create(req.body);
    res.status(201).json({ message: 'Chambre créée', id });
  } catch (error) {
    res.status(500).json({ message: 'Erreur création', error: error.message });
  }
};
