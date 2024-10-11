import AuthRepository from "@/database/repositories/userAuth.repository";
import configs from "@/config";
import {
  SignUpCommandInput,
  InitiateAuthCommandInput,
  ConfirmSignUpCommandInput,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  GetUserCommandOutput,
  GetUserCommandInput,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { cognitoClient } from "@/configs/cognito.config";
import { ResourceConflictError } from "@/utils/errors";

export class UserAuthService {
  private authRepository: AuthRepository;
  constructor() {
    this.authRepository = new AuthRepository();
  }
  private async getUserDetail(
    accessToken: string | undefined
  ): Promise<GetUserCommandOutput | undefined> {
    const params: GetUserCommandInput = {
      AccessToken: accessToken,
    };
    try {
      const command = new GetUserCommand(params);
      const userData = await cognitoClient.send(command);
      return userData;
    } catch (error) {
      console.log("error get detail with accesstoken");
    }
  }

  private calculateSecretHash(username: string): string {
    return createHmac("sha256", configs.COGNITO_CLIENT_SECRET!)
      .update(username + configs.COGNITO_CLIENT_ID!)
      .digest("base64");
  }

  public async signUp(username: string, password: string, email: string) {
    try {
      console.log("signup service");
      const params: SignUpCommandInput = {
        ClientId: configs.COGNITO_CLIENT_ID!,
        Username: username,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }],
        SecretHash: this.calculateSecretHash(username),
      };
      console.log("signup service command");
      console.log(params);

      const command = new SignUpCommand(params);
      const res = await cognitoClient.send(command);

      console.log(res);

      return {
        message: "User has been created!",
      };
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        throw new ResourceConflictError("User already exist!");
      }
      console.log("hi bro");

      throw error;
    }
  }

  async signIn(username: string, password: string) {
    try {
      const params: InitiateAuthCommandInput = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: configs.COGNITO_CLIENT_ID!,

        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          SECRET_HASH: this.calculateSecretHash(username),
        },
      };
      const command = new InitiateAuthCommand(params);
      const res = await cognitoClient.send(command);
      const dataUser = await this.getUserDetail(
        res.AuthenticationResult?.AccessToken
      );
      return dataUser;
    } catch (error) {
      throw error;
    }
  }

  async confirmSignUp(username: string, confirmCode: string) {
    try {
      const params: ConfirmSignUpCommandInput = {
        ClientId: configs.COGNITO_CLIENT_ID!,
        Username: username,
        ConfirmationCode: confirmCode,
        SecretHash: this.calculateSecretHash(username),
      };
      const command = new ConfirmSignUpCommand(params);
      const res = await cognitoClient.send(command);
      console.log(res);

      const data = {
        username: params.Username,
        password: params.SecretHash, ///not to store in DB
      };
      await this.authRepository.signUpConfirm(data);
      // return await this.authRepository.signUpConfirm(params);
      return { message: "Verified and saved to DB" };
    } catch (error) {
      throw error;
    }
  }
}

export default new UserAuthService();
