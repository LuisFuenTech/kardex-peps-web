const { Producto, Detalle, Kardex } = require("../models/index");
const { simulator } = require("../data/index");
let product = {};
let detalle = {};
let kardex = {};
let productoSQL = {};
let productoPeps = {};

const getPeps = (req, res) => {
  const { articulo } = req.params;
  const errors = [];

  req.getConnection((err, conn) => {
    conn.query(
      "SELECT DISTINCT nombre_producto FROM producto_peps",
      (err, rs) => {
        for (let [index, product] of rs.entries())
          if (product.nombre_producto == articulo) rs[index].selected = true;

        if (err) {
          errors.push({ error: "Error al actualizar la tabla" });
          return res.render("user/peps", { errors });
        }

        res.render("user/peps", {
          rs
        });
      }
    );
  });
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

      var { total_productos, total_costos } = await sumProducts(req, articulo);
      console.log("TCL: makePurchase -> total_costos", total_costos);
      console.log("TCL: makePurchase -> costo_total", costo_total);
    } catch (error) {
      console.log("Search product failed:", error);
    }

    detalle = new Detalle(id_detalle, nombre_detalle);
    productoSQL = new Producto(
      nombre_producto,
      cantidad,
      costo_unitario,
      costo_total,
      id_producto
    );

    productoPeps = new Producto(
      articulo,
      cantidad,
      costo_unitario,
      costo_total
    );

    productoSQL.compraCantidad(Number(total_productos));
    // productoSQL.compraTotal(Number(Number(costo_total).toFixed(2)));
    // productoSQL.compraUnitaria();

    kardex = new Kardex(detalle, productoSQL);
    kardex.setEntradaCantidad = cantidad;
    kardex.setEntradaUnitario = costo_unitario;
    kardex.setEntradaTotal = costo_total;
    kardex.setSaldo = Number(total_costos) + Number(costo_total);

    console.table(detalle);
    console.table(productoSQL);
    console.table(kardex);

    Promise.all([
      await saveKardex(req, kardex),
      await saveProduct(req, productoPeps)
    ])
      .then(() => {
        res.redirect(`/kardex/${articulo}`);
      })
      .catch(e => {
        console.error("Hola Guapo");
      });
  }
};

const addProduct = async (req, res) => {
  console.log("Making saving peps");
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
      kardex.setSaldo = Number(costo_total);

      await saveKardex(req, kardex);

      res.redirect("/products");
    }
  } else {
    req.flash("error_msg", "Llene todos los campos");
    return res.redirect("/products");
  }
};

async function searchDetail(req, detail) {
  console.log("Searching detail", detail);
  return await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `SELECT * FROM detalle_peps WHERE nombre_detalle = ?`,
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
  console.log("Searching product", detail);
  return await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `SELECT * FROM producto_peps WHERE nombre_producto = ? ORDER by fecha, hora`,
        [detail],
        (err, rs) => {
          if (err) console.log(err);
          resolve(rs[rs.length - 1]);
        }
      );
    });
  });
}

async function sumProducts(req, detail) {
  console.log("Searching product", detail);
  return await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `SELECT SUM(cantidad_producto) AS total_productos, SUM(costo_total_producto) AS total_costos FROM producto_peps WHERE nombre_producto = ?`,
        [detail],
        (err, rs) => {
          console.log("TCL: sumProducts -> rs", rs);
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
      conn.query(
        `INSERT INTO producto_peps SET fecha = (SELECT CURDATE()), 
      hora = (SELECT SUBTIME(CURTIME(), "5:0:0.0")), ?`,
        [product],
        (err, rs) => {
          if (err) console.log(err);
          resolve(rs.insertId);
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
        `INSERT INTO kardex_peps 
          SET fecha = (SELECT CURDATE()), 
              hora = (SELECT SUBTIME(CURTIME(), "5:0:0.0")), 
              ?`,
        [kardex],
        (err, rs) => {
          if (err) console.log(err);
          console.log("Kardex peps", rs);
          resolve();
        }
      );
    });
  });
}

const apiShowPeps = (req, res) => {
  const { articulo } = req.params;
  const errors = [];

  console.log("API Show Peps");

  req.getConnection((err, conn) => {
    conn.query(
      `SELECT 
          DATE_FORMAT(kardex_peps.fecha, "%d-%m-%Y") as fecha,
          detalle_peps.nombre_detalle,
          kardex_peps.entrada_cantidad,
          kardex_peps.entrada_unitario,
          kardex_peps.entrada_total,
          kardex_peps.salida_cantidad,
          kardex_peps.salida_unitario,
          kardex_peps.salida_total,
          kardex_peps.producto_cantidad,
          kardex_peps.producto_unitario,
          kardex_peps.producto_total,
          kardex_peps.saldo
        FROM kardex_peps
        INNER JOIN detalle_peps
          ON detalle_peps.id_detalle = kardex_peps.id_detalle
        INNER JOIN producto_peps
          ON producto_peps.id_producto = kardex_peps.id_producto
        WHERE producto_peps.nombre_producto = ?
        ORDER by producto_peps.fecha, producto_peps.hora`,
      [articulo.toLowerCase()],
      (err, rs) => {
        if (err) {
          errors.push({ error: "Error al actualizar la tabla" });
          console.log("Error al actualizar la tabla:", err);
          return res.render("user/peps", { errors });
        }

        console.log("TCL: apiShowPeps -> rs", rs);
        res.status(200).json(rs);
      }
    );
  });
};

module.exports = {
  getPeps,
  addProduct,
  makeAction,
  apiShowPeps
};
