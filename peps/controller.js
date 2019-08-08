const { Producto, Detalle, Kardex } = require("../models/index");
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

const getProducts = async (req, res) => {
  const { articulo } = req.params;
  const errors = [];

  await new Promise((resolve, reject) => {
    req.getConnection((err, conn) => {
      conn.query(
        "SELECT DISTINCT nombre_producto FROM producto_peps",
        (err, rs) => {
          if (err) {
            errors.push({ error: "Error al actualizar la tabla" });
            return res.render("user/show_products_peps", { errors });
          }
          console.log("TCL: getProducts -> rs", rs);
          res.render("user/show_products_peps", { rs });
        }
      );
    });
  });
};

const apiGetProducts = async (req, res) => {
  const { articulo } = req.params;
  const errors = [];

  await new Promise((resolve, reject) => {
    req.getConnection((err, conn) => {
      conn.query(
        `
      SELECT nombre_producto, cantidad_producto 
      FROM producto_peps
      WHERE nombre_producto = ? 
      AND cantidad_producto > 0`,
        [articulo],
        (err, rs) => {
          if (err) {
            errors.push({ error: "Error al actualizar la tabla" });
            return res.render("user/show_products", { errors });
          }
          res.status(200).json(rs);
          resolve();
        }
      );
    });
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
    return res.redirect("/peps/peps");
  }
};

const makeSale = async (req, res) => {
  console.log("Making sale ==>");
  const { cantidad, articulo } = req.body;
  console.log("TCL: req.body", req.body);
  const { id_detalle, nombre_detalle } = await searchDetail(req, "venta");

  try {
    var products = await searcProducts(req, articulo);
    var { total_costos } = await sumProducts(req, articulo);
    console.log("TCL: total_costos", total_costos);
  } catch (error) {}

  detalle = new Detalle(id_detalle, nombre_detalle);

  var { total_productos_costo } = await sumTotalProducts(req, articulo);

  var cantidadRestante = Number(cantidad);
  var cantidadAVender = Number(cantidad);
  var ventaTotal = 0;

  console.log("Antes de for");
  for (let [index, product] of products.entries()) {
    console.log(`TCL: product ${index}`, product);

    if (Number(product.cantidad_producto) - cantidadAVender < 0) {
      console.log("total_costos en =======> <0", total_costos);
      let cantidad_producto = product.cantidad_producto;

      cantidadRestante =
        (Number(product.cantidad_producto) - cantidadAVender) * -1;

      cantidadAVender = cantidadRestante;
      ventaTotal = product.cantidad_producto * product.costo_unitario_producto;
      total_costos -= ventaTotal;

      product.cantidad_producto = 0;

      kardex = new Kardex(detalle, product);
      kardex.setSalidaCantidad = cantidad_producto;
      kardex.setSalidaUnitario = Number(product.costo_unitario_producto);
      kardex.setSalidaTotal = ventaTotal;
      kardex.setSaldo = total_costos;
      console.log("TCL: kardex if:", kardex);

      Promise.all([
        updateProduct(req, product, product.id_producto),
        saveKardex(req, kardex)
      ])
        .then(() => {
          res.redirect(`/peps/peps/${articulo}`);
        })
        .catch(e => {
          console.error("Hola Guapo", e);
        });
    } else {
      console.log("total_costos en =======> >=0", total_costos);
      cantidadRestante = Number(product.cantidad_producto) - cantidadAVender;
      ventaTotal = cantidadAVender * Number(product.costo_unitario_producto);
      /* try {
        total_productos_costo -= ventaTotal;
      } catch (error) {
        console.log("total_productos_costo:", error);
      } */

      product.cantidad_producto = cantidadRestante;
      product.costo_total_producto =
        Number(product.costo_unitario_producto) * cantidadRestante;

      if (cantidadRestante == 0) {
        product.cantidad_producto = 0;
        kardex = new Kardex(detalle, product);
        kardex.setSalidaCantidad = cantidad;
        kardex.setSalidaUnitario = Number(product.costo_unitario_producto);
        kardex.setSalidaTotal = ventaTotal;
        kardex.setSaldo = total_costos - ventaTotal;

        console.log("TCL: kardex", kardex);

        Promise.all([
          updateProduct(req, product, product.id_producto),
          saveKardex(req, kardex)
        ])
          .then(() => {
            //res.redirect(`/peps/peps/${articulo}`);
            console.log("Break correcto");
          })
          .catch(e => {
            console.error("Break de error");
          });
      } else {
        kardex = new Kardex(detalle, product);
        kardex.setSalidaCantidad = cantidadAVender;
        kardex.setSalidaUnitario = Number(product.costo_unitario_producto);
        kardex.setSalidaTotal = ventaTotal;
        kardex.setSaldo = total_costos - ventaTotal;
        Promise.all([
          updateProduct(req, product, product.id_producto),
          saveKardex(req, kardex)
        ])
          .then(() => {
            //res.redirect(`/peps/peps/${articulo}`);
            console.log("Break correcto");
          })
          .catch(e => {
            console.error("Break de error");
          });
      }
      break;
    }
  }

  console.log("Después de for");
  res.redirect(`/peps/peps/${articulo}`);
};

const makePurchase = async (req, res) => {
  console.log("Making purchase ==>");
  const { cantidad, costo_unitario, costo_total, articulo } = req.body;
  const { id_detalle, nombre_detalle } = await searchDetail(req, "compra");

  if (isNaN(cantidad) || isNaN(costo_unitario) || isNaN(costo_total)) {
    req.flash("error_msg", "Ingrese números válidos");
    return res.redirect("/peps/peps");
  } else {
    try {
      var { id_producto, nombre_producto } = await searchProduct(req, articulo);

      var { total_productos, total_costos } = await sumProducts(req, articulo);
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

    kardex = new Kardex(detalle, productoSQL);
    kardex.setEntradaCantidad = cantidad;
    kardex.setEntradaUnitario = costo_unitario;
    kardex.setEntradaTotal = costo_total;
    kardex.setSaldo = Number(total_costos) + Number(costo_total);

    Promise.all([
      await saveKardex(req, kardex),
      await saveProduct(req, productoPeps)
    ])
      .then(() => {
        res.redirect(`/peps/peps/${articulo}`);
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

      res.redirect(`/peps/products/${nombre}`);
    }
  } else {
    req.flash("error_msg", "Llene todos los campos");
    return res.redirect("/peps/products");
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
        `SELECT * FROM producto_peps WHERE nombre_producto = ? ORDER by fecha ASC, hora ASC`,
        [detail],
        (err, rs) => {
          if (err) console.log(err);
          console.log("Tamaño rs:", rs);
          resolve(rs[rs.length - 1]);
        }
      );
    });
  });
}

