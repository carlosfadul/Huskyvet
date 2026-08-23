USE huskyvet;

START TRANSACTION;

SET @sucursal_pedidos = 7;
SET @proveedor_pedidos = (SELECT proveedor_id FROM Proveedor WHERE nit_proveedor = '900200001-1' LIMIT 1);
SET @producto_antibiotico = (SELECT producto_id FROM Producto WHERE codigoBarras_producto = '900300001' LIMIT 1);
SET @producto_alimento = (SELECT producto_id FROM Producto WHERE codigoBarras_producto = '900300002' LIMIT 1);
SET @producto_shampoo = (SELECT producto_id FROM Producto WHERE codigoBarras_producto = '900300003' LIMIT 1);

INSERT INTO Pedido (
    sucursal_id, proveedor_id, usuario_id, pedido_fecha, pedido_estado,
    pedido_detalles, fecha_entrega_estimada, subtotal, impuestos,
    descuentos, total, metodo_pago
)
SELECT
    @sucursal_pedidos, @proveedor_pedidos, NULL, '2026-08-22 09:00:00', 'solicitado',
    'Pedido de prueba pendiente para sucursal 7', '2026-08-28',
    400000, 76000, 0, 476000, 'transferencia'
WHERE NOT EXISTS (
    SELECT 1 FROM Pedido
    WHERE sucursal_id = @sucursal_pedidos
      AND pedido_detalles = 'Pedido de prueba pendiente para sucursal 7'
);
SET @pedido_solicitado = (
    SELECT pedido_id FROM Pedido
    WHERE sucursal_id = @sucursal_pedidos
      AND pedido_detalles = 'Pedido de prueba pendiente para sucursal 7'
    LIMIT 1
);

INSERT INTO DetallePedido (
    pedido_id, producto_id, detallePedido_cantidad,
    detallePedido_precio, cantidad_recibida
)
SELECT @pedido_solicitado, @producto_antibiotico, 10, 18000, 0
WHERE NOT EXISTS (
    SELECT 1 FROM DetallePedido
    WHERE pedido_id = @pedido_solicitado AND producto_id = @producto_antibiotico
);

INSERT INTO DetallePedido (
    pedido_id, producto_id, detallePedido_cantidad,
    detallePedido_precio, cantidad_recibida
)
SELECT @pedido_solicitado, @producto_alimento, 5, 22000, 0
WHERE NOT EXISTS (
    SELECT 1 FROM DetallePedido
    WHERE pedido_id = @pedido_solicitado AND producto_id = @producto_alimento
);

INSERT INTO Pedido (
    sucursal_id, proveedor_id, usuario_id, pedido_fecha, pedido_estado,
    pedido_detalles, fecha_entrega_estimada, fecha_entrega_real,
    subtotal, impuestos, descuentos, total, metodo_pago
)
SELECT
    @sucursal_pedidos, @proveedor_pedidos, NULL, '2026-08-19 10:30:00', 'recibido',
    'Pedido de prueba recibido parcialmente para sucursal 7', '2026-08-21', '2026-08-21',
    180000, 34200, 0, 214200, 'efectivo'
WHERE NOT EXISTS (
    SELECT 1 FROM Pedido
    WHERE sucursal_id = @sucursal_pedidos
      AND pedido_detalles = 'Pedido de prueba recibido parcialmente para sucursal 7'
);
SET @pedido_recibido = (
    SELECT pedido_id FROM Pedido
    WHERE sucursal_id = @sucursal_pedidos
      AND pedido_detalles = 'Pedido de prueba recibido parcialmente para sucursal 7'
    LIMIT 1
);

INSERT INTO DetallePedido (
    pedido_id, producto_id, detallePedido_cantidad,
    detallePedido_precio, cantidad_recibida
)
SELECT @pedido_recibido, @producto_shampoo, 8, 9000, 8
WHERE NOT EXISTS (
    SELECT 1 FROM DetallePedido
    WHERE pedido_id = @pedido_recibido AND producto_id = @producto_shampoo
);

COMMIT;

SELECT
    'Pedidos de prueba cargados' AS resultado,
    @pedido_solicitado AS pedido_solicitado_id,
    @pedido_recibido AS pedido_recibido_id;