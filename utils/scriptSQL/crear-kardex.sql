SELECT * FROM kardex;

SELECT * FROM kardex inventario
INNER JOIN inventario_db.detalle detalle
	ON detalle.id_detalle = inventario.id_detalle
INNER JOIN inventario_db.producto producto
	ON producto.id_producto = inventario.id_producto;
    
SELECT inventario.fecha as fecha,
	detalle.nombre_detalle as detalle,
	producto.nombre_producto as producto,
	producto.cantidad_producto as cantidad,
	producto.costo_unitario_producto,
	producto.costo_total_producto
FROM inventario_db.kardex inventario
INNER JOIN inventario_db.detalle detalle
	ON detalle.id_detalle = inventario.id_detalle
INNER JOIN inventario_db.producto producto
	ON producto.id_producto = inventario.id_producto;

SELECT * 
FROM inventario_db.kardex inventario
INNER JOIN inventario_db.detalle detalle
	ON detalle.id_detalle = inventario.id_detalle
INNER JOIN inventario_db.producto producto
	ON producto.id_producto = inventario.id_producto;
    
INSERT INTO 
	kardex (
		fecha, 
        cantidad_entrada, 
        entrada_unitario, 
        entrada_total, 
        cantidad_salida, 
        salida_unitaria, 
        salida_total, 
        id_detalle, 
        id_producto)
VALUES ("2019-06-23", 10, 200, 2000, 0,0,0,1,2);
    
INSERT INTO 
	kardex (
		fecha, 
        cantidad_entrada, 
        entrada_unitario, 
        entrada_total, 
        cantidad_salida, 
        salida_unitaria, 
        salida_total, 
        id_detalle, 
        id_producto);
        
SELECT 
	inventario.fecha,
    inventario.cantidad_entrada,
    inventario.entrada_unitario,
    inventario.entrada_total,
    inventario.cantidad_salida,
    inventario.salida_unitaria,
    inventario.salida_total,
    detalle.id_detalle,
    producto.id_producto
FROM inventario_db.kardex inventario
INNER JOIN inventario_db.detalle detalle
	ON detalle.id_detalle = inventario.id_detalle
INNER JOIN inventario_db.producto producto
	ON producto.id_producto = inventario.id_producto
WHERE producto.nombre_producto = "Camisas";

SELECT 
	inventario.fecha,
    detalle.nombre_detalle,
    inventario.cantidad_entrada,
    inventario.entrada_unitario,
    inventario.entrada_total,
    inventario.cantidad_salida,
    inventario.salida_unitaria,
    inventario.salida_total,
    inventario.cantidad_pro,
    inventario.unitario_pro,
    inventario.total_pro
FROM inventario_db.kardex inventario
INNER JOIN inventario_db.detalle detalle
	ON detalle.id_detalle = inventario.id_detalle
INNER JOIN inventario_db.producto producto
	ON producto.id_producto = inventario.id_producto;

INSERT INTO 
	kardex (
		fecha, 
        cantidad_entrada, 
        entrada_unitario, 
        entrada_total, 
        cantidad_salida, 
        salida_unitaria, 
        salida_total, 
        id_detalle, 
        id_producto,
        cantidad_pro,
        unitario_pro,
        total_pro)
VALUES ("2019-06-23", 10, 200, 2000, 0,0,0,1,2,3,5,8);

CREATE TABLE `kardex` (
  `id_kardex` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `cantidad_entrada` int(11) DEFAULT NULL,
  `entrada_unitario` decimal(10,2) DEFAULT NULL,
  `entrada_total` decimal(10,2) DEFAULT NULL,
  `cantidad_salida` int(11) DEFAULT NULL,
  `salida_unitaria` decimal(10,2) DEFAULT NULL,
  `salida_total` decimal(10,2) DEFAULT NULL,
  `id_detalle` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad_pro` int(11) DEFAULT NULL,
  `unitario_pro` decimal(10,2) DEFAULT NULL,
  `total_pro` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_kardex`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
