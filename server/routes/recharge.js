const express = require("express");
const axios = require("axios");
const router = express.Router();
const { db } = require("../firebase");

router.post("/", async (req, res) => {
  const paymentData = req.body;
  try {
    const response = await axios.post(
      "https://api-fake-paymentportal-production.up.railway.app/api/v1/payment/card",
      paymentData
    );
    const { identifier, amount } = paymentData;

    // Actualizar el saldo del identificador
    const docRef = db.collection("identifiers").doc(identifier);
    const doc = await docRef.get();
    if (doc.exists) {
      const newBalance = doc.data().balance + parseFloat(amount);
      await docRef.update({ balance: newBalance });
      res.json({ message: "Recarga exitosa", newBalance });
    } else {
      res.status(404).json({ message: "Identificador no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el pago", error: error.message });
  }
});

module.exports = router;
