CREATE TABLE `producto`
(
  `id_producto` int
(11) NOT NULL,
  `nombre_producto` varchar
(45) CHARACTER
SET utf8
COLLATE utf8_unicode_ci NOT NULL,
  `cantidad_producto` int
(11) NOT NULL,
  `costo_unitario_producto` decimal
(30,2) NOT NULL,
  `costo_total_producto` decimal
(30,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `producto_peps`
(
  `id_producto` int
(11) NOT NULL,
  `nombre_producto` varchar
(45) CHARACTER
SET utf8
COLLATE utf8_unicode_ci NOT NULL,
  `cantidad_producto` int
(11) NOT NULL,
  `costo_unitario_producto` decimal
(10,2) NOT NULL,
  `costo_total_producto` decimal
(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


SELECT *
FROM producto;

SELECT nombreproducto_producto
FROM producto;

INSERT INTO 
	producto
  (
  nombre_producto,
  cantidad_producto,
  costo_unitario_producto,
  costo_total_producto
  )
VALUES
  ("Pantalones", 45, 2000, 90000);

UPDATE producto SET costo_unitario_producto = (costo_total_producto / cantidad_producto) + 3
WHERE id_producto = 2;

CREATE TABLE `producto`
(
  `id_producto` int
(11) NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar
(45) COLLATE utf8_unicode_ci NOT NULL,
  `cantidad_producto` int
(11) NOT NULL,
  `costo_unitario_producto` decimal
(10,2) NOT NULL,
  `costo_total_producto` decimal
(10,2) DEFAULT NULL,
  PRIMARY KEY
(`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
