const db = require('../database');

// Obtener empleados por sucursal (con imagen en base64)
exports.getEmpleadosPorSucursal = async (req, res) => {
  const { sucursalId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Empleado WHERE sucursal_id = ?', [sucursalId]);

    const empleados = rows.map(emp => ({
      ...emp,
      empleado_foto: emp.empleado_foto
        ? `data:image/jpeg;base64,${emp.empleado_foto.toString('base64')}`
        : null
    }));

    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

// Obtener un empleado por ID
exports.getEmpleadoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Empleado WHERE empleado_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const empleado = rows[0];
    if (empleado.empleado_foto) {
      empleado.empleado_foto = `data:image/jpeg;base64,${empleado.empleado_foto.toString('base64')}`;
    }

    res.json(empleado);
  } catch (error) {
    console.error('Error al obtener el empleado:', error);
    res.status(500).json({ error: 'Error al obtener el empleado' });
  }
};

// Crear empleado
exports.createEmpleado = async (req, res) => {
  const {
    sucursal_id,
    empleado_nombre,
    empleado_apellido,
    empleado_cedula,
    empleado_rol,
    empleado_direccion,
    empleado_telefono,
    empleado_email,
    empleado_fecha_nac,
    empleado_genero,
    empleado_detalles,
    empleado_estado,
    fecha_contratacion,
    fecha_terminacion
  } = req.body;

  const empleado_foto = req.file ? req.file.buffer : null;

  try {
    const [result] = await db.query(
      `INSERT INTO Empleado (
        sucursal_id, empleado_nombre, empleado_apellido, empleado_cedula,
        empleado_rol, empleado_direccion, empleado_telefono, empleado_email,
        empleado_fecha_nac, empleado_genero, empleado_detalles, empleado_foto,
        empleado_estado, fecha_contratacion, fecha_terminacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sucursal_id,
        empleado_nombre,
        empleado_apellido,
        empleado_cedula,
        empleado_rol,
        empleado_direccion,
        empleado_telefono,
        empleado_email || null,
        empleado_fecha_nac || null,
        empleado_genero || null,
        empleado_detalles || null,
        empleado_foto,
        empleado_estado || 'activo',
        fecha_contratacion,
        fecha_terminacion || null
      ]
    );

    res.status(201).json({ message: 'Empleado creado', empleado_id: result.insertId });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ error: 'Error al crear empleado' });
  }
};

// Actualizar empleado
exports.updateEmpleado = async (req, res) => {
  const { id } = req.params;
  const {
    sucursal_id,
    empleado_nombre,
    empleado_apellido,
    empleado_cedula,
    empleado_rol,
    empleado_direccion,
    empleado_telefono,
    empleado_email,
    empleado_fecha_nac,
    empleado_genero,
    empleado_detalles,
    empleado_estado,
    fecha_contratacion,
    fecha_terminacion
  } = req.body;

  const empleado_foto = req.file ? req.file.buffer : null;

  try {
    const [result] = await db.query(
      `UPDATE Empleado SET
        sucursal_id = ?, empleado_nombre = ?, empleado_apellido = ?, empleado_cedula = ?,
        empleado_rol = ?, empleado_direccion = ?, empleado_telefono = ?, empleado_email = ?,
        empleado_fecha_nac = ?, empleado_genero = ?, empleado_detalles = ?, empleado_foto = ?,
        empleado_estado = ?, fecha_contratacion = ?, fecha_terminacion = ?
      WHERE empleado_id = ?`,
      [
        sucursal_id,
        empleado_nombre,
        empleado_apellido,
        empleado_cedula,
        empleado_rol,
        empleado_direccion,
        empleado_telefono,
        empleado_email || null,
        empleado_fecha_nac || null,
        empleado_genero || null,
        empleado_detalles || null,
        empleado_foto,
        empleado_estado || 'activo',
        fecha_contratacion,
        fecha_terminacion || null,
        id
      ]
    );

    res.json({ message: 'Empleado actualizado' });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
};

// Eliminar empleado
exports.deleteEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Empleado WHERE empleado_id = ?', [id]);
    res.json({ message: 'Empleado eliminado' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
};

// Obtener empleados sin usuario por sucursal
exports.getEmpleadosSinUsuarioPorSucursal = async (req, res) => {
  const { sucursalId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT e.empleado_id, e.empleado_nombre, e.empleado_apellido, e.empleado_cedula
      FROM Empleado e
      LEFT JOIN Usuario u ON e.empleado_id = u.empleado_id
      WHERE u.usuario_id IS NULL AND e.sucursal_id = ?
    `, [sucursalId]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener empleados sin usuario:', error);
    res.status(500).json({ error: 'Error al obtener empleados sin usuario' });
  }
};



