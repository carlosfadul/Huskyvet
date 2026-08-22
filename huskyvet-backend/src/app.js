// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// ====== Cargar DB ======
let db;
try {
  db = require('../database');
} catch (e1) {
  try {
    db = require('./database');
  } catch (e2) {
    console.error('[DB] No se pudo cargar database.js');
    throw e2;
  }
}

// ====== Swagger ======
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
let swaggerSpec = {};
try {
  swaggerSpec = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
} catch {
  console.warn('[Swagger] No se encontró swagger.yaml');
}

// ====== Importación de rutas ======
const vacunaRoutes = require('./routes/vacuna.routes');
const veterinariaRoutes = require('./routes/veterinaria.routes');
const sucursalRoutes = require('./routes/sucursal.routes');
const proveedorRoutes = require('./routes/proveedor.routes');
const servicioRoutes = require('./routes/servicio.routes');
const enfermedadRoutes = require('./routes/enfermedad.routes');
const tratamientoRoutes = require('./routes/tratamiento.routes');
const aliadoRoutes = require('./routes/aliado.routes');
const clienteRoutes = require('./routes/cliente.routes');
const mascotaRoutes = require('./routes/mascota.routes');
const productoRoutes = require('./routes/producto.routes');
const mascotaEnfermedadRoutes = require('./routes/mascotaEnfermedad.routes');
const desparasitanteRoutes = require('./routes/desparasitante.routes');
const aplicacionDesparasitanteRoutes = require('./routes/aplicacionDesparasitante.routes');
const servicioAliadoRoutes = require('./routes/servicioAliado.routes');
const empleadoRoutes = require('./routes/empleado.routes');
const nominaRoutes = require('./routes/nomina.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const citaRoutes = require('./routes/cita.routes');
const configuracionRoutes = require('./routes/configuracion.routes');
const auditoriaRoutes = require('./routes/auditoria.routes');
const movimientoInventarioRoutes = require('./routes/movimientoInventario.routes');
const facturaRoutes = require('./routes/factura.routes');
const facturaDetalleRoutes = require('./routes/facturaDetalle.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const detallePedidoRoutes = require('./routes/detallePedido.routes');
const ventaRoutes = require('./routes/venta.routes');
const detalleVentaRoutes = require('./routes/detalleVenta.routes');

// 🔥 Rutas correctamente configuradas para atención
const atencionRoutes = require('./routes/atencion.routes'); // <--- ESTA ES LA CORRECTA

const detalleAtencionRoutes = require('./routes/detalleAtencion.routes');
const mascotaTratamientoRoutes = require('./routes/mascotaTratamiento.routes');
const aplicacionVacunaRoutes = require('./routes/aplicacionVacuna.routes');
const remisionRoutes = require('./routes/remision.routes');
const detalleRemisionRoutes = require('./routes/detalleRemision.routes');
const detalleNominaRoutes = require('./routes/detalleNomina.routes');
const authRoutes = require('./routes/auth.routes');

const detalleNominaController = require('./controllers/detalleNomina.controller');
const { idParam } = require('./validators/detalleNomina.validators');

const app = express();

// ====== Middlewares ======
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Estáticos
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const API = '/api';

// ====== Swagger ======
if (swaggerSpec && Object.keys(swaggerSpec).length) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
  app.get('/api/docs', (_req, res) =>
    res.send('Swagger no configurado.')
  );
}

// ====== Rutas ======

// Configuración general
app.use(`${API}/veterinarias`, veterinariaRoutes);
app.use(`${API}/sucursales`, sucursalRoutes);
app.use(`${API}/configuracion`, configuracionRoutes);
app.use(`${API}/usuarios`, usuarioRoutes);
app.use(`${API}/empleados`, empleadoRoutes);
app.use(`${API}/auditoria`, auditoriaRoutes);

// Clínica
app.use(`${API}/clientes`, clienteRoutes);
app.use(`${API}/mascotas`, mascotaRoutes);

// 🔥 ESTA ES LA RUTA CORRECTA PARA QUE FUNCIONE EL ARCHIVO ADJUNTO
app.use(`${API}/atencion`, atencionRoutes);  // <--- IMPORTANTE

// ❌ ESTA RUTA NO DEBE EXISTIR
// app.use(`${API}/atenciones`, atencionRoutes);   // <--- ELIMINADA

app.use(`${API}/detalle-atencion`, detalleAtencionRoutes);
app.use(`${API}/enfermedades`, enfermedadRoutes);
app.use(`${API}/mascota-enfermedad`, mascotaEnfermedadRoutes);
app.use(`${API}/tratamientos`, tratamientoRoutes);
app.use(`${API}/mascota-tratamiento`, mascotaTratamientoRoutes);
app.use(`${API}/vacunas`, vacunaRoutes);
app.use(`${API}/aplicacion-vacuna`, aplicacionVacunaRoutes);
app.use(`${API}/desparasitantes`, desparasitanteRoutes);
app.use(`${API}/aplicacion-desparasitante`, aplicacionDesparasitanteRoutes);
app.use(`${API}/citas`, citaRoutes);
app.use(`${API}/remisiones`, remisionRoutes);
app.use(`${API}/detalle-remision`, detalleRemisionRoutes);
app.use(`${API}/servicio-aliado`, servicioAliadoRoutes);
app.use(`${API}/servicios`, servicioRoutes);
app.use(`${API}/aliados`, aliadoRoutes);

// Comercial
app.use(`${API}/proveedores`, proveedorRoutes);
app.use(`${API}/productos`, productoRoutes);
app.use(`${API}/movimiento-inventario`, movimientoInventarioRoutes);
app.use(`${API}/pedidos`, pedidoRoutes);
app.use(`${API}/detalle-pedido`, detallePedidoRoutes);
app.use(`${API}/ventas`, ventaRoutes);
app.use(`${API}/detalle-venta`, detalleVentaRoutes);
app.use(`${API}/facturas`, facturaRoutes);
app.use(`${API}/factura-detalle`, facturaDetalleRoutes);

// Nómina
app.use(`${API}/nomina`, nominaRoutes);
app.use(`${API}/detalle-nomina`, detalleNominaRoutes);

// Ruta espejo
app.get(
  `${API}/nominas/:nominaId/detalles`,
  idParam('nominaId'),
  detalleNominaController.listByNomina
);

// Auth
app.use(`${API}/auth`, authRoutes);

// Healthcheck
app.get(`${API}/health`, (_req, res) => {
  res.json({ status: 'ok', service: 'huskyvet-backend', time: new Date().toISOString() });
});

// Raíz
app.get('/', (_req, res) => {
  res.send('API funcionando 🚀');
});

// 404
app.use((req, res, next) => {
  const err = new Error(`No encontrado: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

// Manejo global errores
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(err.details ? { errors: err.details } : {}),
  });
});

module.exports = app;
