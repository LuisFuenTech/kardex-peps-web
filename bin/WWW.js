const app = require("../app");

var port = process.env.PORT;
app.set("port", port);

module.exports = app;
