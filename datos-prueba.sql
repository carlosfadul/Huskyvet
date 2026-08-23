USE huskyvet;

START TRANSACTION;

INSERT INTO Veterinaria (veterinaria_nombre, veterinaria_nit, veterinaria_direccion, veterinaria_telefono, veterinaria_estado)
SELECT 'Huskyvet Pruebas', '900999999-1', 'Carrera 15 # 80-20', '3005550101', 'activa'
WHERE NOT EXISTS (SELECT 1 FROM Veterinaria WHERE veterinaria_nit = '900999999-1');
SET @veterinaria_prueba = (SELECT veterinaria_id FROM Veterinaria WHERE veterinaria_nit = '900999999-1' LIMIT 1);

INSERT INTO Sucursal (veterinaria_id, sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_estado)
SELECT @veterinaria_prueba, 'Sucursal Pruebas', 'Carrera 15 # 80-20', '3005550102', '900999999-2', 'activa'
WHERE NOT EXISTS (SELECT 1 FROM Sucursal WHERE sucursal_nit = '900999999-2');
SET @sucursal_prueba = (SELECT sucursal_id FROM Sucursal WHERE sucursal_nit = '900999999-2' LIMIT 1);

INSERT INTO Sucursal (veterinaria_id, sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_estado)
SELECT @veterinaria_prueba, 'Sucursal Pruebas Norte', 'Calle 120 # 7-10', '3005550103', '900999999-3', 'activa'
WHERE NOT EXISTS (SELECT 1 FROM Sucursal WHERE sucursal_nit = '900999999-3');
SET @sucursal_norte = (SELECT sucursal_id FROM Sucursal WHERE sucursal_nit = '900999999-3' LIMIT 1);

INSERT INTO Configuracion (sucursal_id, veterinaria_id, configuracion_nombre, configuracion_valor, configuracion_tipo)
SELECT @sucursal_prueba, @veterinaria_prueba, 'modo_pruebas', 'true', 'booleano'
WHERE NOT EXISTS (SELECT 1 FROM Configuracion WHERE sucursal_id = @sucursal_prueba AND configuracion_nombre = 'modo_pruebas');

INSERT INTO Empleado (sucursal_id, empleado_nombre, empleado_apellido, empleado_cedula, empleado_rol, empleado_direccion, empleado_telefono, empleado_email, empleado_genero, empleado_estado, fecha_contratacion)
SELECT @sucursal_prueba, 'Laura', 'Veterinaria', '900000001', 'veterinario', 'Carrera 15 # 80-20', '3005550110', 'laura.prueba@huskyvet.test', 'femenino', 'activo', '2025-01-10'
WHERE NOT EXISTS (SELECT 1 FROM Empleado WHERE empleado_cedula = '900000001');
SET @empleado_vet = (SELECT empleado_id FROM Empleado WHERE empleado_cedula = '900000001' LIMIT 1);

INSERT INTO Empleado (sucursal_id, empleado_nombre, empleado_apellido, empleado_cedula, empleado_rol, empleado_direccion, empleado_telefono, empleado_email, empleado_genero, empleado_estado, fecha_contratacion)
SELECT @sucursal_prueba, 'Andrés', 'Asistente', '900000002', 'asistente', 'Carrera 15 # 80-20', '3005550111', 'andres.prueba@huskyvet.test', 'masculino', 'activo', '2025-02-01'
WHERE NOT EXISTS (SELECT 1 FROM Empleado WHERE empleado_cedula = '900000002');
SET @empleado_asistente = (SELECT empleado_id FROM Empleado WHERE empleado_cedula = '900000002' LIMIT 1);

INSERT INTO Empleado (sucursal_id, empleado_nombre, empleado_apellido, empleado_cedula, empleado_rol, empleado_direccion, empleado_telefono, empleado_email, empleado_genero, empleado_estado, fecha_contratacion)
SELECT @sucursal_prueba, 'Sofía', 'Recepción', '900000003', 'recepcionista', 'Carrera 15 # 80-20', '3005550112', 'sofia.prueba@huskyvet.test', 'femenino', 'activo', '2025-03-01'
WHERE NOT EXISTS (SELECT 1 FROM Empleado WHERE empleado_cedula = '900000003');
SET @empleado_recepcion = (SELECT empleado_id FROM Empleado WHERE empleado_cedula = '900000003' LIMIT 1);

