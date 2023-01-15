import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import * as dotenv from "dotenv";
dotenv.config();
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minLength: 3,
      maxLength: 50
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email"
      ],
      unique: true
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minLength: 6
      // maxLength: 32
    }
  },
  {
    methods: {
      createJWT () {
        return jwt.sign(
          { userId: this._id, name: this.name },
          process.env.JWT_SECRET ?? "",
          {
            expiresIn: process.env.JWT_LIFETIME
          }
        );
      },
      async comparePassword (password: string) {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
      }
    }
  }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default model("User", UserSchema);
