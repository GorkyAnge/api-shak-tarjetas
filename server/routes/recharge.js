const express = require("express");
const axios = require("axios");
const router = express.Router();
const { db } = require("../firebase");

router.post("/", async (req, res) => {
  const paymentData = req.body;
  try {
    const response = await axios.post(
      "https://api-fake-paymentportal-cbea796d6f87.herokuapp.com/api/v1/payment/card",
      paymentData
    );

    const { identifier, amount } = paymentData;
    const docRef = db.collection("identifiers").doc(identifier);
    const doc = await docRef.get();

    if (doc.exists) {
      // Si el identificador existe, actualizar saldo
      const newBalance = doc.data().balance + parseFloat(amount);
      await docRef.update({ balance: newBalance });
      res.json({ message: "Recarga exitosa", newBalance });
    } else {
      // Si no existe, crearlo con el monto inicial
      await docRef.set({ balance: parseFloat(amount) });
      res.json({
        message: "Identificador creado y recarga exitosa",
        newBalance: parseFloat(amount),
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el pago", error: error.message });
  }
});

module.exports = router;
