const { Producto, Detalle, Kardex } = require("../models/index");
const simu = require("../data/simulator");
let product = {};
let detalle = {};
let kardex = {};
let productoSQL = {};

const getKardex = (req, res) => {
  const errors = [];

  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM producto", (err, rs) => {
      if (err) {
        errors.push({ error: "Error al actualizar la tabla" });
        return res.render("user/kardex", { errors });
      }

      res.render("user/kardex", {
        rs
      });
    });
  });
};

const getPeps = async (req, res) => {
  const errors = [];

  await new Promise((resolve, reject) => {
    req.getConnection((err, conn) => {
      conn.query("SELECT * FROM producto", (err, rs) => {
        if (err) {
          errors.push({ error: "Error al actualizar la tabla" });
          return res.render("user/peps", { errors });
        }

        res.render("user/peps", {
          rs
        });
        resolve();
      });
    });
  });
};

const addProduct = async (req, res) => {
  console.log("Making saving");
  const { nombre, cantidad, costo_unitario } = req.body;
  product = new Producto();
  const costo_total = Number(cantidad) * Number(costo_unitario);

  product.setNombre = nombre;
  product.setCantidad = Number(cantidad);
  product.setCostoUnitario = Number(costo_unitario);
  product.setCostoTotal = costo_total;
  delete product.id_producto;
  console.table(product);

  await saveProduct(req, product);
  console.log("After product");
  res.redirect("/products");
};

const getProducts = async (req, res) => {
  const errors = [];

  await new Promise((resolve, reject) => {
    req.getConnection((err, conn) => {
      conn.query("SELECT * FROM producto", (err, rs) => {
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
  const { accion, articulo } = req.body;
  console.log("Making action ===================== ", accion);

  if (articulo === "Artículo") {
    req.flash("error_msg", "Seleccione un artículo");
    return res.redirect("/kardex");
  } else {
    if (accion)
      accion === "compra" ? makePurchase(req, res) : makeSale(req, res);
  }
};

const makePurchase = async (req, res) => {
  console.log("Making purchase =============================================");
  const { cantidad, costo_unitario, costo_total, articulo } = req.body;
  console.log(req.body);
  const { id_detalle, nombre_detalle } = await searchDetail(req, "compra");
  console.log("After search detail");
  var {
    id_producto,
    nombre_producto,
    cantidad_producto,
    costo_unitario_producto,
    costo_total_producto
  } = await searchProduct(req, articulo);
  console.log("After search product");

  detalle = new Detalle(id_detalle, nombre_detalle);
  productoSQL = new Producto(
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

  kardex = new kardex(detalle, productoSQL);
  kardex.setEntradaCantidad = await saveKardex(req, detalle, productoSQL);
  delete productoSQL.id_producto;

  console.table(productoSQL);
  await updateProduct(req, productoSQL, id_producto);
  console.log("After Updating");
  res.redirect("/kardex");
};

const makeSale = async (req, res) => {
  console.log("Making sale =============================================");

  const { cantidad, costo_unitario, costo_total, articulo } = req.body;

  console.log(req.body);

  const { id_detalle, nombre_detalle } = await searchDetail(req, "venta");

  try {
    var {
      id_producto,
      nombre_producto,
      cantidad_producto,
      costo_unitario_producto,
      costo_total_producto
    } = await searchProduct(req, articulo);
  } catch (error) {
    console.log("Search product failed:", error);
  }

  detalle = new Detalle(id_detalle, nombre_detalle);
  //const producto = new Producto(cantidad, costo_unitario, costo_total, nombre);
  productoSQL = new Producto(
    nombre_producto,
    cantidad_producto,
    costo_unitario_producto,
    costo_total_producto,
    id_producto
  );

  console.log("Before changes");
  console.table(productoSQL);

  productoSQL.ventaCantidad(Number(cantidad));
  productoSQL.ventaTotal(Number(Number(costo_total).toFixed(2)));
  productoSQL.ventaUnitaria();

  console.log("After changes");
  console.table(productoSQL);

  if (productoSQL.cantidad_producto === 0) {
    deleteProduct(req, productoSQL, id_producto);
    return res.redirect("/kardex");
  }

  await updateProduct(req, productoSQL, id_producto);
  res.redirect("/kardex");
  //res.status(200).json({ detalle, productoSQL });
};

async function searchDetail(req, detail) {
  console.log("Searching detail", detail);
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

const apiSearchProduct = async (req, res) => {
  const { detail } = req.params;
  console.log("Api search product:", detail);
  productoSQL = await searchProduct(req, detail);
  res.status(200).json(productoSQL);
};

async function searchProduct(req, detail) {
  console.log("Searching product", detail);
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
  console.log("Updating product");
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

async function saveKardex(req, detail, product) {
  console.log("Updating kardex");

  await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(`INSERT INTO kardex Set`);
    });
  });
}

async function deleteProduct(req, product, id_producto) {
  console.log("Deleting product");
  await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `DELETE FROM producto WHERE id_producto = ? `,
        [id_producto],
        (err, rs) => {
          if (err) console.log(err);
          resolve(rs[0]);
        }
      );
    });
  });
}

async function saveProduct(req, product) {
  console.log("Saving product");
  console.table(product);
  await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(`INSERT INTO producto SET ?`, [product], (err, rs) => {
        if (err) console.log(err);
        console.log(rs);
        resolve(rs[0]);
      });
    });
  });
}

module.exports = {
  addProduct,
  makeAction,
  getKardex,
  getPeps,
  getProducts,
  getAbout,
  makePurchase,
  makeSale,
  apiSearchProduct
};
