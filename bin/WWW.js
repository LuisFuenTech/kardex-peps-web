const app = require("../app");

var port = process.env.PORT || 8080;
app.set("port", port);

module.exports = app;
