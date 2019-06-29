const { User } = require("./index");
const { CardUser } = require("../card-user/index");
const { Card } = require("../card/index");
const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");
const { jwt } = require("../services/index");
const moment = require("moment");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const registerUser = async (req, res) => {
  const { name, surname, email, password, conf_password } = req.body;
  const errors = [];

  if (!name) errors.push({ error: "Please write a name" });
  if (!surname) errors.push({ error: "Please write a surname" });
  if (!email) errors.push({ error: "Please write an email" });
  if (!password) errors.push({ error: "Please write a password" });
  if (password !== conf_password)
    errors.push({ error: `Passwords don't match` });

  if (errors.length > 0) {
    res.render("user/register", {
      errors,
      name,
      surname,
      email,
      password
    });
  } else {
    await User.findOne({ email: email.toLowerCase() })
      .then(user => {
        if (user) {
          errors.push({ error: "User already exists" });
          return res.render("user/register", {
            errors,
            name,
            surname,
            email,
            password
          });
        }

        const hour = moment()
          .subtract("5", "hours")
          .format("HH:mm:ss");
        const date = moment()
          .subtract("5", "hours")
          .format("MMM DD YYYY");

        const newUser = new User({
          name,
          surname,
          email,
          nodemcu: mongoose.Types.ObjectId(),
          createdAt: `${date} ${hour}`
        });

        newUser.password = newUser.encryptPassword(password);

        newUser.save().then((saved, err) => {
          if (err)
            return res.status(400).send({ Error: "User did not register" });

          saved.password = undefined;
          if (saved) {
            req.flash("success_msg", "User registered successfully");
            return res.redirect("/user/login");
          }
        });
      })
      .catch(err =>
        res.status(500).send({ message: `Error on query: ${err}` })
      );
  }
};

const viewRegister = (req, res) => {
  res.render("user/register");
};

const loginPassport = passport.authenticate("local", {
  sucessRedirect: "/",
  failureRedirect: "/user/login",
  failureFlash: true
});

const loginUser = async (req, res) => {
  const { email, password, getToken } = req.body;
  console.log("TCL: loginUser -> req.body", req.body);
  const errors = [];

  if (!email) errors.push({ error: "Please write an email" });
  if (!password) errors.push({ error: "Please write a password" });

  if (errors.length > 0) {
    console.log("TCL: loginUser -> errors", errors);
    res.render("user/login", {
      errors,
      email,
      password
    });
  } else {
    console.log("User.findOne");
    User.findOne({ email: email })
      .then((user, err) => {
        console.log("TCL: loginUser -> err", err);
        console.log("TCL: loginUser -> user", user);
        console.log("After User.findOne");
        if (err) return res.status(400).json({ Error: "Error on query" });
        if (user) {
          const hasMatched = user.matchPassword(password);
          console.log("TCL: loginUser -> hasMatched", hasMatched);

          if (hasMatched) {
            //Token
            if (getToken) {
              const token = jwt.createToken(user);
              return res.status(200).json(token);
            }
            return res.status(200).send({ msg: "Token dont given" });
          } else {
            errors.push({ error: "User don't match" });
            return res.render("user/login", {
              errors,
              email,
              password
            });
          }
        } else {
          errors.push({ error: "User don't match" });
          return res.render("user/login", {
            errors,
            email,
            password
          });
        }
      })
      .catch(err =>
        res.status(503).json({ message: `Error on query: ${err}` })
      );
  }
};

const viewLogin = (req, res) => {
  res.render("user/login");
};

const getUser = async (req, res) => {
  const { id } = req.params;

  await User.findById(id)
    .populate("nodemcu", "serial status")
    .then(user => {
      user.password = undefined;
      if (user) return res.status(200).json(user);
      else return res.status(404).send({ Error: `User doesn't exist` });
    })
    .catch(err => {
      res.status(500).send({ Alert: `Error on query`, Error: err });
    });
};

const viewUser = async (req, res) => {
  const { id } = req.params;
  console.log("TCL: viewUser -> id", id);
  return res.render("user/profile", { _id: id });
};

const viewGetUsers = (req, res) => {
  res.render("user/get-users");
};

const getUsers = async (req, res) => {
  console.log("TCL: getUsers -> req.user", req.user);
  await User.find({})
    .populate("nodemcu")
    .then(users => {
      if (users.length > 0) return res.status(200).json(users);
      else return res.status(404).json({ Error: `No users` });
    })
    .catch(err => res.status(400).json({ Error: err }));
};

