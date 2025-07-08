const { kmsClient, keyName } = require("../utils/kmsClient");
const crypto = require("crypto");
const ALGORITHM = "aes-256-gcm";

async function googleKmsDecryptMiddleware(req, res, next) {
  try {
    const { encryptedData, iv, authTag, encryptedDek } = req.body;

    // 1. Pide a Google KMS que DESCIFRE la clave de datos (DEK)
    const [decryptResponse] = await kmsClient.decrypt({
      name: keyName,
      ciphertext: Buffer.from(encryptedDek, "base64"),
    });
    const dek = decryptResponse.plaintext;

    // 2. Usa la DEK descifrada para descifrar el payload localmente
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      dek,
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    // 3. Reemplaza el body cifrado por el original
    req.body = JSON.parse(decrypted);
    next();
  } catch (error) {
    console.error("Error de descifrado con Google KMS:", error);
    res.status(400).json({ message: "Payload inválido o corrupto." });
  }
}

module.exports = googleKmsDecryptMiddleware;
