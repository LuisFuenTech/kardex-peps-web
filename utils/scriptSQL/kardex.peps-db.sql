CREATE TABLE `detalle`
(
  `id_detalle` int
(11) NOT NULL,
  `nombre_detalle` varchar
(45) CHARACTER
SET utf8
COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `detalle_peps`
(
  `id_detalle` int
(11) NOT NULL,
  `nombre_detalle` varchar
(45) CHARACTER
SET utf8
COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `kardex`
(
  `id_kardex` int
(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time
(6) DEFAULT NULL,
  `entrada_cantidad` int
(11) DEFAULT NULL,
  `entrada_unitario` decimal
(30,2) DEFAULT NULL,
  `entrada_total` decimal
(30,2) DEFAULT NULL,
  `salida_cantidad` int
(11) DEFAULT NULL,
  `salida_unitario` decimal
(30,2) DEFAULT NULL,
  `salida_total` decimal
(30,2) DEFAULT NULL,
  `id_detalle` int
(11) DEFAULT NULL,
  `id_producto` int
(11) DEFAULT NULL,
  `producto_cantidad` int
(11) DEFAULT NULL,
  `producto_unitario` decimal
(30,2) DEFAULT NULL,
  `producto_total` decimal
(30,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `kardex`
ADD PRIMARY KEY
( `id_kardex`);

CREATE TABLE `kardex_peps`
(
  `id_kardex` int
(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time
(6) DEFAULT NULL,
  `entrada_cantidad` int
(11) DEFAULT NULL,
  `entrada_unitario` decimal
(30,2) DEFAULT NULL,
  `entrada_total` decimal
(30,2) DEFAULT NULL,
  `salida_cantidad` int
(11) DEFAULT NULL,
  `salida_unitario` decimal
(30,2) DEFAULT NULL,
  `salida_total` decimal
(30,2) DEFAULT NULL,
  `id_detalle` int
(11) DEFAULT NULL,
  `id_producto` int
(11) DEFAULT NULL,
  `producto_cantidad` int
(11) DEFAULT NULL,
  `producto_unitario` decimal
(30,2) DEFAULT NULL,
  `producto_total` decimal
(30,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `kardex_peps`
ADD PRIMARY KEY
( `id_kardex`);

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


CREATE TABLE `sessions`
(
  `session_id` varchar
(128) CHARACTER
SET utf8mb4
COLLATE utf8mb4_bin NOT NULL,
  `expires` int
(11) UNSIGNED NOT NULL,
  `data` text CHARACTER
SET utf8mb4
COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8;