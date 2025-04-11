import { UserRepository } from "../common/helpers/repository";
import { ErrorResponse, SuccessResponse } from "../common/helpers/response";
import { sendEmail } from "../common/helpers/sendEmail";
import { statusCode } from "../common/helpers/statusCode";
import {
  resetPasswordSchema,
  UserLoginSchema,
  userRegistrationSchema,
  UserUpdateSchema,
} from "../common/types/generals";
import { ApiError } from "../common/utils/ApiError";
import crypto from "crypto";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser({username, email,password, image   }: userRegistrationSchema) {
    const existingUser = await this.userRepository.findByEmail(email!);

    if (existingUser) {
      throw new ApiError(
        statusCode.UnAuthorized,
        ErrorResponse.emailAlreadyExists
      );
    }

   

    const newUser = await this.userRepository.create({
      username,
      email,
      password,
      image,
    });

    return newUser;
  }

  async login(login: UserLoginSchema) {
    const { email, password } = login;

    if (!email || !password) {
      throw new ApiError(
        statusCode.UnAuthorized,
        ErrorResponse.invalidUserCredentials
      );
    }
    const user = await this.userRepository.findByEmail(email);

    if (!user || !(await user.isPasswordCorrect(password))) {
      throw new ApiError(
        statusCode.UnAuthorized,
        ErrorResponse.invalidUserCredentials
      );
    }

    const accessToken = await user.generateAccessToken();

    return { user, accessToken };
  }

  async logout (){
      return SuccessResponse.logoutSuccessfull
  }

  async getUsers() {
    const user = await this.userRepository.findAll();
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async updateProfile(id: string, updates: UserUpdateSchema) {
    const { username, email, password, image } = updates;
  
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ApiError(statusCode.NotFound, ErrorResponse.userNotExists);
    }
  
    if (email && email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new ApiError(
          statusCode.UnAuthorized,
          ErrorResponse.emailAlreadyExists
        );
      }
    }
  
    if (username) user.username = username;
    if (email) user.email = email;
    if (image) user.image = image;
  
    
    if (password) {
      user.password = password; 
    }
  
    await user.save(); 
  
    return user;
  }
  

  async deleteUser(id: string) {
    const user = await this.userRepository.findByIdAndDelete(id);
    if (!user)
      throw new ApiError(statusCode.NotFound, ErrorResponse.userNotExists);
    return user;
  }

  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user)
      throw new ApiError(statusCode.NotFound, ErrorResponse.userNotExists);

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.passwordTokenExpiry = new Date(Date.now() + 3600000); 
    await user.save();

    await sendEmail(user.email, resetToken);

    return SuccessResponse.passwordResetEmailSent;
  }

  async resetPassword(resetPassword : resetPasswordSchema) {
    const { token, newPassword, confirmPassword } = resetPassword

    if(!token) throw new ApiError(statusCode.NotFound, ErrorResponse.tokenIsExpired)
    if(newPassword !== confirmPassword) throw new ApiError(statusCode.BadRequest, ErrorResponse.PasswordNotMatch)


    const user = await this.userRepository.findOne({
      resetPasswordToken: token,
      passwordTokenExpiry: { $gt: new Date() as any }, 
    });
  
    if (!user) {
      throw new ApiError(statusCode.BadRequest, ErrorResponse.invalidOrExpiredResetToken);
    }

    if(newPassword !== confirmPassword ){
      throw new ApiError(statusCode.Conflict, ErrorResponse.PasswordNotMatch)
    }
  
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.passwordTokenExpiry = undefined;
  
    await user.save();
  
    return SuccessResponse.passwordResetSuccessful;
  }
  
}
