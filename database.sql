-- ============================================================
--  Huskyvet - Script de base de datos MySQL
--  Ejecutar: mysql -u root -p < database.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS huskyvet
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE huskyvet;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
--  TABLAS PRINCIPALES
-- ============================================================

CREATE TABLE Veterinaria (
    veterinaria_id INT PRIMARY KEY AUTO_INCREMENT,
    veterinaria_nombre VARCHAR(50) NOT NULL,
    veterinaria_nit VARCHAR(20) UNIQUE,
    veterinaria_direccion VARCHAR(100),
    veterinaria_telefono VARCHAR(15),
    veterinaria_estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    veterinaria_logo LONGBLOB,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Sucursal (
    sucursal_id INT PRIMARY KEY AUTO_INCREMENT,
    veterinaria_id INT NOT NULL,
    sucursal_nombre VARCHAR(50) NOT NULL,
    sucursal_direccion VARCHAR(100),
    sucursal_telefono VARCHAR(15),
    sucursal_nit VARCHAR(20) UNIQUE,
    sucursal_logo LONGBLOB,
    sucursal_estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    FOREIGN KEY (veterinaria_id) REFERENCES Veterinaria(veterinaria_id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Cliente (
    cliente_id INT PRIMARY KEY AUTO_INCREMENT,
    sucursal_id INT NOT NULL,
    cliente_cedula VARCHAR(20) NOT NULL,
    cliente_nombre VARCHAR(50) NOT NULL,
    cliente_apellido VARCHAR(50) NOT NULL,
    cliente_direccion VARCHAR(100),
    cliente_telefono VARCHAR(15) NOT NULL,
    cliente_email VARCHAR(100),
    cliente_detalles TEXT,
    cliente_estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (sucursal_id, cliente_cedula)
);

CREATE TABLE Mascota (
    mascota_id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    mascota_nombre VARCHAR(50) NOT NULL,
    mascota_especie ENUM('canino', 'felino', 'ave', 'roedor', 'reptil', 'otro') NOT NULL,
    mascota_raza VARCHAR(50),
    mascota_sexo ENUM('macho', 'hembra', 'desconocido'),
    mascota_fecha_nac DATE,
    mascota_color VARCHAR(50),
    mascota_peso DECIMAL(5,2),
    mascota_foto LONGBLOB,
    mascota_estado ENUM('vivo', 'fallecido', 'perdido', 'dado en adopción') DEFAULT 'vivo',
    FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Proveedor (
    proveedor_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_proveedor VARCHAR(100) NOT NULL,
    direccion_proveedor VARCHAR(100) NOT NULL,
    telefono_proveedor VARCHAR(15) NOT NULL,
    email_proveedor VARCHAR(100),
    nit_proveedor VARCHAR(20) NOT NULL UNIQUE,
    detalles_proveedor TEXT,
    proveedor_estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Producto (
    producto_id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    categoria_producto ENUM('medicamento', 'alimento', 'accesorio', 'higiene', 'otro') NOT NULL,
    nombre_producto VARCHAR(100) NOT NULL,
    codigoBarras_producto VARCHAR(30) UNIQUE,
    cantidad_producto INT UNSIGNED DEFAULT 0,
    unidades_producto VARCHAR(20) NOT NULL,
    precioCompra_producto DECIMAL(10, 2) NOT NULL,
    precioVenta_producto DECIMAL(10, 2) NOT NULL,
    margen_ganancia DECIMAL(5,2) GENERATED ALWAYS AS ((precioVenta_producto - precioCompra_producto) / precioCompra_producto * 100) STORED,
    marca_producto VARCHAR(50) NOT NULL,
    descripcion_producto TEXT,
    foto_producto LONGBLOB,
    producto_estado ENUM('activo', 'inactivo', 'agotado') DEFAULT 'activo',
    FOREIGN KEY (proveedor_id) REFERENCES Proveedor(proveedor_id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATE,
    CHECK (precioVenta_producto > precioCompra_producto)
);

CREATE TABLE Empleado (
    empleado_id INT PRIMARY KEY AUTO_INCREMENT,
    sucursal_id INT NOT NULL,
    empleado_nombre VARCHAR(50) NOT NULL,
    empleado_apellido VARCHAR(50) NOT NULL,
    empleado_cedula VARCHAR(20) NOT NULL UNIQUE,
    empleado_rol ENUM('veterinario', 'asistente', 'recepcionista', 'administrador', 'limpieza', 'otro') NOT NULL,
    empleado_direccion VARCHAR(100) NOT NULL,
    empleado_telefono VARCHAR(15) NOT NULL,
    empleado_email VARCHAR(100),
    empleado_fecha_nac DATE,
    empleado_genero ENUM('masculino', 'femenino', 'otro'),
    empleado_detalles TEXT,
    empleado_foto LONGBLOB,
    empleado_estado ENUM('activo', 'inactivo', 'vacaciones', 'licencia') DEFAULT 'activo',
    fecha_contratacion DATE NOT NULL,
    fecha_terminacion DATE,
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE
);

CREATE TABLE Usuario (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT UNIQUE,
    sucursal_id INT,
    veterinaria_id INT,
    usuario_username VARCHAR(30) NOT NULL UNIQUE,
    usuario_password VARCHAR(255) NOT NULL,
    usuario_tipo ENUM('superadmin', 'admin', 'veterinario', 'asistente', 'recepcionista', 'inventario') NOT NULL,
    usuario_estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    usuario_foto LONGBLOB,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME,
    FOREIGN KEY (empleado_id) REFERENCES Empleado(empleado_id) ON DELETE CASCADE,
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE,
    FOREIGN KEY (veterinaria_id) REFERENCES Veterinaria(veterinaria_id) ON DELETE CASCADE
);

CREATE TABLE Servicio (
    servicio_id INT PRIMARY KEY AUTO_INCREMENT,
    servicio_nombre VARCHAR(100) NOT NULL,
    servicio_tipo ENUM('consulta', 'cirugía', 'laboratorio', 'estética', 'vacunación', 'hospitalización', 'otro') NOT NULL,
    servicio_detalle TEXT,
    servicio_precio DECIMAL(10, 2) NOT NULL,
    servicio_duracion INT COMMENT 'Duración estimada en minutos',
    servicio_estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Venta (
    venta_id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    sucursal_id INT NOT NULL,
    usuario_id INT,
    venta_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    venta_estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'pendiente',
    venta_detalles TEXT,
    subtotal DECIMAL(10, 2),
    impuestos DECIMAL(10, 2),
    descuentos DECIMAL(10, 2),
    total DECIMAL(10, 2),
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'otro'),
    FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id) ON DELETE CASCADE,
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL
);

CREATE TABLE DetalleVenta (
    detalleVenta_id INT PRIMARY KEY AUTO_INCREMENT,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    detalleVenta_cantidad INT NOT NULL CHECK (detalleVenta_cantidad > 0),
    detalleVenta_precio DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0,
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (detalleVenta_cantidad * detalleVenta_precio * (1 - descuento/100)) STORED,
    FOREIGN KEY (venta_id) REFERENCES Venta(venta_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES Producto(producto_id) ON DELETE CASCADE
);

CREATE TABLE Atencion (
    atencion_id INT PRIMARY KEY AUTO_INCREMENT,
    mascota_id INT NOT NULL,
    servicio_id INT NOT NULL,
    usuario_id INT COMMENT 'Veterinario que atendió',
    atencion_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atencion_cantidad INT NOT NULL DEFAULT 1,
    atencion_precio DECIMAL(10, 2) NOT NULL,
    atencion_detalle TEXT,
    atencion_archivoAdjunto LONGBLOB,
    atencion_estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'pendiente',
    diagnostico TEXT,
    tratamiento TEXT,
    observaciones TEXT,
    FOREIGN KEY (mascota_id) REFERENCES Mascota(mascota_id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES Servicio(servicio_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL
);

CREATE TABLE Enfermedad (
    enfermedad_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_enfermedad VARCHAR(100) NOT NULL,
    descripcion_enfermedad TEXT,
    categoria ENUM('infecciosa', 'parasitaria', 'metabólica', 'congénita', 'traumática', 'neoplásica', 'otra'),
    especie_afectada SET('canino', 'felino', 'ave', 'roedor', 'reptil', 'otro'),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Tratamiento (
    tratamiento_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tratamiento VARCHAR(100) NOT NULL,
    descripcion_tratamiento TEXT,
    tipo_tratamiento ENUM('medicamento', 'terapia', 'cirugía', 'dieta', 'otro'),
    duracion_recomendada VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DetalleAtencion (
    detalleAtencion_id INT PRIMARY KEY AUTO_INCREMENT,
    atencion_id INT NOT NULL,
    nombreVeterinario VARCHAR(100) NOT NULL,
    tarjetaProfesionalVeterinario VARCHAR(20),
    edadActualMascota VARCHAR(20),
    alimento VARCHAR(100),
    actividadFisicaMascota VARCHAR(100),
    comidasDia VARCHAR(20),
    esterilizado ENUM('si', 'no', 'desconocido'),
    cruce ENUM('si', 'no', 'desconocido'),
    carnetVacunas ENUM('si', 'no', 'parcial'),
    fechaUltimaVacuna DATE,
    fechaProximaVacuna DATE,
    proximaVacunaMascota VARCHAR(100),
    ultimaDesparasitacionInterna DATE,
    productoDesparasitacionInternaMascota VARCHAR(100),
    proximaDesparasitacionInterna DATE,
    ultimaDesparasitacionExterna DATE,
    productoDesparasitacionExterna VARCHAR(100),
    proximaDesparasitacionExterna DATE,
    peso DECIMAL(5,2) COMMENT 'En kg',
    temperatura DECIMAL(3,1) COMMENT 'En °C',
    colorOrina VARCHAR(20),
    deposiciones VARCHAR(100),
    estadoNutricional ENUM('obeso', 'sobrepeso', 'ideal', 'bajo peso', 'caquéctico'),
    estadoPiel TEXT,
    heridas TEXT,
    erosiones TEXT,
    costras TEXT,
    comportamientoEstacion TEXT,
    comportamientoMarcha TEXT,
    tonalidadMucosa VARCHAR(20),
    tonalidadOrejas VARCHAR(20),
    gangliosLinfaticos TEXT,
    vision TEXT,
    frecuenciaRespiratoria VARCHAR(20),
    hidratacion VARCHAR(20),
    cavidadNasal TEXT,
    ollares TEXT,
    flujoNasal TEXT,
    ruidoNasal TEXT,
    personalidad TEXT,
    hallazgos TEXT,
    recomendaciones TEXT,
    archivoAdjunto LONGBLOB,
    FOREIGN KEY (atencion_id) REFERENCES Atencion(atencion_id) ON DELETE CASCADE
);

CREATE TABLE MascotaEnfermedad (
    mascota_id INT NOT NULL,
    enfermedad_id INT NOT NULL,
    fecha_diagnostico DATE NOT NULL,
    fecha_cura DATE,
    estado ENUM('activa', 'en tratamiento', 'curada', 'cronica') DEFAULT 'activa',
    observaciones TEXT,
    PRIMARY KEY (mascota_id, enfermedad_id, fecha_diagnostico),
    FOREIGN KEY (mascota_id) REFERENCES Mascota(mascota_id) ON DELETE CASCADE,
    FOREIGN KEY (enfermedad_id) REFERENCES Enfermedad(enfermedad_id) ON DELETE CASCADE
);

CREATE TABLE MascotaTratamiento (
    mascota_tratamiento_id INT PRIMARY KEY AUTO_INCREMENT,
    mascota_id INT NOT NULL,
    tratamiento_id INT NOT NULL,
    atencion_id INT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    dosis VARCHAR(100),
    frecuencia VARCHAR(100),
    via_administracion VARCHAR(50),
    observaciones TEXT,
    estado ENUM('pendiente', 'en curso', 'completado', 'suspendido') DEFAULT 'pendiente',
    FOREIGN KEY (mascota_id) REFERENCES Mascota(mascota_id) ON DELETE CASCADE,
    FOREIGN KEY (tratamiento_id) REFERENCES Tratamiento(tratamiento_id) ON DELETE CASCADE,
    FOREIGN KEY (atencion_id) REFERENCES Atencion(atencion_id) ON DELETE SET NULL
);

CREATE TABLE Vacuna (
    vacuna_id INT PRIMARY KEY AUTO_INCREMENT,
    vacuna_nombre VARCHAR(100) NOT NULL,
    vacuna_laboratorio VARCHAR(100) NOT NULL,
    vacuna_detalles TEXT,
    especie_destinada SET('canino', 'felino', 'ave', 'roedor', 'reptil', 'otro'),
    edad_minima_semanas INT,
    frecuencia_meses INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AplicacionVacuna (
    aplicacionVacuna_id INT PRIMARY KEY AUTO_INCREMENT,
    mascota_id INT NOT NULL,
    vacuna_id INT NOT NULL,
    usuario_id INT COMMENT 'Veterinario que aplicó',
    aplicacionVacuna_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    proximaVacuna_fecha DATE NOT NULL,
    proximaVacuna_nombre VARCHAR(100),
    proximaVacuna_detalle TEXT,
    aplicacionVacuna_estado ENUM('pendiente', 'aplicada', 'rechazada') DEFAULT 'pendiente',
    lote_vacuna VARCHAR(50),
    observaciones TEXT,
    FOREIGN KEY (mascota_id) REFERENCES Mascota(mascota_id) ON DELETE CASCADE,
    FOREIGN KEY (vacuna_id) REFERENCES Vacuna(vacuna_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL
);

CREATE TABLE Desparasitante (
    desparasitante_id INT PRIMARY KEY AUTO_INCREMENT,
    desparasitante_nombre VARCHAR(100) NOT NULL,
    desparasitante_laboratorio VARCHAR(100) NOT NULL,
    desparasitante_detalles TEXT,
    tipo ENUM('interno', 'externo', 'combinado'),
    especie_destinada SET('canino', 'felino', 'ave', 'roedor', 'reptil', 'otro'),
    edad_minima_semanas INT,
    peso_minimo DECIMAL(5,2),
    peso_maximo DECIMAL(5,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AplicacionDesparasitante (
    aplicacionDesparasitante_id INT PRIMARY KEY AUTO_INCREMENT,
    mascota_id INT NOT NULL,
    desparasitante_id INT NOT NULL,
    usuario_id INT COMMENT 'Quien aplicó',
    aplicacionDesparasitante_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    proximoDesparasitante_fecha DATE NOT NULL,
    proximoDesparasitante_nombre VARCHAR(100),
    proximoDesparasitante_detalle TEXT,
    aplicacionDesparasitante_estado ENUM('pendiente', 'aplicada', 'rechazada') DEFAULT 'pendiente',
    dosis VARCHAR(50),
    observaciones TEXT,
    FOREIGN KEY (mascota_id) REFERENCES Mascota(mascota_id) ON DELETE CASCADE,
    FOREIGN KEY (desparasitante_id) REFERENCES Desparasitante(desparasitante_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL
);

CREATE TABLE Aliado (
    aliado_id INT PRIMARY KEY AUTO_INCREMENT,
    sucursal_id INT NOT NULL,
    nombre_aliado VARCHAR(100) NOT NULL,
    direccion_aliado VARCHAR(100) NOT NULL,
    telefono_aliado VARCHAR(15) NOT NULL,
    email_aliado VARCHAR(100),
    nit_aliado VARCHAR(20) NOT NULL UNIQUE,
    aliado_detalles TEXT,
    aliado_estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE
);

CREATE TABLE ServicioAliado (
    servicioAliado_id INT PRIMARY KEY AUTO_INCREMENT,
    aliado_id INT NOT NULL,
    nombre_servicioAliado VARCHAR(100) NOT NULL,
    detalle_servicioAliado TEXT,
    precio_servicio DECIMAL(10, 2),
    servicio_estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    FOREIGN KEY (aliado_id) REFERENCES Aliado(aliado_id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Remision (
    remision_id INT PRIMARY KEY AUTO_INCREMENT,
    sucursal_id INT NOT NULL,
    aliado_id INT NOT NULL,
    mascota_id INT NOT NULL,
    usuario_id INT COMMENT 'Quien remite',
    remision_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remision_estado ENUM('pendiente', 'aceptada', 'rechazada', 'completada') DEFAULT 'pendiente',
    remision_diagnostico TEXT,
    remision_observaciones TEXT,
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE,
    FOREIGN KEY (aliado_id) REFERENCES Aliado(aliado_id) ON DELETE CASCADE,
    FOREIGN KEY (mascota_id) REFERENCES Mascota(mascota_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL
);

CREATE TABLE DetalleRemision (
    detalleRemision_id INT PRIMARY KEY AUTO_INCREMENT,
    remision_id INT NOT NULL,
    servicioAliado_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio DECIMAL(10, 2) NOT NULL,
    detalles TEXT,
    estado ENUM('pendiente', 'completado', 'cancelado') DEFAULT 'pendiente',
    resultados TEXT,
    observaciones TEXT,
    FOREIGN KEY (remision_id) REFERENCES Remision(remision_id) ON DELETE CASCADE,
    FOREIGN KEY (servicioAliado_id) REFERENCES ServicioAliado(servicioAliado_id) ON DELETE CASCADE
);

CREATE TABLE Nomina (
    nomina_id INT PRIMARY KEY AUTO_INCREMENT,
    sucursal_id INT NOT NULL,
    usuario_id INT COMMENT 'Quien generó la nómina',
    nomina_fecha DATE NOT NULL,
    nomina_periodo_inicio DATE NOT NULL,
    nomina_periodo_fin DATE NOT NULL,
    nomina_estado ENUM('borrador', 'calculada', 'pagada', 'cancelada') DEFAULT 'borrador',
    total_nomina DECIMAL(12, 2),
    observaciones TEXT,
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL
);

CREATE TABLE DetalleNomina (
    detalleNomina_id INT PRIMARY KEY AUTO_INCREMENT,
    nomina_id INT NOT NULL,
    empleado_id INT NOT NULL,
    cantidad_horas INT NOT NULL,
    valor_hora DECIMAL(10, 2) NOT NULL,
    horas_extras INT DEFAULT 0,
    valor_horas_extras DECIMAL(10, 2),
    bonificaciones DECIMAL(10, 2) DEFAULT 0,
    descuentos DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad_horas * valor_hora +
                                               COALESCE(horas_extras, 0) * COALESCE(valor_horas_extras, 0) +
                                               COALESCE(bonificaciones, 0) -
                                               COALESCE(descuentos, 0)) STORED,
    anotaciones TEXT,
    FOREIGN KEY (nomina_id) REFERENCES Nomina(nomina_id) ON DELETE CASCADE,
    FOREIGN KEY (empleado_id) REFERENCES Empleado(empleado_id) ON DELETE CASCADE
);

CREATE TABLE Pedido (
    pedido_id INT PRIMARY KEY AUTO_INCREMENT,
    sucursal_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    usuario_id INT COMMENT 'Quien realizó el pedido',
    pedido_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pedido_estado ENUM('solicitado', 'aprobado', 'en camino', 'recibido', 'cancelado') DEFAULT 'solicitado',
    pedido_detalles TEXT,
    fecha_entrega_estimada DATE,
    fecha_entrega_real DATE,
    subtotal DECIMAL(10, 2),
    impuestos DECIMAL(10, 2),
    descuentos DECIMAL(10, 2),
    total DECIMAL(10, 2),
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'otro'),
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES Proveedor(proveedor_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL
);

CREATE TABLE DetallePedido (
    detallePedido_id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    detallePedido_cantidad INT NOT NULL CHECK (detallePedido_cantidad > 0),
    detallePedido_precio DECIMAL(10, 2) NOT NULL,
    cantidad_recibida INT DEFAULT 0,
    FOREIGN KEY (pedido_id) REFERENCES Pedido(pedido_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES Producto(producto_id) ON DELETE CASCADE
);

CREATE TABLE Factura (
    factura_id INT PRIMARY KEY AUTO_INCREMENT,
    sucursal_id INT NOT NULL,
    cliente_id INT NOT NULL,
    usuario_id INT COMMENT 'Quien generó la factura',
    factura_numero VARCHAR(20) NOT NULL UNIQUE,
    factura_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    factura_subtotal DECIMAL(10, 2) NOT NULL,
    factura_impuestos DECIMAL(10, 2) NOT NULL,
    factura_descuentos DECIMAL(10, 2) DEFAULT 0,
    factura_total DECIMAL(10, 2) NOT NULL,
    factura_estado ENUM('pendiente', 'pagada', 'cancelada', 'anulada') DEFAULT 'pendiente',
    factura_metodo_pago ENUM('efectivo', 'tarjeta crédito', 'tarjeta débito', 'transferencia', 'otro'),
    factura_observaciones TEXT,
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL
);

CREATE TABLE FacturaDetalle (
    facturaDetalle_id INT PRIMARY KEY AUTO_INCREMENT,
    factura_id INT NOT NULL,
    venta_id INT,
    remision_id INT,
    atencion_id INT,
    facturaDetalle_descripcion VARCHAR(100) NOT NULL,
    facturaDetalle_cantidad INT NOT NULL DEFAULT 1,
    facturaDetalle_precio_unitario DECIMAL(10, 2) NOT NULL,
    facturaDetalle_descuento DECIMAL(5,2) DEFAULT 0,
    facturaDetalle_monto DECIMAL(10, 2) GENERATED ALWAYS AS (facturaDetalle_cantidad * facturaDetalle_precio_unitario * (1 - facturaDetalle_descuento/100)) STORED,
    tipo_transaccion ENUM('venta', 'remisión', 'atención') NOT NULL,
    FOREIGN KEY (factura_id) REFERENCES Factura(factura_id) ON DELETE CASCADE,
    FOREIGN KEY (venta_id) REFERENCES Venta(venta_id) ON DELETE SET NULL,
    FOREIGN KEY (remision_id) REFERENCES Remision(remision_id) ON DELETE SET NULL,
    FOREIGN KEY (atencion_id) REFERENCES Atencion(atencion_id) ON DELETE SET NULL
);

CREATE TABLE MovimientoInventario (
    movimiento_id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    sucursal_id INT NOT NULL,
    usuario_id INT COMMENT 'Quien registró el movimiento',
    tipo_movimiento ENUM('entrada', 'salida', 'ajuste', 'transferencia', 'devolución') NOT NULL,
    cantidad INT NOT NULL,
    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    referencia_id INT COMMENT 'ID de la transacción relacionada (venta, pedido, etc)',
    referencia_tipo ENUM('venta', 'pedido', 'ajuste', 'transferencia', 'otro'),
    motivo TEXT,
    FOREIGN KEY (producto_id) REFERENCES Producto(producto_id) ON DELETE CASCADE,
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL
);

CREATE TABLE Cita (
    cita_id INT PRIMARY KEY AUTO_INCREMENT,
    mascota_id INT NOT NULL,
    servicio_id INT NOT NULL,
    usuario_id INT COMMENT 'Veterinario asignado',
    sucursal_id INT NOT NULL,
    cita_fecha DATETIME NOT NULL,
    cita_duracion INT NOT NULL COMMENT 'Duración en minutos',
    cita_estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada', 'no asistió') DEFAULT 'pendiente',
    cita_motivo TEXT,
    cita_observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES Mascota(mascota_id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES Servicio(servicio_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL,
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE
);

CREATE TABLE Auditoria (
    auditoria_id INT PRIMARY KEY AUTO_INCREMENT,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro INT NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    usuario_id INT COMMENT 'Quien realizó el cambio',
    datos_anteriores TEXT,
    datos_nuevos TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id) ON DELETE SET NULL
);

CREATE TABLE Configuracion (
    configuracion_id INT PRIMARY KEY AUTO_INCREMENT,
    sucursal_id INT,
    veterinaria_id INT,
    configuracion_nombre VARCHAR(50) NOT NULL,
    configuracion_valor TEXT NOT NULL,
    configuracion_tipo ENUM('texto', 'número', 'booleano', 'fecha', 'json') NOT NULL,
    FOREIGN KEY (sucursal_id) REFERENCES Sucursal(sucursal_id) ON DELETE CASCADE,
    FOREIGN KEY (veterinaria_id) REFERENCES Veterinaria(veterinaria_id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  DATOS INICIALES (SEED)
-- ============================================================

-- Veterinaria de ejemplo
INSERT INTO Veterinaria (veterinaria_nombre, veterinaria_nit, veterinaria_direccion, veterinaria_telefono, veterinaria_estado)
VALUES ('Huskyvet Central', '900123456-7', 'Calle 100 # 50-25, Bogotá', '6015551234', 'activa');

-- Sucursal de ejemplo
INSERT INTO Sucursal (veterinaria_id, sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_estado)
VALUES (1, 'Sucursal Norte', 'Av. Caracas # 80-15, Bogotá', '6015555678', '900123456-8', 'activa');

-- Empleado (veterinario) para vincular al usuario
INSERT INTO Empleado (sucursal_id, empleado_nombre, empleado_apellido, empleado_cedula, empleado_rol, empleado_direccion, empleado_telefono, fecha_contratacion)
VALUES (1, 'Carlos', 'Fadul', '1234567890', 'administrador', 'Calle 50 # 20-30', '3001234567', '2024-01-15');

-- Usuario superadmin (contraseña: admin123 - hash bcrypt)
INSERT INTO Usuario (veterinaria_id, sucursal_id, empleado_id, usuario_username, usuario_password, usuario_tipo, usuario_estado)
VALUES (1, 1, 1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxep68lF6sO8eZkWm', 'superadmin', 'activo');

-- Usuario superadmin sin vinculación a veterinaria (acceso global)
INSERT INTO Usuario (usuario_username, usuario_password, usuario_tipo, usuario_estado)
VALUES ('superadmin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxep68lF6sO8eZkWm', 'superadmin', 'activo');

-- Proveedor de ejemplo
INSERT INTO Proveedor (nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor, nit_proveedor, proveedor_estado)
VALUES ('Distribuidora VetCol', 'Calle 200 # 15-40, Bogotá', '6014443322', 'ventas@vetcol.com', '800999888-1', 'activo');

-- Producto de ejemplo
INSERT INTO Producto (proveedor_id, categoria_producto, nombre_producto, codigoBarras_producto, cantidad_producto, unidades_producto, precioCompra_producto, precioVenta_producto, marca_producto, producto_estado)
VALUES (1, 'medicamento', 'Antipulgas Max', '7501234567890', 50, 'unidades', 15000.00, 25000.00, 'VetCare', 'activo');

-- Servicio de ejemplo
INSERT INTO Servicio (servicio_nombre, servicio_tipo, servicio_precio, servicio_duracion, servicio_estado)
VALUES ('Consulta General', 'consulta', 35000.00, 30, 'activo');

-- Cliente de ejemplo
INSERT INTO Cliente (sucursal_id, cliente_cedula, cliente_nombre, cliente_apellido, cliente_telefono, cliente_email, cliente_estado)
VALUES (1, '1020304050', 'María', 'González', '3205551234', 'maria.gonzalez@email.com', 'activo');

-- Mascota de ejemplo
INSERT INTO Mascota (cliente_id, mascota_nombre, mascota_especie, mascota_raza, mascota_sexo, mascota_estado)
VALUES (1, 'Max', 'canino', 'Labrador', 'macho', 'vivo');

-- ============================================================
--  FIN DEL SCRIPT
-- ============================================================
