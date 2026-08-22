// ===============================
// HUSKYVET BACKEND - SERVER ENTRY
// ===============================

require('dotenv').config();
const app = require('./src/app');

// Validar puerto desde .env o usar 3000 por defecto
const PORT = process.env.PORT || 3000;

// Capturar errores no controlados
process.on('uncaughtException', (err) => {
  console.error('❌ Error no controlado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Promesa rechazada sin manejar:', reason);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log('🚀 Servidor Huskyvet corriendo');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  if (process.env.NODE_ENV) {
    console.log(`🧩 Entorno: ${process.env.NODE_ENV}`);
  }
});
