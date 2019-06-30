const getKardex = (req, res) => {
  const errors = [];

  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM inventario_db.producto", (err, rs) => {
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

const getPeps = (req, res) => {
  res.render("user/peps");
};

const getProducts = (req, res) => {
  res.render("user/show_products");
};

const getAbout = (req, res) => {
  res.render("user/about");
};

module.exports = {
  getKardex,
  getPeps,
  getProducts,
  getAbout
};
