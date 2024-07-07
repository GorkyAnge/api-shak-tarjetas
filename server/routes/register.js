const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

router.post('/', async (req, res) => {
  try {
    const { identifier } = req.body;
    const docRef = db.collection('identifiers').doc(identifier);
    await docRef.set({ balance: 0 });
    res.status(201).json({ message: 'Identificador registrado', identifier });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar identificador', error: error.message });
  }
});

module.exports = router;
