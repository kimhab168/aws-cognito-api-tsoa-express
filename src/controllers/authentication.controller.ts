// src/controllers/product.controller.ts
import { Controller, Route, Body, Post, Tags } from "tsoa";
import { UserAuthService } from "@/services/userAuth.service";
// import userAuthService from "@/services/userAuth.service";

interface SignUpRequest {
  username: string;
  password: string;
  email: string;
}

interface SignInRequest {
  username: string;
  password: string;
}

interface ConfirmSignUpRequest {
  username: string;
  confirmationCode: string;
}

@Route("auth")
@Tags("Auth")
export class AuthenController extends Controller {
  private userAuthService: UserAuthService;

  constructor() {
    super(); //Controller inherit
    this.userAuthService = new UserAuthService();
  }
  @Post("signup")
  async signUp(@Body() reqBody: SignUpRequest) {
    return await this.userAuthService.signUp(
      reqBody.username,
      reqBody.password,
      reqBody.email
    );
  }
  @Post("signin")
  async signIn(@Body() reqBody: SignInRequest) {
    return await this.userAuthService.signIn(
      reqBody.username,
      reqBody.password
    );
  }
  @Post("confirm-signup")
  async confirmSignUp(@Body() reqBody: ConfirmSignUpRequest) {
    return await this.userAuthService.confirmSignUp(
      reqBody.username,
      reqBody.confirmationCode
    );
  }
}
