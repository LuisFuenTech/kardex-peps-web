const app = require("express").Router();
const { pepsController } = require("./index");

app.get("/peps", pepsController.getPeps);

// API
app.get("/get-product/:detail", pepsController.apiSearchProduct);
app.get("/show/:articulo", pepsController.apiShowPeps);

//Post
app.post("/add-product", pepsController.addProduct);
app.post("/action", pepsController.makeAction);

module.exports = app;
