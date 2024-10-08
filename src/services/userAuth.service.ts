import AuthRepository from "@/database/repositories/userAuth.repository";
import configs from "@/config";
import {
  SignUpCommandInput,
  InitiateAuthCommandInput,
  ConfirmSignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";

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
    const params: SignUpCommandInput = {
      ClientId: configs.COGNITO_CLIENT_ID!,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
      SecretHash: this.calculateSecretHash(username),
    };
    return await this.authRepository.signUp(params);
  }

  async signIn(username: string, password: string) {
    const params: InitiateAuthCommandInput = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: configs.COGNITO_CLIENT_ID!,

      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: this.calculateSecretHash(username),
      },
    };
    return await this.authRepository.signIn(params);
  }

  async confirmSignUp(username: string, confirmCode: string) {
    const params: ConfirmSignUpCommandInput = {
      ClientId: configs.COGNITO_CLIENT_ID!,
      Username: username,
      ConfirmationCode: confirmCode,
      SecretHash: this.calculateSecretHash(username),
    };

    return await this.authRepository.signUpConfirm(params);
  }
}

export default new UserAuthService();
