const app = require("express").Router();
const { pepsController } = require("./index");

app.get("/peps/:articulo?", pepsController.getPeps);
app.get("/products/:articulo?", pepsController.getProducts);

// API
app.get("/get-product/:detail", pepsController.apiSearchProduct);
app.get("/show/:articulo?", pepsController.apiShowPeps);
app.get("/get-products/:articulo?", pepsController.apiGetProducts);

//Post
app.post("/add-product", pepsController.addProduct);
app.post("/action", pepsController.makeAction);

module.exports = app;
