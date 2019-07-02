SELECT * FROM detalle;

INSERT INTO detalle (nombre_detalle) VALUES ("venta")

CREATE TABLE `detalle` (
  `id_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_detalle` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id_detalle`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
