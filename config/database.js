const port = process.env.PORT || 3000;
const app = require("../bin/WWW");

app.listen(port, () => {
  console.log(`Server's worKing on port ${port}`);
});

module.exports.mongoose = app;
