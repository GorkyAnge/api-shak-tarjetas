const express = require("express");
const router = express.Router();
const multasService = require("../services/multasService");

// Endpoint para verificar multas de un identificador específico
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;

    console.log(`Verificando multas para: ${identifier}`);

    const multasInfo = await multasService.verificarMultas(identifier);

    res.json({
      identifier,
      tieneMultasSinPagar: multasInfo.tieneMultasSinPagar,
      mensaje: multasInfo.mensaje,
      timestamp: multasInfo.timestamp,
      consultaExitosa: true,
    });
  } catch (error) {
    console.error("Error al verificar multas:", error);
    res.status(500).json({
      identifier: req.params.identifier,
      error: "Error al consultar el estado de multas",
      details: error.message,
      consultaExitosa: false,
    });
  }
});

module.exports = router;
