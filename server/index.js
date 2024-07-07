const express = require('express');
const bodyParser = require('body-parser');
const registerRoute = require('./routes/register');
const rechargeRoute = require('./routes/recharge');
const chargeRoute = require('./routes/charge');
const checkIdentifierRoute = require('./routes/checkIdentifier');

const app = express();
const port = 5001;

// Middleware
app.use(bodyParser.json());

// Rutas
app.get('/', (req, res) => {
  res.send('API REST para recargas de saldo en línea');
});

app.use('/api/register', registerRoute);
app.use('/api/recharge', rechargeRoute);
app.use('/api/charge', chargeRoute);
app.use('/checkIdentifier', checkIdentifierRoute); 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
