const db = require('../database');

// Crear detalle de atención
exports.createDetalleAtencion = async (req, res) => {
  try {
    const data = req.body;
    const [result] = await db.execute(
      `INSERT INTO DetalleAtencion (
        atencion_id, nombreVeterinario, tarjetaProfesionalVeterinario, edadActualMascota, alimento,
        actividadFisicaMascota, comidasDia, esterilizado, cruce, carnetVacunas, fechaUltimaVacuna,
        fechaProximaVacuna, proximaVacunaMascota, ultimaDesparasitacionInterna, productoDesparasitacionInternaMascota,
        proximaDesparasitacionInterna, ultimaDesparasitacionExterna, productoDesparasitacionExterna,
        proximaDesparasitacionExterna, peso, temperatura, colorOrina, deposiciones, estadoNutricional,
        estadoPiel, heridas, erosiones, costras, comportamientoEstacion, comportamientoMarcha,
        tonalidadMucosa, tonalidadOrejas, gangliosLinfaticos, vision, frecuenciaRespiratoria,
        hidratacion, cavidadNasal, ollares, flujoNasal, ruidoNasal, personalidad, hallazgos,
        recomendaciones, archivoAdjunto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.atencion_id, data.nombreVeterinario, data.tarjetaProfesionalVeterinario, data.edadActualMascota, data.alimento,
        data.actividadFisicaMascota, data.comidasDia, data.esterilizado, data.cruce, data.carnetVacunas, data.fechaUltimaVacuna,
        data.fechaProximaVacuna, data.proximaVacunaMascota, data.ultimaDesparasitacionInterna, data.productoDesparasitacionInternaMascota,
        data.proximaDesparasitacionInterna, data.ultimaDesparasitacionExterna, data.productoDesparasitacionExterna,
        data.proximaDesparasitacionExterna, data.peso, data.temperatura, data.colorOrina, data.deposiciones, data.estadoNutricional,
        data.estadoPiel, data.heridas, data.erosiones, data.costras, data.comportamientoEstacion, data.comportamientoMarcha,
        data.tonalidadMucosa, data.tonalidadOrejas, data.gangliosLinfaticos, data.vision, data.frecuenciaRespiratoria,
        data.hidratacion, data.cavidadNasal, data.ollares, data.flujoNasal, data.ruidoNasal, data.personalidad, data.hallazgos,
        data.recomendaciones, req.file ? req.file.buffer : null
      ]
    );
    res.status(201).json({ message: 'Detalle de atención creado', id: result.insertId });
  } catch (error) {
    console.error('Error al crear detalle de atención:', error);
    res.status(500).json({ message: 'Error al crear detalle de atención' });
  }
};

// Obtener todos
exports.getAllDetalleAtencion = async (req, res) => {
  try {
    const [result] = await db.execute('SELECT * FROM DetalleAtencion');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener detalles de atención:', error);
    res.status(500).json({ message: 'Error al obtener los registros' });
  }
};

// Obtener por ID
exports.getDetalleAtencionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM DetalleAtencion WHERE detalleAtencion_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el detalle:', error);
    res.status(500).json({ message: 'Error al buscar el registro' });
  }
};

// Actualizar
exports.updateDetalleAtencion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const [result] = await db.execute(
      `UPDATE DetalleAtencion SET
        nombreVeterinario=?, tarjetaProfesionalVeterinario=?, edadActualMascota=?, alimento=?,
        actividadFisicaMascota=?, comidasDia=?, esterilizado=?, cruce=?, carnetVacunas=?, fechaUltimaVacuna=?,
        fechaProximaVacuna=?, proximaVacunaMascota=?, ultimaDesparasitacionInterna=?, productoDesparasitacionInternaMascota=?,
        proximaDesparasitacionInterna=?, ultimaDesparasitacionExterna=?, productoDesparasitacionExterna=?,
        proximaDesparasitacionExterna=?, peso=?, temperatura=?, colorOrina=?, deposiciones=?, estadoNutricional=?,
        estadoPiel=?, heridas=?, erosiones=?, costras=?, comportamientoEstacion=?, comportamientoMarcha=?,
        tonalidadMucosa=?, tonalidadOrejas=?, gangliosLinfaticos=?, vision=?, frecuenciaRespiratoria=?,
        hidratacion=?, cavidadNasal=?, ollares=?, flujoNasal=?, ruidoNasal=?, personalidad=?, hallazgos=?,
        recomendaciones=?, archivoAdjunto=? WHERE detalleAtencion_id = ?`,
      [
        data.nombreVeterinario, data.tarjetaProfesionalVeterinario, data.edadActualMascota, data.alimento,
        data.actividadFisicaMascota, data.comidasDia, data.esterilizado, data.cruce, data.carnetVacunas, data.fechaUltimaVacuna,
        data.fechaProximaVacuna, data.proximaVacunaMascota, data.ultimaDesparasitacionInterna, data.productoDesparasitacionInternaMascota,
        data.proximaDesparasitacionInterna, data.ultimaDesparasitacionExterna, data.productoDesparasitacionExterna,
        data.proximaDesparasitacionExterna, data.peso, data.temperatura, data.colorOrina, data.deposiciones, data.estadoNutricional,
        data.estadoPiel, data.heridas, data.erosiones, data.costras, data.comportamientoEstacion, data.comportamientoMarcha,
        data.tonalidadMucosa, data.tonalidadOrejas, data.gangliosLinfaticos, data.vision, data.frecuenciaRespiratoria,
        data.hidratacion, data.cavidadNasal, data.ollares, data.flujoNasal, data.ruidoNasal, data.personalidad, data.hallazgos,
        data.recomendaciones, req.file ? req.file.buffer : null,
        id
      ]
    );
    res.json({ message: 'Detalle actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar detalle:', error);
    res.status(500).json({ message: 'Error en la actualización' });
  }
};

// Eliminar
exports.deleteDetalleAtencion = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM DetalleAtencion WHERE detalleAtencion_id = ?', [id]);
    res.json({ message: 'Detalle eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ message: 'Error al eliminar' });
  }
};
