USE huskyvet;

START TRANSACTION;

SET @sucursal_usuarios = 6;

INSERT INTO Empleado (
    sucursal_id, empleado_nombre, empleado_apellido, empleado_cedula,
    empleado_rol, empleado_direccion, empleado_telefono, empleado_email,
    empleado_genero, empleado_estado, fecha_contratacion
)
SELECT
    @sucursal_usuarios, 'Usuario', 'Inactivo', '900000004', 'otro',
    'Calle de pruebas # 1-01', '3005550113', 'inactivo@huskyvet.test',
    'otro', 'inactivo', '2025-04-01'
WHERE NOT EXISTS (SELECT 1 FROM Empleado WHERE empleado_cedula = '900000004');

SET @empleado_inactivo = (
    SELECT empleado_id FROM Empleado WHERE empleado_cedula = '900000004' LIMIT 1
);

INSERT INTO Usuario (
    empleado_id, sucursal_id, veterinaria_id, usuario_username,
    usuario_password, usuario_tipo, usuario_estado
)
SELECT
    @empleado_inactivo, @sucursal_usuarios, 4, 'prueba.inactivo',
    '$2b$10$wZa5KuuYxvfqgT8zqA6JV.k2IgdRhpjsoYOrBIZm02b5KXdOXrWfi',
    'asistente', 'inactivo'
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE usuario_username = 'prueba.inactivo');

COMMIT;

SELECT
    'Usuarios de prueba disponibles' AS resultado,
    usuario_username,
    usuario_tipo,
    usuario_estado,
    sucursal_id
FROM Usuario
WHERE usuario_username LIKE 'prueba.%'
ORDER BY usuario_username;