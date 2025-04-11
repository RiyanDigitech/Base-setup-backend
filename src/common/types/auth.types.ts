import { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    image?: string;
    role: "user" | "admin";
    password: string;
    passwordTokenExpiry?: Date | unknown ;
    resetPasswordToken?: string;
    accessToken?: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): Promise<string>;
  }