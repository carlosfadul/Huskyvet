const db = require('../database');

// GET /api/servicios
exports.getServicios = async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Servicio ORDER BY servicio_id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ message: 'Error al obtener servicios' });
  }
};

// GET /api/servicios/:id
exports.getServicioById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Servicio WHERE servicio_id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({ message: 'Error al obtener servicio' });
  }
};

// POST /api/servicios
exports.createServicio = async (req, res) => {
  const data = req.body;

  try {
    const [result] = await db.query('INSERT INTO Servicio SET ?', [data]);
    res.status(201).json({ message: 'Servicio creado', id: result.insertId });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ message: 'Error al crear servicio' });
  }
};

// PUT /api/servicios/:id
exports.updateServicio = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const [result] = await db.query('UPDATE Servicio SET ? WHERE servicio_id = ?', [data, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.json({ message: 'Servicio actualizado' });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ message: 'Error al actualizar servicio' });
  }
};

// DELETE /api/servicios/:id
exports.deleteServicio = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM Servicio WHERE servicio_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.json({ message: 'Servicio eliminado' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ message: 'Error al eliminar servicio' });
  }
};
