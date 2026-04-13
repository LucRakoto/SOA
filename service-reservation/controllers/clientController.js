const Client = require('../models/clientModel');

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createClient = async (req, res) => {
  try {
    const { nom, email, telephone, type_piece_id, num_piece } = req.body;
    if (!nom || !email || !type_piece_id || !num_piece) {
      return res.status(400).json({ message: 'Informations manquantes (nom, email, type_piece_id, num_piece obligatoires)' });
    }

    const id = await Client.create(req.body);
    res.status(201).json({ message: 'Client créé avec succès', id });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Un client avec cet e-mail ou ce numéro de pièce existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
};