async function searchProductAsc(req, detail) {
  console.log("Searching product", detail);
  return await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `SELECT * FROM producto_peps 
        WHERE nombre_producto = ? 
        AND cantidad_producto > 0 
        ORDER by fecha ASC, hora ASC`,
        [detail],
        (err, rs) => {
          if (err) console.log(err);
          console.log("Tamaño rs:", rs);
          resolve(rs[0]);
        }
      );
    });
  });
}

async function searcProducts(req, detail) {
  console.log("Searching product", detail);
  return await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `SELECT * FROM producto_peps 
        WHERE nombre_producto = ? 
        AND cantidad_producto > 0 
        ORDER by fecha ASC, hora ASC`,
        [detail],
        (err, rs) => {
          if (err) {
            console.log(err);
            reject();
          }
          resolve(rs);
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
        `SELECT SUM(cantidad_producto) AS total_productos, 
          SUM(costo_total_producto) AS total_costos 
          FROM producto_peps 
          WHERE nombre_producto = ?
          AND cantidad_producto > 0`,
        [detail],
        (err, rs) => {
          if (err) console.log(err);
          resolve(rs[0]);
        }
      );
    });
  });
}

async function sumTotalProducts(req, detail) {
  console.log("Searching product", detail);
  return await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `SELECT SUM(costo_unitario_producto) AS total_productos_costo 
        FROM producto_peps 
        WHERE nombre_producto = ?`,
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
      hora = (SELECT CURTIME()), ?`,
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
              hora = (SELECT CURTIME()), 
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
        ORDER by kardex_peps.fecha ASC, kardex_peps.hora ASC`,
      [articulo.toLowerCase()],
      (err, rs) => {
        if (err) {
          errors.push({ error: "Error al actualizar la tabla" });
          console.log("Error al actualizar la tabla:", err);
          return res.render("user/peps", { errors });
        }
        res.status(200).json(rs);
      }
    );
  });
};

const apiSearchProduct = async (req, res) => {
  const { detail } = req.params;
  console.log("Api search product peps:", detail);
  productoSQL = await searchProductAsc(req, detail);
  res.status(200).json(productoSQL);
};

async function deleteProduct(req, id_producto) {
  console.log("Deleting product");
  await new Promise((resolve, reject) => {
    req.getConnection(async (err, conn) => {
      conn.query(
        `DELETE FROM producto_peps WHERE id_producto = ? `,
        [id_producto],
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
        `UPDATE producto_peps SET ? WHERE id_producto = ? `,
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
  getPeps,
  getProducts,
  addProduct,
  makeAction,
  apiShowPeps,
  apiSearchProduct,
  apiGetProducts
};
