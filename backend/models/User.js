const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.statics.register = async function (username, email, password) {
  const existingUser = await this.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  let genSalt = await bcrypt.genSalt();
  let hashValue = await bcrypt.hash(password, genSalt);

  const user = await this.create({ username, email, password: hashValue });

  return user;
};

UserSchema.statics.login = async function (email, password) {
  let user = await this.findOne({ email });

  if (!user) {
    throw new Error("User doesn't exist");
  }

  let isCorrect = await bcrypt.compare(password, user.password);

  if (isCorrect) {
    return user;
  } else {
    throw new Error("Incorrect password");
  }
};
module.exports = mongoose.model("User", UserSchema);
