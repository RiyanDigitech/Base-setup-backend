import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../common/types/auth.types";



const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    passwordTokenExpiry: {
      type: String,
      required: false,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      required: false,
      trim: true,
    },
    accessToken: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    
  if (!this.password) {
      throw new Error("Password not set on user document");
  }
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function (): Promise<
  string | undefined
> {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.Email,
      role: this.roles,
    },
    process.env.ACCESS_TOKEN as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string,
    }
  );
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
