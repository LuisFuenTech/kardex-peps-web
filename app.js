//Dependencies
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const app = express();
const path = require("path");
const expHbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const navbarData = require("./data/nav-bar");
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const port_sql = process.env.PORT_SQL || 3306;
const dbUrl = process.env.MONGODB_URL;

//Routes
const { userRoutes } = require("./users/index");

//Settings
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  expHbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");

//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "my_own_secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(
  myConnection(
    mysql,
    {
      host: "bkw1eve2degduneprzqb-mysql.services.clever-cloud.com",
      port: 3306,
      user: "ulzpcaupn2k67g5p",
      password: "nYbIFrkp81DumLIMrOvh",
      database: "bkw1eve2degduneprzqb"
    },
    "single"
  )
);

app.use(flash());

//Local variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.navbar_data = navbarData;
  next();
});

//Statics files
app.use(express.static(path.join(__dirname, "public")));

//Cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-Auth-Token, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Expose-Headers", "Authorization, X-Auth-Token");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use(userRoutes);

module.exports = app;