INSERT INTO Usuario (empleado_id, sucursal_id, veterinaria_id, usuario_username, usuario_password, usuario_tipo, usuario_estado)
SELECT @empleado_vet, @sucursal_prueba, @veterinaria_prueba, 'prueba.veterinario', '$2b$10$wZa5KuuYxvfqgT8zqA6JV.k2IgdRhpjsoYOrBIZm02b5KXdOXrWfi', 'veterinario', 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE usuario_username = 'prueba.veterinario');
SET @usuario_vet = (SELECT usuario_id FROM Usuario WHERE usuario_username = 'prueba.veterinario' LIMIT 1);

INSERT INTO Usuario (empleado_id, sucursal_id, veterinaria_id, usuario_username, usuario_password, usuario_tipo, usuario_estado)
SELECT @empleado_asistente, @sucursal_prueba, @veterinaria_prueba, 'prueba.asistente', '$2b$10$wZa5KuuYxvfqgT8zqA6JV.k2IgdRhpjsoYOrBIZm02b5KXdOXrWfi', 'asistente', 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE usuario_username = 'prueba.asistente');
SET @usuario_asistente = (SELECT usuario_id FROM Usuario WHERE usuario_username = 'prueba.asistente' LIMIT 1);

INSERT INTO Usuario (empleado_id, sucursal_id, veterinaria_id, usuario_username, usuario_password, usuario_tipo, usuario_estado)
SELECT @empleado_recepcion, @sucursal_prueba, @veterinaria_prueba, 'prueba.recepcion', '$2b$10$wZa5KuuYxvfqgT8zqA6JV.k2IgdRhpjsoYOrBIZm02b5KXdOXrWfi', 'recepcionista', 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE usuario_username = 'prueba.recepcion');
SET @usuario_recepcion = (SELECT usuario_id FROM Usuario WHERE usuario_username = 'prueba.recepcion' LIMIT 1);

INSERT INTO Cliente (sucursal_id, cliente_cedula, cliente_nombre, cliente_apellido, cliente_direccion, cliente_telefono, cliente_email, cliente_detalles, cliente_estado)
SELECT @sucursal_prueba, '900100001', 'Camila', 'Rojas', 'Calle 90 # 12-30', '3105550201', 'camila.rojas@huskyvet.test', 'Cliente de prueba activo', 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Cliente WHERE sucursal_id = @sucursal_prueba AND cliente_cedula = '900100001');
SET @cliente_camila = (SELECT cliente_id FROM Cliente WHERE cliente_cedula = '900100001' AND sucursal_id = @sucursal_prueba LIMIT 1);

INSERT INTO Cliente (sucursal_id, cliente_cedula, cliente_nombre, cliente_apellido, cliente_direccion, cliente_telefono, cliente_email, cliente_detalles, cliente_estado)
SELECT @sucursal_prueba, '900100002', 'Felipe', 'Mendoza', 'Calle 91 # 12-31', '3105550202', 'felipe.mendoza@huskyvet.test', 'Cliente con varias mascotas', 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Cliente WHERE sucursal_id = @sucursal_prueba AND cliente_cedula = '900100002');
SET @cliente_felipe = (SELECT cliente_id FROM Cliente WHERE cliente_cedula = '900100002' AND sucursal_id = @sucursal_prueba LIMIT 1);

INSERT INTO Cliente (sucursal_id, cliente_cedula, cliente_nombre, cliente_apellido, cliente_direccion, cliente_telefono, cliente_email, cliente_detalles, cliente_estado)
SELECT @sucursal_norte, '900100001', 'Camila', 'Rojas', 'Carrera 8 # 120-15', '3105550203', 'camila.norte@huskyvet.test', 'Misma cédula en otra sucursal', 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Cliente WHERE sucursal_id = @sucursal_norte AND cliente_cedula = '900100001');

INSERT INTO Mascota (cliente_id, mascota_nombre, mascota_especie, mascota_raza, mascota_sexo, mascota_fecha_nac, mascota_color, mascota_peso, mascota_estado)
SELECT @cliente_camila, 'Luna', 'canino', 'Golden Retriever', 'hembra', '2021-06-15', 'Dorado', 24.50, 'vivo'
WHERE NOT EXISTS (SELECT 1 FROM Mascota WHERE cliente_id = @cliente_camila AND mascota_nombre = 'Luna');
SET @mascota_luna = (SELECT mascota_id FROM Mascota WHERE cliente_id = @cliente_camila AND mascota_nombre = 'Luna' LIMIT 1);

