const app = require("express").Router();
const { pepsController } = require("./index");

app.get("/home", (req, res) => {
  res.status(200).send("Hola guapo de peps");
});

//Post
app.post("/add-product", pepsController.addProduct);
app.post("/action", pepsController.makeAction);

module.exports = app;
