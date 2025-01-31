const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

router.get("/:identifier", async (req, res) => {
  const { identifier } = req.params;
  try {
    const docRef = db.collection("identifiers").doc(identifier);
    const doc = await docRef.get();
    if (doc.exists) {
      res.json({ identifier, balance: doc.data().balance });
    } else {
      res.status(404).json({ message: "Identificador no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al consultar el saldo", error: error.message });
  }
});

module.exports = router;