INSERT INTO Mascota (cliente_id, mascota_nombre, mascota_especie, mascota_raza, mascota_sexo, mascota_fecha_nac, mascota_color, mascota_peso, mascota_estado)
SELECT @cliente_felipe, 'Michi', 'felino', 'Criollo', 'macho', '2022-03-20', 'Atigrado', 4.20, 'vivo'
WHERE NOT EXISTS (SELECT 1 FROM Mascota WHERE cliente_id = @cliente_felipe AND mascota_nombre = 'Michi');
SET @mascota_michi = (SELECT mascota_id FROM Mascota WHERE cliente_id = @cliente_felipe AND mascota_nombre = 'Michi' LIMIT 1);

INSERT INTO Mascota (cliente_id, mascota_nombre, mascota_especie, mascota_raza, mascota_sexo, mascota_fecha_nac, mascota_color, mascota_peso, mascota_estado)
SELECT @cliente_felipe, 'Rocky', 'canino', 'Beagle', 'macho', '2018-11-02', 'Tricolor', 13.80, 'perdido'
WHERE NOT EXISTS (SELECT 1 FROM Mascota WHERE cliente_id = @cliente_felipe AND mascota_nombre = 'Rocky');
SET @mascota_rocky = (SELECT mascota_id FROM Mascota WHERE cliente_id = @cliente_felipe AND mascota_nombre = 'Rocky' LIMIT 1);

INSERT INTO Proveedor (nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor, nit_proveedor, detalles_proveedor, proveedor_estado)
SELECT 'VetSupply Pruebas', 'Calle 30 # 20-10', '6015550301', 'ventas@vetsupply.test', '900200001-1', 'Proveedor de prueba', 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Proveedor WHERE nit_proveedor = '900200001-1');
SET @proveedor_prueba = (SELECT proveedor_id FROM Proveedor WHERE nit_proveedor = '900200001-1' LIMIT 1);

INSERT INTO Producto (proveedor_id, categoria_producto, nombre_producto, codigoBarras_producto, cantidad_producto, unidades_producto, precioCompra_producto, precioVenta_producto, marca_producto, descripcion_producto, producto_estado, fecha_vencimiento)
SELECT @proveedor_prueba, 'medicamento', 'Antibiótico Prueba', '900300001', 25, 'unidades', 18000, 28000, 'VetPharm', 'Producto de prueba para ventas', 'activo', '2027-12-31'
WHERE NOT EXISTS (SELECT 1 FROM Producto WHERE codigoBarras_producto = '900300001');
SET @producto_antibiotico = (SELECT producto_id FROM Producto WHERE codigoBarras_producto = '900300001' LIMIT 1);

INSERT INTO Producto (proveedor_id, categoria_producto, nombre_producto, codigoBarras_producto, cantidad_producto, unidades_producto, precioCompra_producto, precioVenta_producto, marca_producto, descripcion_producto, producto_estado)
SELECT @proveedor_prueba, 'alimento', 'Alimento Premium Prueba', '900300002', 40, 'kilogramos', 22000, 35000, 'NutriPet', 'Alimento para ensayo de inventario', 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Producto WHERE codigoBarras_producto = '900300002');
SET @producto_alimento = (SELECT producto_id FROM Producto WHERE codigoBarras_producto = '900300002' LIMIT 1);

INSERT INTO Producto (proveedor_id, categoria_producto, nombre_producto, codigoBarras_producto, cantidad_producto, unidades_producto, precioCompra_producto, precioVenta_producto, marca_producto, descripcion_producto, producto_estado)
SELECT @proveedor_prueba, 'higiene', 'Shampoo Prueba', '900300003', 0, 'unidades', 9000, 16000, 'CleanPet', 'Producto agotado para probar alertas', 'agotado'
WHERE NOT EXISTS (SELECT 1 FROM Producto WHERE codigoBarras_producto = '900300003');
SET @producto_shampoo = (SELECT producto_id FROM Producto WHERE codigoBarras_producto = '900300003' LIMIT 1);

