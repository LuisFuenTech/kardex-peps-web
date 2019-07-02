SELECT detalle.fecha as fecha,
	detalle.nombre as detalle,
	producto.nombre as producto,
	producto.cantidad as cantidad,
	producto.costo_unitario,
	producto.costo_total
FROM inventario_db.detalle_producto inventario
INNER JOIN inventario_db.detalle detalle
	ON detalle.id = inventario.id_detalle
INNER JOIN inventario_db.producto producto
	ON producto.id = inventario.id_producto;

-- ON inventario_db.producto.id = inventario_db.detalle_producto.id_producto;