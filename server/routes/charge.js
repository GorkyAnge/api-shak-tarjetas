const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

router.post('/', async (req, res) => {
  const { identifier, amount } = req.body;
  try {
    const docRef = db.collection('identifiers').doc(identifier);
    const doc = await docRef.get();
    if (doc.exists) {
      const currentBalance = doc.data().balance;
      if (currentBalance >= amount) {
        const newBalance = currentBalance - amount;
        await docRef.update({ balance: newBalance });
        res.json({ message: 'Cobro realizado', identifier, newBalance });
      } else {
        res.status(400).json({ message: 'Saldo insuficiente' });
      }
    } else {
      res.status(404).json({ message: 'Identificador no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al realizar el cobro', error: error.message });
  }
});

module.exports = router;

