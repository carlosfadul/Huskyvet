// ===============================
// HUSKYVET BACKEND - SERVER ENTRY
// ===============================

require('dotenv').config();
const app = require('./src/app');
const db = require('./src/database');
const bcrypt = require('bcrypt');

const DEFAULT_USERNAME = 'superadmin';
const DEFAULT_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'admin123';

async function ensureSuperadmin() {
  const [rows] = await db.query(
    'SELECT usuario_id, usuario_password FROM Usuario WHERE usuario_username = ?',
    [DEFAULT_USERNAME]
  );

  if (rows.length === 0) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await db.query(
      `INSERT INTO Usuario (usuario_username, usuario_password, usuario_tipo, usuario_estado)
       VALUES (?, ?, 'superadmin', 'activo')`,
      [DEFAULT_USERNAME, passwordHash]
    );
    console.log('[AUTH] Usuario superadmin creado');
    return;
  }

  const passwordIsValid = await bcrypt.compare(DEFAULT_PASSWORD, rows[0].usuario_password);
  if (!passwordIsValid || rows[0].usuario_tipo !== 'superadmin' || rows[0].usuario_estado !== 'activo') {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await db.query(
      'UPDATE Usuario SET usuario_password = ?, usuario_tipo = \'superadmin\', usuario_estado = \'activo\' WHERE usuario_id = ?',
      [passwordHash, rows[0].usuario_id]
    );
    console.log('[AUTH] Hash legado de superadmin actualizado');
  }
}

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
ensureSuperadmin()
  .then(() => {
    app.listen(PORT, () => {
      console.log('🚀 Servidor Huskyvet corriendo');
      console.log(`🌐 URL: http://localhost:${PORT}`);
      if (process.env.NODE_ENV) {
        console.log(`🧩 Entorno: ${process.env.NODE_ENV}`);
      }
    });
  })
  .catch((error) => {
    console.error('[AUTH] No se pudo inicializar superadmin:', error.message);
    process.exit(1);
  });
