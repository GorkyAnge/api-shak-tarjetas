const express = require("express");
const axios = require("axios");
const router = express.Router();
const { db } = require("../firebase");
const multasService = require("../services/multasService");

router.post("/", async (req, res) => {
  const paymentData = req.body;
  const { identifier, amount } = paymentData;

  try {
    // 1. Verificar si el usuario tiene multas antes de procesar la recarga
    console.log(`Verificando multas para el identificador: ${identifier}`);

    const multasInfo = await multasService.verificarMultas(identifier);

    if (multasInfo.tieneMultasSinPagar) {
      return res.status(403).json({
        message:
          "No se puede procesar la recarga. El usuario tiene multas pendientes.",
        tieneMultasSinPagar: true,
        detalleMultas: multasInfo.mensaje,
      });
    }

    // 2. Si no tiene multas, proceder con el pago
    console.log(`Usuario sin multas, procesando recarga para: ${identifier}`);

    const response = await axios.post(
      "https://api-fake-paymentportal-cbea796d6f87.herokuapp.com/api/v1/payment/card",
      paymentData
    );

    // 3. Actualizar o crear el saldo en Firebase
    const docRef = db.collection("identifiers").doc(identifier);
    const doc = await docRef.get();

    if (doc.exists) {
      // Si el identificador existe, actualizar saldo
      const newBalance = doc.data().balance + parseFloat(amount);
      await docRef.update({ balance: newBalance });
      res.json({
        message: "Recarga exitosa",
        newBalance,
        multasVerificadas: true,
        tieneMultasSinPagar: false,
      });
    } else {
      // Si no existe, crearlo con el monto inicial
      await docRef.set({ balance: parseFloat(amount) });
      res.json({
        message: "Identificador creado y recarga exitosa",
        newBalance: parseFloat(amount),
        multasVerificadas: true,
        tieneMultasSinPagar: false,
      });
    }
  } catch (error) {
    console.error("Error en el proceso de recarga:", error);

    // Si el error es de verificación de multas, devolver un error específico
    if (error.message.includes("consultar multas")) {
      return res.status(503).json({
        message: "Error al verificar multas. Intente más tarde.",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Error en el pago",
      error: error.message,
    });
  }
});

module.exports = router;
