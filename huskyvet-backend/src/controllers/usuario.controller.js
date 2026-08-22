const db = require('../database');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios (con imagen base64)
const getUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Usuario');
        const usuarios = rows.map(usuario => ({
            ...usuario,
            usuario_foto: usuario.usuario_foto
                ? `data:image/jpeg;base64,${usuario.usuario_foto.toString('base64')}`
                : null
        }));
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Usuario WHERE usuario_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuario = rows[0];
        if (usuario.usuario_foto) {
            usuario.usuario_foto = `data:image/jpeg;base64,${usuario.usuario_foto.toString('base64')}`;
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

// Crear usuario
const createUsuario = async (req, res) => {
    const {
        empleado_id,
        sucursal_id,
        veterinaria_id,
        usuario_username,
        usuario_password,
        usuario_tipo,
        usuario_estado,
        ultimo_login
    } = req.body;

    const usuario_foto = req.file ? req.file.buffer : null;

    try {
        // Verificar si ya existe un usuario con el mismo username
        const [existing] = await db.query(
            'SELECT usuario_id FROM Usuario WHERE usuario_username = ?',
            [usuario_username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'El nombre de usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuario_password, salt);

        const [result] = await db.query(
            `INSERT INTO Usuario (empleado_id, sucursal_id, veterinaria_id, usuario_username, usuario_password, usuario_tipo, usuario_estado, usuario_foto, ultimo_login)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                empleado_id || null,
                sucursal_id || null,
                veterinaria_id || null,
                usuario_username,
                hashedPassword,
                usuario_tipo,
                usuario_estado || 'activo',
                usuario_foto,
                ultimo_login || null
            ]
        );
        res.status(201).json({ message: 'Usuario creado', usuario_id: result.insertId });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};


// Actualizar usuario
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const {
        empleado_id,
        sucursal_id,
        veterinaria_id,
        usuario_username,
        usuario_password,
        usuario_tipo,
        usuario_estado,
        ultimo_login
    } = req.body;

    const usuario_foto = req.file ? req.file.buffer : null;

    try {
        // Verificar si otro usuario tiene el mismo username
        const [existing] = await db.query(
            'SELECT usuario_id FROM Usuario WHERE usuario_username = ? AND usuario_id != ?',
            [usuario_username, id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso por otro usuario' });
        }

        const passwordToUpdate = usuario_password
            ? await bcrypt.hash(usuario_password, 10)
            : null;

        const [result] = await db.query(
            `UPDATE Usuario 
             SET empleado_id = ?, sucursal_id = ?, veterinaria_id = ?, usuario_username = ?, 
                 usuario_password = IFNULL(?, usuario_password), usuario_tipo = ?, 
                 usuario_estado = ?, usuario_foto = ?, ultimo_login = ? 
             WHERE usuario_id = ?`,
            [
                empleado_id || null,
                sucursal_id || null,
                veterinaria_id || null,
                usuario_username,
                passwordToUpdate,
                usuario_tipo,
                usuario_estado || 'activo',
                usuario_foto,
                ultimo_login || null,
                id
            ]
        );
        res.json({ message: 'Usuario actualizado' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};


// Eliminar usuario
const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Usuario WHERE usuario_id = ?', [id]);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

// Obtener usuarios por sucursal
const getUsuariosPorSucursal = async (req, res) => {
    const { sucursalId } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Usuario WHERE sucursal_id = ?', [sucursalId]);
        const usuarios = rows.map(usuario => ({
            ...usuario,
            usuario_foto: usuario.usuario_foto
                ? `data:image/jpeg;base64,${usuario.usuario_foto.toString('base64')}`
                : null
        }));
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios por sucursal:', error);
        res.status(500).json({ error: 'Error al obtener usuarios por sucursal' });
    }
};

// Exportar
module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuariosPorSucursal
};

  

