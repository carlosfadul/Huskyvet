// src/controllers/auth.controller.js
const db = require('../database'); // conexión a MySQL
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      // 1️⃣ Buscar usuario por username
      const [rows] = await db.query(
        'SELECT * FROM Usuario WHERE usuario_username = ?',
        [username]
      );

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      const user = rows[0];

      // 2️⃣ Validar contraseña
      const match = await bcrypt.compare(password, user.usuario_password);
      if (!match) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // 3️⃣ Armar payload con la info que necesitamos en el frontend
      const payload = {
        id: user.usuario_id,
        tipo: user.usuario_tipo,           // 👈 AQUÍ VA EL ROL (superadmin, admin, etc.)
        nombre: user.usuario_username,
        estado: user.usuario_estado
      };

      // 4️⃣ Firmar token JWT
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secreto',
        { expiresIn: '1h' }
      );

      // 5️⃣ Responder al frontend con token + usuario
      res.json({
        token,
        usuario: payload
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};

module.exports = authController;
