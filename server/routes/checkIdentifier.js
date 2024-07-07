const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

router.post('/', async (req, res) => {
  try {
    const { identifier } = req.body;
    const docRef = db.collection('identifiers').doc(identifier);
    const doc = await docRef.get();

    if (doc.exists) {
      res.status(200).json({ message: 'Identificador existe', identifier });
    } else {
      res.status(404).json({ message: 'Identificador no encontrado', identifier });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar identificador', error: error.message });
  }
});

module.exports = router;
