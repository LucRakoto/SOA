const express = require('express');
const cors = require('cors');
require('dotenv').config();

const facturationRoutes = require('./routes/facturationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', facturationRoutes);

const PORT = 3001; // Différent du service réservation (3000)
app.listen(PORT, () => {
  console.log(`Service Facturation démarré sur le port ${PORT}`);
});
