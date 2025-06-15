const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../firebase");

const router = express.Router();

// Register endpoint for creating users
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y password son requeridos" });
    }

    const usersRef = db.collection("users");
    const userSnap = await usersRef.where("email", "==", email).get();
    if (!userSnap.empty) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newUserRef = await usersRef.add({ email, password: hashed });

    const token = jwt.sign({ id: newUserRef.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y password son requeridos" });
    }

    const usersRef = db.collection("users");
    const userSnap = await usersRef.where("email", "==", email).get();
    if (userSnap.empty) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }
    const userDoc = userSnap.docs[0];
    const user = userDoc.data();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: userDoc.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al loguear usuario", error: error.message });
  }
});

module.exports = router;
