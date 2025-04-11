import { CookieOptions } from "express";
import { SuccessResponse } from "../common/helpers/response";
import { statusCode } from "../common/helpers/statusCode";
import { ApiResponse } from "../common/utils/ApiResponse";
import { asyncHandler } from "../common/utils/asyncHandler";
import { UserService } from "../services/auth.service";

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = asyncHandler(async (req, res) => {
    const { username, email, password, image } = req.body; 
    const newUser = await this.userService.registerUser({ username, email, password, image });
    res
      .status(statusCode.Created)
      .json(new ApiResponse( statusCode.Created , newUser,  SuccessResponse.success ));
  });

  login = asyncHandler(async (req, res) => {
    const login = req.body; 
    const { user, accessToken } = await this.userService.login(login);

    const options : CookieOptions ={
      httpOnly: true,
      sameSite: "strict"
    }

    res
    .status(statusCode.Created)
      .cookie( "accessToken", accessToken, options )
    .json(new ApiResponse( statusCode.Created , {user, accessToken,}, SuccessResponse.success))
  });

  logout = asyncHandler(async (req, res) => {
    await this.userService.logout(); 
  
    res
      .status(statusCode.OK)
      .clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
      }) 
      .json(new ApiResponse(statusCode.OK, null, SuccessResponse.logoutSuccessfull)); 
  });
  

  getUsers = asyncHandler(async(req, res)=>{
    const users = await this.userService.getUsers()
    res.status(statusCode.Created).json( new ApiResponse(statusCode.Created, users, SuccessResponse.success))
  })

  getUserById = asyncHandler(async(req, res)=>{
    const id = req.params.id
    const user = await this.userService.getUserById(id)
    res.status(statusCode.Created).json(new ApiResponse(statusCode.Created, user, SuccessResponse.success))
  })

  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id; 
    const updates = req.body; 
    const updatedUser = await this.userService.updateProfile(userId, updates);
    res
      .status(statusCode.Created)
      .json(new ApiResponse(statusCode.Created, updatedUser, SuccessResponse.success));
  });

  deleteUser = asyncHandler(async(req, res)=>{
    const id = req.params.id
    const deleteUser = await this.userService.deleteUser(id)
    res.status(statusCode.Created).json(new ApiResponse(statusCode.Created, deleteUser, SuccessResponse.success))
  })

  requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;
  
    const responseMessage = await this.userService.requestPasswordReset(email);
  
    res
      .status(statusCode.Created)
      .json(new ApiResponse(statusCode.Created, null, responseMessage));
  });
  
  resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;
  
    const responseMessage = await this.userService.resetPassword({
      token: token,
      newPassword,
      confirmPassword,
    });
  
    res
      .status(statusCode.Created)
      .json(new ApiResponse(statusCode.Created, null, responseMessage));
  });
  
  
}
