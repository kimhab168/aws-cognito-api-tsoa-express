import {
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  SignUpCommandInput,
  InitiateAuthCommandInput,
  ConfirmSignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@/configs/cognito.config";

// import { UserAuthModel } from "../models/userAuth";

class AuthService {
  //======================================================================
  //InitiateAuthCommand use to make command to request signIn with Cognito
  //======================================================================
  async signIn(params: InitiateAuthCommandInput) {
    const command = new InitiateAuthCommand(params);
    return await cognitoClient.send(command);
  }

  public async signUp(params: SignUpCommandInput) {
    try {
      const command = new SignUpCommand(params);
      return await cognitoClient.send(command);
    } catch (error) {
      throw error;
    }
  }

  async signUpConfirm(params: ConfirmSignUpCommandInput) {
    const command = new ConfirmSignUpCommand(params);
    return await cognitoClient.send(command);
  }
}
export default AuthService;
