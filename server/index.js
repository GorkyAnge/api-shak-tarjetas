require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const registerRoute = require("./routes/register");
const rechargeRoute = require("./routes/recharge");
const chargeRoute = require("./routes/charge");
const balanceRoute = require("./routes/balance");
const checkIdentifierRoute = require("./routes/checkIdentifier");

const app = express();
const port = process.env.PORT || 5001; // <- cambio aquí

app.use(cors());
app.use(bodyParser.json());

// Auth routes (public)
app.use('/api/auth', authRoute);

// Protected routes
app.use('/api/register', authMiddleware, registerRoute);
app.use('/api/recharge', authMiddleware, rechargeRoute);
app.use('/api/charge', authMiddleware, chargeRoute);
app.use('/api/balance', authMiddleware, balanceRoute);
app.use('/checkIdentifier', authMiddleware, checkIdentifierRoute);

app.get("/", (req, res) => {
  res.send("API REST para recargas de saldo en línea");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
