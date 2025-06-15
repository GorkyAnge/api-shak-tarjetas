### Autenticación

**POST /api/auth/register**

Registra un nuevo usuario y devuelve un JWT.

Request Body:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:

```json
{
  "token": "JWT_TOKEN_HERE"
}
```

**POST /api/auth/login**

Autentica un usuario y devuelve un JWT.

Request Body:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:

```json
{
  "token": "JWT_TOKEN_HERE"
}
```

### Autorización

Todas las siguientes rutas requieren el JWT en la cabecera `Authorization`:

```
Authorization: Bearer JWT_TOKEN_HERE
```

---

### Shak Tarjetas

**POST /shak-tarjetas/register**

Registers a unique identifier.

Request Body:

```json
{
  "identifier": "PBO1234"
}
```

Response:

```json
{
  "message": "Identificador registrado",
  "identifier": "PBO1234"
}
```

**POST /shak-tarjetas/recharge**

Recharges a unique identifier.

Request Body:

```json
{
  "app_name": "MyApp",
  "service": "Recarga de Identificador",
  "customer_email": "gorkyange2@gmail.com",
  "card_type": "VISA",
  "card_holder_name": "John Doe",
  "card_number": "4242424242424242",
  "expiryMonth": "12",
  "expiryYear": "2024",
  "cvv": "123",
  "amount": "150.00",
  "currency": "USD",
  "identifier": "PBO1234"
}
```

Response:

```json
{
  "message": "Recarga exitosa",
  "newBalance": 150
}
```

**POST /shak-tarjetas/charge**

Charges an amount from a unique identifier.

Request Body:

```json
{
  "identifier": "PBO1234",
  "amount": 75.0
}
```

Response:

```json
{
  "message": "Cobro realizado",
  "identifier": "PBO1234",
  "newBalance": 75
}
```

**POST /shak-tarjetas/checkIdentifier**

Checks if an identifier exists.

Request Body:

```json
{
  "identifier": "PBO1234"
}
```

Response:

```json
{
  "message": "Identificador existe",
  "identifier": "PBO1234"
}
```
