const app = require("express").Router();
const { userController } = require("./index");

//Client - Render views
app.get("/kardex", userController.getKardex);
app.get("/peps", userController.getPeps);
app.get("/products", userController.getProducts);
app.get("/about", userController.getAbout);

module.exports = app;