INSERT INTO Servicio (servicio_nombre, servicio_tipo, servicio_detalle, servicio_precio, servicio_duracion, servicio_estado)
SELECT 'Consulta Prueba', 'consulta', 'Consulta clínica para datos de prueba', 45000, 30, 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Servicio WHERE servicio_nombre = 'Consulta Prueba');
SET @servicio_consulta = (SELECT servicio_id FROM Servicio WHERE servicio_nombre = 'Consulta Prueba' LIMIT 1);

INSERT INTO Servicio (servicio_nombre, servicio_tipo, servicio_detalle, servicio_precio, servicio_duracion, servicio_estado)
SELECT 'Vacunación Prueba', 'otro', 'Aplicación de vacuna para ensayo', 30000, 20, 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Servicio WHERE servicio_nombre = 'Vacunación Prueba');
SET @servicio_vacunacion = (SELECT servicio_id FROM Servicio WHERE servicio_nombre = 'Vacunación Prueba' LIMIT 1);

INSERT INTO Enfermedad (nombre_enfermedad, descripcion_enfermedad, categoria, especie_afectada)
SELECT 'Dermatitis de prueba', 'Caso clínico para ensayo de historia médica', 'otra', 'canino'
WHERE NOT EXISTS (SELECT 1 FROM Enfermedad WHERE nombre_enfermedad = 'Dermatitis de prueba');
SET @enfermedad_prueba = (SELECT enfermedad_id FROM Enfermedad WHERE nombre_enfermedad = 'Dermatitis de prueba' LIMIT 1);

INSERT INTO Tratamiento (nombre_tratamiento, descripcion_tratamiento, tipo_tratamiento, duracion_recomendada)
SELECT 'Tratamiento tópico de prueba', 'Aplicar una vez al día durante siete días', 'medicamento', '7 días'
WHERE NOT EXISTS (SELECT 1 FROM Tratamiento WHERE nombre_tratamiento = 'Tratamiento tópico de prueba');
SET @tratamiento_prueba = (SELECT tratamiento_id FROM Tratamiento WHERE nombre_tratamiento = 'Tratamiento tópico de prueba' LIMIT 1);

INSERT INTO Vacuna (vacuna_nombre, vacuna_laboratorio, vacuna_detalles, especie_destinada, edad_minima_semanas, frecuencia_meses)
SELECT 'Vacuna Séxtuple Prueba', 'Laboratorio TestVet', 'Vacuna para escenario de prueba', 'canino', 8, 12
WHERE NOT EXISTS (SELECT 1 FROM Vacuna WHERE vacuna_nombre = 'Vacuna Séxtuple Prueba');
SET @vacuna_prueba = (SELECT vacuna_id FROM Vacuna WHERE vacuna_nombre = 'Vacuna Séxtuple Prueba' LIMIT 1);

INSERT INTO Desparasitante (desparasitante_nombre, desparasitante_laboratorio, desparasitante_detalles, tipo, especie_destinada, edad_minima_semanas, peso_minimo, peso_maximo)
SELECT 'Desparasitante Total Prueba', 'Laboratorio TestVet', 'Producto de prueba interno y externo', 'combinado', 'canino', 8, 2, 30
WHERE NOT EXISTS (SELECT 1 FROM Desparasitante WHERE desparasitante_nombre = 'Desparasitante Total Prueba');
SET @desparasitante_prueba = (SELECT desparasitante_id FROM Desparasitante WHERE desparasitante_nombre = 'Desparasitante Total Prueba' LIMIT 1);

INSERT INTO Aliado (sucursal_id, nombre_aliado, direccion_aliado, telefono_aliado, email_aliado, nit_aliado, aliado_detalles, aliado_estado)
SELECT @sucursal_prueba, 'Laboratorio Diagnóstico Prueba', 'Calle 45 # 10-20', '6015550401', 'contacto@labprueba.test', '900400001-1', 'Aliado para remisiones de prueba', 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Aliado WHERE nit_aliado = '900400001-1');
SET @aliado_prueba = (SELECT aliado_id FROM Aliado WHERE nit_aliado = '900400001-1' LIMIT 1);

