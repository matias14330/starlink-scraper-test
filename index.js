import express from 'express';
import dotenv from 'dotenv';
import basicAuth from 'basic-auth';
import axios from 'axios';
import schedule from 'node-schedule';

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

let starlinkData = [];

// Autenticación simple
app.use((req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== process.env.USERNAME || user.pass !== process.env.PASSWORD) {
    res.set('WWW-Authenticate', 'Basic realm="Starlink Panel"');
    return res.status(401).send('Acceso denegado');
  }
  next();
});

// Página principal
app.get('/', (req, res) => {
  res.render('dashboard', { starlinkData });
});

// Simula scraping (aquí debes integrar la API oficial o puppeteer)
async function fetchStarlinkData() {
  console.log('Actualizando datos de Starlink...');
  const data = [];

  for (let i = 1; i <= 2; i++) {
    const email = process.env[`STARLINK_EMAIL_${i}`];
    const pass = process.env[`STARLINK_PASS_${i}`];

    // Aquí pondrás el scraper real
    data.push({
      email,
      plan: "Standard",
      estado: "Activo",
      renovacion: "2025-08-01"
    });
  }

  starlinkData = data;
}

// Actualiza cada 30 minutos
fetchStarlinkData();
schedule.scheduleJob('*/30 * * * *', fetchStarlinkData);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
