const db = require('../database');
const pool = require('../database');


// Crear nuevo cliente
exports.createCliente = async (req, res) => {
    try {
        const {
            sucursal_id,
            cliente_cedula,
            cliente_nombre,
            cliente_apellido,
            cliente_direccion,
            cliente_telefono,
            cliente_email,
            cliente_detalles,
            cliente_estado
        } = req.body;

        // Verificar si ya existe la combinación sucursal_id + cliente_cedula
        const [existente] = await db.query(
            'SELECT * FROM Cliente WHERE sucursal_id = ? AND cliente_cedula = ?',
            [sucursal_id, cliente_cedula]
        );

        if (existente.length > 0) {
            return res.status(409).json({ message: 'Ya existe un cliente con esa cédula en la misma sucursal.' });
        }

        const [resultado] = await db.query(`
            INSERT INTO Cliente (
                sucursal_id, cliente_cedula, cliente_nombre, cliente_apellido,
                cliente_direccion, cliente_telefono, cliente_email,
                cliente_detalles, cliente_estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            sucursal_id, cliente_cedula, cliente_nombre, cliente_apellido,
            cliente_direccion, cliente_telefono, cliente_email,
            cliente_detalles, cliente_estado || 'activo'
        ]);

        res.status(201).json({ message: 'Cliente creado', cliente_id: resultado.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear cliente' });
    }
};

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
    try {
        const [clientes] = await db.query('SELECT * FROM Cliente');
        res.json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
};

// Obtener cliente por ID
exports.getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const [cliente] = await db.query('SELECT * FROM Cliente WHERE cliente_id = ?', [id]);

        if (cliente.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json(cliente[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el cliente' });
    }
};

// Actualizar cliente
exports.updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            sucursal_id,
            cliente_cedula,
            cliente_nombre,
            cliente_apellido,
            cliente_direccion,
            cliente_telefono,
            cliente_email,
            cliente_detalles,
            cliente_estado
        } = req.body;

        // Verificar si ya existe otro cliente con la misma sucursal_id + cliente_cedula
        const [existente] = await db.query(
            'SELECT * FROM Cliente WHERE sucursal_id = ? AND cliente_cedula = ? AND cliente_id != ?',
            [sucursal_id, cliente_cedula, id]
        );

        if (existente.length > 0) {
            return res.status(409).json({ message: 'Ya existe otro cliente con esa cédula en la misma sucursal.' });
        }

        await db.query(`
            UPDATE Cliente SET
                sucursal_id = ?, cliente_cedula = ?, cliente_nombre = ?, cliente_apellido = ?,
                cliente_direccion = ?, cliente_telefono = ?, cliente_email = ?,
                cliente_detalles = ?, cliente_estado = ?
            WHERE cliente_id = ?
        `, [
            sucursal_id, cliente_cedula, cliente_nombre, cliente_apellido,
            cliente_direccion, cliente_telefono, cliente_email,
            cliente_detalles, cliente_estado, id
        ]);

        res.json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
};

// Eliminar cliente
exports.deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM Cliente WHERE cliente_id = ?', [id]);
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
};

// Obtener clientes por sucursal
exports.getClientesBySucursal = async (req, res) => {
    const { sucursal_id } = req.params;
  
    try {
      const [rows] = await pool.query(
        'SELECT * FROM Cliente WHERE sucursal_id = ?',
        [sucursal_id]
      );
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener clientes por sucursal:", error);
      res.status(500).json({ message: 'Error al obtener los clientes', error });
    }
  };
  
  