INSERT INTO ServicioAliado (aliado_id, nombre_servicioAliado, detalle_servicioAliado, precio_servicio, servicio_estado)
SELECT @aliado_prueba, 'Hemograma de prueba', 'Resultado en 24 horas', 65000, 'activo'
WHERE NOT EXISTS (SELECT 1 FROM ServicioAliado WHERE aliado_id = @aliado_prueba AND nombre_servicioAliado = 'Hemograma de prueba');
SET @servicio_aliado = (SELECT servicioAliado_id FROM ServicioAliado WHERE aliado_id = @aliado_prueba AND nombre_servicioAliado = 'Hemograma de prueba' LIMIT 1);

INSERT INTO Atencion (mascota_id, servicio_id, usuario_id, atencion_fecha, atencion_cantidad, atencion_precio, atencion_detalle, atencion_estado, diagnostico, tratamiento, observaciones)
SELECT @mascota_luna, @servicio_consulta, @usuario_vet, '2026-08-20 09:00:00', 1, 45000, 'Atención clínica de prueba', 'completada', 'Dermatitis leve', 'Tratamiento tópico de prueba', 'Control en siete días'
WHERE NOT EXISTS (SELECT 1 FROM Atencion WHERE mascota_id = @mascota_luna AND atencion_detalle = 'Atención clínica de prueba');
SET @atencion_prueba = (SELECT atencion_id FROM Atencion WHERE mascota_id = @mascota_luna AND atencion_detalle = 'Atención clínica de prueba' LIMIT 1);

INSERT INTO DetalleAtencion (atencion_id, nombreVeterinario, tarjetaProfesionalVeterinario, edadActualMascota, alimento, actividadFisicaMascota, comidasDia, esterilizado, cruce, carnetVacunas, fechaUltimaVacuna, fechaProximaVacuna, peso, temperatura, estadoNutricional, estadoPiel, hallazgos, recomendaciones)
SELECT @atencion_prueba, 'Laura Veterinaria', 'TV-90001', '5 años', 'Concentrado premium', 'Paseos diarios', '2', 'si', 'si', 'si', '2025-08-20', '2026-08-20', 24.50, 38.5, 'ideal', 'Enrojecimiento leve', 'Irritación en zona dorsal', 'Continuar tratamiento y asistir a control'
WHERE NOT EXISTS (SELECT 1 FROM DetalleAtencion WHERE atencion_id = @atencion_prueba);

INSERT INTO MascotaEnfermedad (mascota_id, enfermedad_id, fecha_diagnostico, estado, observaciones)
SELECT @mascota_luna, @enfermedad_prueba, '2026-08-20', 'en tratamiento', 'Caso creado para ensayo'
WHERE NOT EXISTS (SELECT 1 FROM MascotaEnfermedad WHERE mascota_id = @mascota_luna AND enfermedad_id = @enfermedad_prueba AND fecha_diagnostico = '2026-08-20');

INSERT INTO MascotaTratamiento (mascota_id, tratamiento_id, atencion_id, fecha_inicio, fecha_fin, dosis, frecuencia, via_administracion, observaciones, estado)
SELECT @mascota_luna, @tratamiento_prueba, @atencion_prueba, '2026-08-20', '2026-08-27', 'Aplicar una capa', 'Cada 24 horas', 'Tópica', 'Tratamiento de prueba', 'en curso'
WHERE NOT EXISTS (SELECT 1 FROM MascotaTratamiento WHERE mascota_id = @mascota_luna AND tratamiento_id = @tratamiento_prueba AND fecha_inicio = '2026-08-20');

INSERT INTO AplicacionVacuna (mascota_id, vacuna_id, usuario_id, aplicacionVacuna_fecha, proximaVacuna_fecha, proximaVacuna_nombre, aplicacionVacuna_estado, lote_vacuna, observaciones)
SELECT @mascota_luna, @vacuna_prueba, @usuario_vet, '2026-08-20 10:00:00', '2027-08-20', 'Vacuna Séxtuple Prueba', 'aplicada', 'LOTE-PRUEBA-01', 'Aplicación para ensayo'
WHERE NOT EXISTS (SELECT 1 FROM AplicacionVacuna WHERE mascota_id = @mascota_luna AND vacuna_id = @vacuna_prueba AND lote_vacuna = 'LOTE-PRUEBA-01');

