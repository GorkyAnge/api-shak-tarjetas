const axios = require("axios");
const kmsDecryptMiddleware = require("../middleware/kmsDecrypt");

const MULTAS_API_URL = "https://shak-multas-99076cfe6de7.herokuapp.com";

class MultasService {
  async verificarMultas(identifier) {
    try {
      const response = await axios.get(
        `${MULTAS_API_URL}/multas/verificar/${identifier}`
      );

      // La respuesta viene cifrada, necesitamos descifrarla
      if (response.data.encrypted && response.data.data) {
        const encryptedPayload = response.data.data;

        // Simular el proceso de descifrado que haría el middleware
        // En un escenario real, esto se haría a través del middleware
        const decryptedData = await this.decryptPayload(encryptedPayload);
        return decryptedData;
      }

      return response.data;
    } catch (error) {
      console.error("Error al verificar multas:", error.message);
      throw new Error(`Error al consultar multas: ${error.message}`);
    }
  }

  async decryptPayload(encryptedPayload) {
    const { kmsClient, keyName } = require("../utils/kmsClient");
    const crypto = require("crypto");
    const ALGORITHM = "aes-256-gcm";

    try {
      const { encryptedData, iv, authTag, encryptedDek } = encryptedPayload;

      // 1. Descifrar la DEK con KMS
      const [decryptResponse] = await kmsClient.decrypt({
        name: keyName,
        ciphertext: Buffer.from(encryptedDek, "base64"),
      });
      const dek = decryptResponse.plaintext;

      // 2. Descifrar el payload con la DEK
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        dek,
        Buffer.from(iv, "hex")
      );
      decipher.setAuthTag(Buffer.from(authTag, "hex"));
      let decrypted = decipher.update(encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Error al descifrar payload:", error);
      throw new Error("Error al descifrar respuesta de multas");
    }
  }
}

module.exports = new MultasService();
