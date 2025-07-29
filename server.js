require('dotenv').config();
const express = require('express');
const fetchStarlinkData = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/starlink', async (req, res) => {
  try {
    const data = await fetchStarlinkData(
      process.env.STARLINK_USER_1,
      process.env.STARLINK_PASS_1
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener datos de Starlink' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