INSERT INTO AplicacionDesparasitante (mascota_id, desparasitante_id, usuario_id, aplicacionDesparasitante_fecha, proximoDesparasitante_fecha, proximoDesparasitante_nombre, aplicacionDesparasitante_estado, dosis, observaciones)
SELECT @mascota_luna, @desparasitante_prueba, @usuario_vet, '2026-08-20 10:30:00', '2026-11-20', 'Desparasitante Total Prueba', 'aplicada', '1 tableta', 'Aplicación para ensayo'
WHERE NOT EXISTS (SELECT 1 FROM AplicacionDesparasitante WHERE mascota_id = @mascota_luna AND desparasitante_id = @desparasitante_prueba AND dosis = '1 tableta');

INSERT INTO Pedido (sucursal_id, proveedor_id, usuario_id, pedido_fecha, pedido_estado, pedido_detalles, fecha_entrega_estimada, fecha_entrega_real, subtotal, impuestos, descuentos, total, metodo_pago)
SELECT @sucursal_prueba, @proveedor_prueba, @usuario_asistente, '2026-08-18 08:00:00', 'recibido', 'Pedido de prueba recibido parcialmente', '2026-08-20', '2026-08-20', 400000, 76000, 0, 476000, 'transferencia'
WHERE NOT EXISTS (SELECT 1 FROM Pedido WHERE sucursal_id = @sucursal_prueba AND pedido_detalles = 'Pedido de prueba recibido parcialmente');
SET @pedido_prueba = (SELECT pedido_id FROM Pedido WHERE sucursal_id = @sucursal_prueba AND pedido_detalles = 'Pedido de prueba recibido parcialmente' LIMIT 1);

INSERT INTO DetallePedido (pedido_id, producto_id, detallePedido_cantidad, detallePedido_precio, cantidad_recibida)
SELECT @pedido_prueba, @producto_antibiotico, 20, 18000, 20
WHERE NOT EXISTS (SELECT 1 FROM DetallePedido WHERE pedido_id = @pedido_prueba AND producto_id = @producto_antibiotico);

INSERT INTO MovimientoInventario (producto_id, sucursal_id, usuario_id, tipo_movimiento, cantidad, fecha_movimiento, referencia_id, referencia_tipo, motivo)
SELECT @producto_antibiotico, @sucursal_prueba, @usuario_asistente, 'entrada', 20, '2026-08-20 12:00:00', @pedido_prueba, 'pedido', 'Entrada de pedido de prueba'
WHERE NOT EXISTS (SELECT 1 FROM MovimientoInventario WHERE producto_id = @producto_antibiotico AND motivo = 'Entrada de pedido de prueba');

INSERT INTO Cita (mascota_id, servicio_id, usuario_id, sucursal_id, cita_fecha, cita_duracion, cita_estado, cita_motivo, cita_observaciones)
SELECT @mascota_michi, @servicio_vacunacion, @usuario_vet, @sucursal_prueba, '2026-08-25 14:00:00', 20, 'confirmada', 'Refuerzo de vacunación', 'Cita de prueba confirmada'
WHERE NOT EXISTS (SELECT 1 FROM Cita WHERE mascota_id = @mascota_michi AND cita_observaciones = 'Cita de prueba confirmada');

INSERT INTO Venta (cliente_id, sucursal_id, usuario_id, venta_fecha, venta_estado, venta_detalles, subtotal, impuestos, descuentos, total, metodo_pago)
SELECT @cliente_camila, @sucursal_prueba, @usuario_recepcion, '2026-08-21 15:00:00', 'completada', 'Venta de prueba', 56000, 10640, 0, 66640, 'tarjeta'
WHERE NOT EXISTS (SELECT 1 FROM Venta WHERE cliente_id = @cliente_camila AND venta_detalles = 'Venta de prueba');
SET @venta_prueba = (SELECT venta_id FROM Venta WHERE cliente_id = @cliente_camila AND venta_detalles = 'Venta de prueba' LIMIT 1);

INSERT INTO DetalleVenta (venta_id, producto_id, detalleVenta_cantidad, detalleVenta_precio, descuento)
SELECT @venta_prueba, @producto_antibiotico, 2, 28000, 0
WHERE NOT EXISTS (SELECT 1 FROM DetalleVenta WHERE venta_id = @venta_prueba AND producto_id = @producto_antibiotico);

