// src/controllers/auth.controller.js
const db = require('../database'); // conexión a MySQL
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
  login: async (req, res) => {
    const username = typeof req.body.username === 'string'
      ? req.body.username.trim()
      : '';
    const { password } = req.body;

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
  },

  changePassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId || typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ message: 'Datos de contraseña incompletos' });
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener entre 8 y 72 caracteres' });
    }

    try {
      const [rows] = await db.query(
        'SELECT usuario_password FROM Usuario WHERE usuario_id = ? AND usuario_estado = \'activo\'',
        [userId]
      );

      if (rows.length === 0 || !(await bcrypt.compare(currentPassword, rows[0].usuario_password))) {
        return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
      }

      if (await bcrypt.compare(newPassword, rows[0].usuario_password)) {
        return res.status(400).json({ message: 'La nueva contraseña debe ser diferente' });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await db.query(
        'UPDATE Usuario SET usuario_password = ? WHERE usuario_id = ?',
        [passwordHash, userId]
      );

      return res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }
  }
};

module.exports = authController;
