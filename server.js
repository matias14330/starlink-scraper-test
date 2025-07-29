require('dotenv').config();
const express = require('express');
const path = require('path');
const cron = require('node-cron');

const authMiddleware = require('./auth/auth');
const fetchStarlinkData = require('./starlink/fetchStarlinkData');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/panel', authMiddleware);
app.use('/api', authMiddleware);

let latestData = {};

app.get('/panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/starlink', (req, res) => {
  res.json(latestData);
});

const updateStarlinkData = async () => {
  console.log('🔄 Actualizando datos de Starlink...');
  try {
    latestData = await fetchStarlinkData();
    console.log('✅ Datos actualizados');
  } catch (err) {
    console.error('❌ Error al obtener datos:', err.message);
  }
};

cron.schedule('*/30 * * * *', updateStarlinkData);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/panel`);
  updateStarlinkData();
});