INSERT INTO Remision (sucursal_id, aliado_id, mascota_id, usuario_id, remision_fecha, remision_estado, remision_diagnostico, remision_observaciones)
SELECT @sucursal_prueba, @aliado_prueba, @mascota_luna, @usuario_vet, '2026-08-21 16:00:00', 'completada', 'Necesita hemograma', 'Remisión de prueba'
WHERE NOT EXISTS (SELECT 1 FROM Remision WHERE mascota_id = @mascota_luna AND remision_observaciones = 'Remisión de prueba');
SET @remision_prueba = (SELECT remision_id FROM Remision WHERE mascota_id = @mascota_luna AND remision_observaciones = 'Remisión de prueba' LIMIT 1);

INSERT INTO DetalleRemision (remision_id, servicioAliado_id, cantidad, precio, detalles, estado, resultados)
SELECT @remision_prueba, @servicio_aliado, 1, 65000, 'Tomar muestra en ayunas', 'completado', 'Resultado dentro de parámetros'
WHERE NOT EXISTS (SELECT 1 FROM DetalleRemision WHERE remision_id = @remision_prueba AND servicioAliado_id = @servicio_aliado);

INSERT INTO Nomina (sucursal_id, usuario_id, nomina_fecha, nomina_periodo_inicio, nomina_periodo_fin, nomina_estado, total_nomina, observaciones)
SELECT @sucursal_prueba, @usuario_asistente, '2026-08-31', '2026-08-01', '2026-08-31', 'calculada', 0, 'Nómina de prueba'
WHERE NOT EXISTS (SELECT 1 FROM Nomina WHERE sucursal_id = @sucursal_prueba AND observaciones = 'Nómina de prueba');
SET @nomina_prueba = (SELECT nomina_id FROM Nomina WHERE sucursal_id = @sucursal_prueba AND observaciones = 'Nómina de prueba' LIMIT 1);

INSERT INTO DetalleNomina (nomina_id, empleado_id, cantidad_horas, valor_hora, horas_extras, valor_horas_extras, bonificaciones, descuentos, anotaciones)
SELECT @nomina_prueba, @empleado_vet, 160, 25000, 4, 30000, 100000, 50000, 'Detalle de nómina de prueba'
WHERE NOT EXISTS (SELECT 1 FROM DetalleNomina WHERE nomina_id = @nomina_prueba AND empleado_id = @empleado_vet);

INSERT INTO Factura (sucursal_id, cliente_id, usuario_id, factura_numero, factura_fecha, factura_subtotal, factura_impuestos, factura_descuentos, factura_total, factura_estado, factura_metodo_pago, factura_observaciones)
SELECT @sucursal_prueba, @cliente_camila, @usuario_recepcion, 'FAC-PRUEBA-001', '2026-08-21 15:05:00', 56000, 10640, 0, 66640, 'pagada', 'transferencia', 'Factura de prueba'
WHERE NOT EXISTS (SELECT 1 FROM Factura WHERE factura_numero = 'FAC-PRUEBA-001');
SET @factura_prueba = (SELECT factura_id FROM Factura WHERE factura_numero = 'FAC-PRUEBA-001' LIMIT 1);

INSERT INTO FacturaDetalle (factura_id, venta_id, facturaDetalle_descripcion, facturaDetalle_cantidad, facturaDetalle_precio_unitario, facturaDetalle_descuento, tipo_transaccion)
SELECT @factura_prueba, @venta_prueba, 'Antibiótico Prueba', 2, 28000, 0, 'venta'
WHERE NOT EXISTS (SELECT 1 FROM FacturaDetalle WHERE factura_id = @factura_prueba AND venta_id = @venta_prueba);

INSERT INTO Auditoria (tabla_afectada, id_registro, accion, usuario_id, datos_nuevos)
SELECT 'Cliente', @cliente_camila, 'INSERT', @usuario_recepcion, '{"origen":"datos-prueba.sql","identificador":"900100001"}'
WHERE NOT EXISTS (SELECT 1 FROM Auditoria WHERE tabla_afectada = 'Cliente' AND id_registro = @cliente_camila AND datos_nuevos LIKE '%datos-prueba.sql%');

COMMIT;

SELECT 'Datos de prueba cargados' AS resultado,
       @veterinaria_prueba AS veterinaria_id,
       @sucursal_prueba AS sucursal_id,
       @usuario_vet AS usuario_veterinario_id,
       @cliente_camila AS cliente_id,
       @mascota_luna AS mascota_id,
       @venta_prueba AS venta_id,
       @factura_prueba AS factura_id;