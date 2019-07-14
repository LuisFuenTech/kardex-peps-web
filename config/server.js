const port = process.env.PORT || 8080;
const app = require("../bin/WWW");

const server = app.listen(port, () => {
  console.log(`Server's worKing on port ${port}`);
});

module.exports = server;
