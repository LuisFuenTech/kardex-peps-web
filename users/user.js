const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    nodemcu: { type: Schema.Types.ObjectId, ref: "Nodemcu", required: true },
    password: { type: String, required: true },
    createdAt: { type: String }
  },
  { versionKey: false }
);

userSchema.methods.encryptPassword = password => {
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return hash;
};

userSchema.methods.matchPassword = function(password) {
  const match = bcrypt.compareSync(password, this.password);
  return match;
};

module.exports = model("User", userSchema);
