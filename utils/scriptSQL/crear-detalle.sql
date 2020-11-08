SELECT *
FROM detalle;

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

INSERT INTO detalle
  (nombre_detalle)
VALUES
  ("compra");
INSERT INTO detalle
  (nombre_detalle)
VALUES
  ("venta")