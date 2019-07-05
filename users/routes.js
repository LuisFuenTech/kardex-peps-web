const app = require("express").Router();
const { userController } = require("./index");

//Client - Render views
app.get("/kardex/:articulo?", userController.getKardex);
app.get("/peps", userController.getPeps);
app.get("/products", userController.getProducts);
app.get("/about", userController.getAbout);

//API
app.get("/get-product/:detail", userController.apiSearchProduct);
app.get("/show/:articulo", userController.apiShowKardex);

//Post
app.post("/add-product", userController.addProduct);
app.post("/action", userController.makeAction);
app.post("/purchase", userController.makePurchase);
app.post("/sale", userController.makeSale);

module.exports = app;
