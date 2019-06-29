const app = require("express").Router();
const { auth } = require("../services/index");
const { userController } = require("./index");

//Client - Render views
app.get("/register", userController.viewRegister);
app.get("/login", userController.viewLogin);
app.get("/update-user", userController.viewUpdate);
app.get("/users", userController.viewGetUsers);
app.get("/set-card/:id?", userController.viewSetCard);
app.get("/update-card/:id?", userController.viewUpdateCard);
app.get("/profile/:id?", userController.viewUser);

//API - Show data -> response json
app.get("/get-user/:id", auth.ensureAuth, userController.getUser);
app.get("/get-all-users", auth.ensureAuth, userController.getUsers);
app.get("/logout", userController.logoutUser);

//API - Save and modify data -> response json
app.post("/register", userController.registerUser);
app.post("/login", userController.loginPassport);
app.put("/update-user", auth.ensureAuth, userController.updateUser);
app.post("/set-card/:userId", auth.ensureAuth, userController.setCard);
app.put("/update-card", auth.ensureAuth, userController.updateCard);
app.delete("/delete-card", auth.ensureAuth, userController.deleteCard);

module.exports = app;
