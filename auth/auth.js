// auth/auth.js

const express = require('express');
const router = express.Router();

const USERS = {
  admin: process.env.ADMIN_PASSWORD || 'starlink123'
};

// Middleware para login básico
router.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.set('WWW-Authenticate', 'Basic realm="Starlink Panel"');
    return res.status(401).send('Autenticación requerida.');
  }

  const [, encoded] = auth.split(' ');
  const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');

  if (USERS[user] && USERS[user] === pass) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Starlink Panel"');
  return res.status(401).send('Credenciales inválidas');
});

module.exports = router;
