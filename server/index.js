require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require("./routes/auth");
const registerRoute = require("./routes/register");
const rechargeRoute = require("./routes/recharge");
const chargeRoute = require("./routes/charge");
const balanceRoute = require("./routes/balance");
const checkIdentifierRoute = require("./routes/checkIdentifier");
const multasRoute = require("./routes/multas");

const app = express();
const port = process.env.PORT || 5001; // <- cambio aquí

app.use(cors());
app.use(bodyParser.json());

// Auth routes (public)
app.use("/api/auth", authRoute);

// All routes now public (authentication middleware removed)
app.use("/api/register", registerRoute);
app.use("/api/recharge", rechargeRoute);
app.use("/api/charge", chargeRoute);
app.use("/api/balance", balanceRoute);
app.use("/checkIdentifier", checkIdentifierRoute);
app.use("/api/multas", multasRoute);

app.get("/", (req, res) => {
  res.send("API REST para recargas de saldo en línea");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
