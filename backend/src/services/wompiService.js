// Wompi Service - Placeholder para futura integración

// Nota: Wompi El Salvador no proporciona API de desarrollador completa
// Este servicio está preparado para cuando esté disponible

class WompiService {
  constructor() {
    this.appId = process.env.WOMPI_APP_ID;
    this.apiSecret = process.env.WOMPI_API_SECRET;
    this.publicKey = process.env.WOMPI_PUBLIC_KEY;
    this.privateKey = process.env.WOMPI_PRIVATE_KEY;
    this.environment = process.env.WOMPI_ENVIRONMENT || 'test';
  }

  // Crear transacción (pendiente de implementación)
  async createTransaction(data) {
    throw new Error('Wompi API no disponible en El Salvador - usar método manual');
  }

  // Verificar estado de transacción (pendiente de implementación)
  async getTransactionStatus(transactionId) {
    throw new Error('Wompi API no disponible en El Salvador - usar método manual');
  }

  // Webhook handler (pendiente de implementación)
  async handleWebhook(payload, signature) {
    throw new Error('Wompi API no disponible en El Salvador - usar método manual');
  }
}

module.exports = new WompiService();
