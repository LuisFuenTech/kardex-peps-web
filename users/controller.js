const { Producto, Detalle, Kardex } = require("../models/index");
const { simulator } = require("../data/index");
let product = {};
let detalle = {};
let kardex = {};
let productoSQL = {};

const getKardex = (req, res) => {
  const { articulo } = req.params;
  const errors = [];

  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM producto", (err, rs) => {
      for (let [index, product] of rs.entries())
        if (product.nombre_producto == articulo) rs[index].selected = true;

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

const apiShowKardex = (req, res) => {
  console.log("API Kardex");
  const { articulo } = req.params;
  const errors = [];

  req.getConnection((err, conn) => {
    conn.query(
      `SELECT 
          DATE_FORMAT(kardex.fecha, "%d-%m-%Y") as fecha,
          detalle.nombre_detalle,
          kardex.entrada_cantidad,
          kardex.entrada_unitario,
          kardex.entrada_total,
          kardex.salida_cantidad,
          kardex.salida_unitario,
          kardex.salida_total,
          kardex.producto_cantidad,
          kardex.producto_unitario,
          kardex.producto_total
        FROM kardex
        INNER JOIN detalle
          ON detalle.id_detalle = kardex.id_detalle
        INNER JOIN producto
          ON producto.id_producto = kardex.id_producto
        WHERE producto.nombre_producto = ?
        ORDER by fecha, hora`,
      [articulo.toLowerCase()],
      (err, rs) => {
        if (err) {
          console.log("TCL: apiShowKardex -> err", err);
          errors.push({ error: "Error al actualizar la tabla" });
          return res.render("user/kardex", { errors });
        }

        return res.status(200).json(rs);
      }
    );
  });
};

const addProduct = async (req, res) => {
  console.log("Making saving");
  const { id_detalle, nombre_detalle } = await searchDetail(req, "compra");
  const { nombre, cantidad, costo_unitario } = req.body;

  if (nombre && cantidad && costo_unitario) {
    if (isNaN(cantidad) || isNaN(costo_unitario)) {
      req.flash("error_msg", "Ingrese números válidos");
      return res.redirect("/products");
    } else {
      product = new Producto();
      detalle = new Detalle(id_detalle, nombre_detalle);

      const costo_total = Number(cantidad) * Number(costo_unitario);

      product.setNombre = nombre.toLowerCase();
      product.setCantidad = Number(cantidad);
      product.setCostoUnitario = Number(costo_unitario);
      product.setCostoTotal = Number(costo_total);
      const sql = await saveProduct(req, product);
      product.setId = sql;

      kardex = new Kardex(detalle, product);
      await saveKardex(req, kardex);

      res.redirect("/products");
    }
  } else {
    req.flash("error_msg", "Llene todos los campos");
    return res.redirect("/products");
  }
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
        res.render("user/show_products");
        //res.status(200).json(rs);
        resolve();
      });
    });
  });
};

const apiGetProducts = async (req, res) => {
  const errors = [];

  await new Promise((resolve, reject) => {
    req.getConnection((err, conn) => {
      conn.query("SELECT * FROM producto", (err, rs) => {
        if (err) {
          errors.push({ error: "Error al actualizar la tabla" });
          return res.render("user/show_products", { errors });
        }
        res.status(200).json(rs);
        resolve();
      });
    });
  });
};

const getAbout = (req, res) => {
  res.render("user/about");
};

const makeAction = (req, res) => {
  const { accion, articulo, cantidad, costo_unitario, costo_total } = req.body;
  console.log("Making action ==> ", accion);

  if (cantidad && costo_unitario && costo_total) {
    if (articulo === "Artículo") {
      req.flash("error_msg", "Seleccione un artículo");
      return res.redirect("/kardex");
    } else {
      if (accion)
        accion === "compra" ? makePurchase(req, res) : makeSale(req, res);
    }
  } else {
    req.flash("error_msg", "Llene todos los campos");
    return res.redirect("/kardex");
  }
};

const makePurchase = async (req, res) => {
  console.log("Making purchase ==>");
  const { cantidad, costo_unitario, costo_total, articulo } = req.body;
  const { id_detalle, nombre_detalle } = await searchDetail(req, "compra");

  if (isNaN(cantidad) || isNaN(costo_unitario) || isNaN(costo_total)) {
    req.flash("error_msg", "Ingrese números válidos");
    return res.redirect("/kardex");
  } else {
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
    productoSQL = new Producto(
      nombre_producto,
      cantidad_producto,
      costo_unitario_producto,
      costo_total_producto,
      id_producto
    );

    productoSQL.compraCantidad(Number(cantidad));
    productoSQL.compraTotal(Number(Number(costo_total).toFixed(2)));
    productoSQL.compraUnitaria();

    kardex = new Kardex(detalle, productoSQL);
    kardex.setEntradaCantidad = cantidad;
    kardex.setEntradaUnitario = costo_unitario;
    kardex.setEntradaTotal = costo_total;

    Promise.all([
      await saveKardex(req, kardex),
      await updateProduct(req, productoSQL, id_producto)
    ])
      .then(() => {
        res.redirect(`/kardex/${articulo}`);
      })
      .catch(e => {
        console.error("Hola Guapo");
      });
  }
};

const makeSale = async (req, res) => {
  console.log("Making sale ==>");
  const { cantidad, costo_unitario, costo_total, articulo } = req.body;
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
  productoSQL = new Producto(
    nombre_producto,
    cantidad_producto,
    costo_unitario_producto,
    costo_total_producto,
    id_producto
  );

  productoSQL.ventaCantidad(Number(cantidad));
  productoSQL.ventaTotal(Number(Number(costo_total).toFixed(2)));
  productoSQL.ventaUnitaria();

  kardex = new Kardex(detalle, productoSQL);
  kardex.setSalidaCantidad = cantidad;
  kardex.setSalidaUnitario = costo_unitario;
  kardex.setSalidaTotal = costo_total;

  if (productoSQL.cantidad_producto === 0) {
    await saveKardex(req, kardex);

    return res.redirect("/kardex");
  }

  Promise.all([
    await saveKardex(req, kardex),
    await updateProduct(req, productoSQL, id_producto)
  ])
    .then(() => {
      res.redirect(`/kardex/${articulo}`);
    })
    .catch(e => {
      console.error("Hola guapo");
    });
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

async function saveKardex(req, kardex) {
  console.log("Saving kardex");

  await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `INSERT INTO kardex 
          SET fecha = (SELECT CURDATE()), 
              hora = (SELECT SUBTIME(CURTIME(), "5:0:0.0")), 
              ?`,
        [kardex],
        (err, rs) => {
          if (err) console.log(err);
          console.log("Kardex", rs);
          resolve();
        }
      );
    });
  });
}

function deleteProduct(req, product, id_producto) {
  console.log("Deleting product");
  return new Promise((resolve, reject) => {
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
  return await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(`INSERT INTO producto SET ?`, [product], (err, rs) => {
        if (err) console.log(err);
        resolve(rs.insertId);
      });
    });
  });
}

module.exports = {
  addProduct,
  makeAction,
  getKardex,
  getProducts,
  getAbout,
  makePurchase,
  makeSale,
  apiSearchProduct,
  apiShowKardex,
  apiGetProducts
};
