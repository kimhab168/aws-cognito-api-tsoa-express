// src/controllers/product.controller.ts
import { Controller, Route, Body, Post, Tags, Get, Queries } from "tsoa";
import { UserAuthService } from "@/services/userAuth.service";
import {
  GetUserCommand,
  GetUserCommandInput,
  GetUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@/configs/cognito.config";
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

async function getUserDetail(
  accessToken: string
): Promise<GetUserCommandOutput | undefined> {
  if (!accessToken) {
    console.log("no acceess Token found");
    return undefined;
  }

  const params: GetUserCommandInput = {
    AccessToken: accessToken,
  };
  try {
    const command = new GetUserCommand(params);

    const userData = await cognitoClient.send(command); //bug: fix
    console.log("hi 2");
    return userData;
  } catch (error) {
    console.log("error get detail with accesstoken");
  }
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
    try {
      console.log("signup controller");

      return await this.userAuthService.signUp(
        reqBody.username,
        reqBody.password,
        reqBody.email
      );
    } catch (error) {
      throw error;
    }
  }
  @Post("signin")
  async signIn(@Body() reqBody: SignInRequest) {
    try {
      return await this.userAuthService.signIn(
        reqBody.username,
        reqBody.password
      );
    } catch (error) {
      throw error;
    }
  }
  @Post("confirm-signup")
  async confirmSignUp(@Body() reqBody: ConfirmSignUpRequest) {
    try {
      return await this.userAuthService.confirmSignUp(
        reqBody.username,
        reqBody.confirmationCode
      );
    } catch (error) {
      throw error;
    }
  }
  @Get("viewUser/{token}")
  async viewUserData(@Queries() qry: { token: string }) {
    try {
      return await getUserDetail(qry.token);
    } catch (error) {
      throw error;
    }
  }
}
