// database.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ?? process.env.DB_PASS ?? '',
  database: process.env.DB_NAME || 'huskyvet',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Para evitar problemas de TZ y parseo:
  dateStrings: true,       // DATETIME/DATE como string (no Date)
  decimalNumbers: true,    // DECIMAL/NEWDECIMAL como Number
  // multipleStatements: false, // (por seguridad, mantener en false)
});

// Prueba de conexión al iniciar (no bloquea la app si falla, solo loguea)
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('[DB] Conexión OK');
  } catch (e) {
    console.error('[DB] Error de conexión:', e.message);
  }
})();

// Cierre limpio del pool al terminar el proceso
const shutdown = async (signal) => {
  try {
    console.log(`[DB] Recibido ${signal}. Cerrando pool...`);
    await pool.end();
    console.log('[DB] Pool cerrado correctamente');
    process.exit(0);
  } catch (err) {
    console.error('[DB] Error cerrando pool:', err.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = pool;

