const getKardex = (req, res) => {
  res.render("user/kardex");
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
