const { Producto, Detalle } = require("../models/index");
const simu = require("../data/simulator");

const getKardex = (req, res) => {
  const errors = [];

  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM inventario_db.producto", (err, rs) => {
      if (err) {
        errors.push({ error: "Error al actualizar la tabla" });
        return res.render("user/kardex", { errors });
      }

      //Debbug
      const producto = new Producto();
      producto.setId = rs[0].id_producto;
      producto.setNombre = rs[0].nombre_producto;
      producto.setCantidad = rs[0].cantidad_producto;
      console.table(producto);

      res.render("user/kardex", {
        rs
      });
    });
  });
};

const getPeps = (req, res) => {
  res.render("user/peps");
};

const getProducts = async (req, res) => {
  const errors = [];

  await new Promise((resolve, reject) => {
    req.getConnection((err, conn) => {
      conn.query("SELECT * FROM inventario_db.producto", (err, rs) => {
        if (err) {
          errors.push({ error: "Error al actualizar la tabla" });
          return res.render("user/show_products", { errors });
        }

        res.render("user/show_products", {
          rs
        });
        resolve();
      });
    });
  });
};

const getAbout = (req, res) => {
  res.render("user/about");
};

const makeAction = (req, res) => {
  console.log("Making action =====================");
  const { accion } = req.body;
  console.log("Making action ===================== ", accion);

  if (accion) accion === "compra" ? makePurchase(req, res) : makeSale(req, res);
  else res.render("user/");
};

const makePurchase = async (req, res) => {
  console.log("Making purchase =============================================");
  const { cantidad, costo_unitario, costo_total, nombre } = req.body;
  console.log(req.body);
  const { id_detalle, nombre_detalle } = await searchDetail(req, "compra");
  const {
    id_producto,
    nombre_producto,
    cantidad_producto,
    costo_unitario_producto,
    costo_total_producto
  } = await searchProduct(req, nombre);

  const detalle = new Detalle(id_detalle, nombre_detalle);
  //const producto = new Producto(cantidad, costo_unitario, costo_total, nombre);
  const productoSQL = new Producto(
    nombre_producto,
    cantidad_producto,
    costo_unitario_producto,
    costo_total_producto,
    id_producto
  );

  console.table(productoSQL);

  productoSQL.compraCantidad(Number(cantidad));
  productoSQL.compraTotal(Number(Number(costo_total).toFixed(2)));
  productoSQL.compraUnitaria();

  delete productoSQL.id_producto;
  console.table(productoSQL);
  await updateProduct(req, productoSQL, id_producto);
  res.status(200).json({ detalle, productoSQL });
};

const makeSale = async (req, res) => {
  console.log("Making sale =============================================");

  const { cantidad, costo_unitario, costo_total, nombre } = req.body;

  console.log(req.body);

  const { id_detalle, nombre_detalle } = await searchDetail(req, "venta");
  const {
    id_producto,
    nombre_producto,
    cantidad_producto,
    costo_unitario_producto,
    costo_total_producto
  } = await searchProduct(req, nombre);

  const detalle = new Detalle(id_detalle, nombre_detalle);
  //const producto = new Producto(cantidad, costo_unitario, costo_total, nombre);
  const productoSQL = new Producto(
    nombre_producto,
    cantidad_producto,
    costo_unitario_producto,
    costo_total_producto,
    id_producto
  );

  console.table(productoSQL);

  productoSQL.ventaCantidad(Number(cantidad));
  productoSQL.ventaTotal(Number(Number(costo_total).toFixed(2)));
  productoSQL.ventaUnitaria();

  delete productoSQL.id_producto;
  console.table(productoSQL);
  await updateProduct(req, productoSQL, id_producto);
  res.status(200).json({ detalle, productoSQL });
};

async function searchDetail(req, detail) {
  return await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `SELECT * FROM detalle WHERE nombre_detalle = ?`,
        [detail],
        (err, rs) => {
          if (err) console.log(err);
          resolve(rs[0]);
        }
      );
    });
  });
}

async function searchProduct(req, detail) {
  return await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `SELECT * FROM producto WHERE nombre_producto = ?`,
        [detail],
        (err, rs) => {
          if (err) console.log(err);
          resolve(rs[0]);
        }
      );
    });
  });
}

async function updateProduct(req, product, id_producto) {
  await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `UPDATE producto SET ? WHERE id_producto = ? `,
        [product, id_producto],
        (err, rs) => {
          if (err) console.log(err);
          resolve(rs[0]);
        }
      );
    });
  });
}

module.exports = {
  makeAction,
  getKardex,
  getPeps,
  getProducts,
  getAbout,
  makePurchase,
  makeSale
};
