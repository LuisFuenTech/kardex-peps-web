if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { database } = require("./config/index");
