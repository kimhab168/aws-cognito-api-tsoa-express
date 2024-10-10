import AuthRepository from "@/database/repositories/userAuth.repository";
import configs from "@/config";
import {
  SignUpCommandInput,
  InitiateAuthCommandInput,
  ConfirmSignUpCommandInput,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { cognitoClient } from "@/configs/cognito.config";
import { ResourceConflictError } from "@/utils/errors";

export class UserAuthService {
  private authRepository: AuthRepository;
  constructor() {
    this.authRepository = new AuthRepository();
  }
  private calculateSecretHash(username: string): string {
    return createHmac("sha256", configs.COGNITO_CLIENT_SECRET!)
      .update(username + configs.COGNITO_CLIENT_ID!)
      .digest("base64");
  }

  public async signUp(username: string, password: string, email: string) {
    try {
      const params: SignUpCommandInput = {
        ClientId: configs.COGNITO_CLIENT_ID!,
        Username: username,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }],
        SecretHash: this.calculateSecretHash(username),
      };

      const command = new SignUpCommand(params);
      await cognitoClient.send(command);

      return {
        message: "User has been created!",
      };
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        throw new ResourceConflictError("User already exist!");
      }
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
      return res;
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
      await cognitoClient.send(command);
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