const viewUpdate = async (req, res) => {
  const { id } = req.params;

  await User.findOne({ _id: id })
    .then(user => {
      if (user) return res.render("user/form", { user });
      return res.status(400).send({ Error: "Not found" });
    })
    .catch(err => res.status(400).send({ Error: err }));
};

const updateUser = async (req, res) => {
  const { _id } = req.body;
  const toUpdate = req.body;
  const errors = [];

  if (!toUpdate.name) errors.push({ error: "Please write a name" });
  if (!toUpdate.surname) errors.push({ error: "Please write a surname" });
  if (!toUpdate.email) errors.push({ error: "Please write an email" });
  if (errors.length > 0) {
    res.render("user/form", {
      errors,
      user: toUpdate
    });
  } else {
    await User.findByIdAndUpdate(
      _id,
      toUpdate,
      { new: true },
      (err, userUpdated) => {
        if (err)
          return res.status(400).send({ Error: `Error updating: ${err}` });
        if (userUpdated) {
          req.flash("success_msg", "User updated successfully");
          return res.redirect(`profile/${_id}`);
        }
      }
    ).catch(err => res.status(400).send({ Error: err }));
  }
};

const getNodemcu = (req, res) => {};

const viewSetCard = (req, res) => {
  const { id } = req.params;
  res.render("card/add-card-user", { user: id });
};

const setCard = async (req, res) => {
  const { userId } = req.params;
  const { code } = req.body;
  const errors = [];

  if (!code) errors.push({ error: "Please write a code" });

  if (errors.length > 0) {
    return res.render("card/add-card-user", { errors, code, user: userId });
  } else {
    const cardUpdated = await Card.findOneAndUpdate(
      { code: Number(code) },
      { isUsed: true },
      { new: true }
    );

    if (cardUpdated) {
      const hour = moment()
        .subtract("5", "hours")
        .format("HH:mm:ss");
      const date = moment()
        .subtract("5", "hours")
        .format("MMM DD YYYY");

      const cardUser = new CardUser({
        user: userId,
        card: cardUpdated._id,
        createdAt: `${date} ${hour}`
      });

      cardUser.save().then((saved, err) => {
        if (err) {
          errors.push({ error: err });
          return res.render("card/add-card-user", {
            errors,
            code,
            user: userId
          });
        }
        if (saved) {
          req.flash("success_msg", "Card added successfully");
          return res.redirect("/");
        }
      }); //End of cardUser
    }

    if (!cardUpdated) {
      errors.push({ error: "Card doesnt exist" });
      return res.render("card/add-card-user", {
        errors,
        code,
        user: userId
      });
    }
  }
};

const viewUpdateCard = async (req, res) => {
  const { id } = req.params;

  const card = await Card.findOne({ _id: id });

  if (card) return res.render("user/card-form", { card });
};

const updateCard = async (req, res) => {
  const { card_id, pin } = req.body;

  const cardUpdated = await Card.findByIdAndUpdate(
    card_id,
    { pin: pin },
    { new: true }
  );

  if (cardUpdated) {
    req.flash("success_msg", "Card updated successfully");
    return res.redirect("/");
  } else return res.status(400).send({ message: "Card didnt updated " });
};

const deleteCard = async (req, res) => {
  const { card_id } = req.body;

  const cardUpdated = await Card.findByIdAndUpdate(
    card_id,
    { isUsed: false },
    { new: true }
  );

  if (cardUpdated) {
    console.log("Card user deleted", cardUpdated);
    const cardDeleted = await CardUser.findOneAndDelete({ card: card_id });

    if (cardDeleted) {
      req.flash("success_msg", "Card deleted successfully");
      return res.redirect("/");
    } else {
      req.flash("error_msg", "Error Card deleting");
      return res.status(400).json({ Error: `Error deleting card` });
    }
  } else {
    req.flash("error_msg", "Error Card deleting");
    return res.status(400).json({ Error: `Error deleting card` });
  }
};

const logoutUser = (req, res) => {
  return res.render("index");
};

module.exports = {
  registerUser,
  loginUser,
  loginPassport,
  updateUser,
  getUser,
  getUsers,
  getNodemcu,
  setCard,
  updateCard,
  deleteCard,
  logoutUser,
  viewLogin,
  viewRegister,
  viewUpdate,
  viewSetCard,
  viewUser,
  viewGetUsers,
  viewUpdateCard
};
