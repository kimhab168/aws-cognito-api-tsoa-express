import {
  // InitiateAuthCommand,
  InitiateAuthCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
// import { cognitoClient } from "@/configs/cognito.config";
import { UserAuthModel } from "../models/userAuth";

// import { UserAuthModel } from "../models/userAuth";

class AuthService {
  //======================================================================
  //InitiateAuthCommand use to make command to request signIn with Cognito
  //======================================================================
  async signIn(_params: InitiateAuthCommandInput) {
    // const command = new InitiateAuthCommand(params);
    // const res = await cognitoClient.send(command);
    // return res;
  }

  public async signUp(data: {
    email: string | undefined;
    password: string | undefined;
  }) {
    try {
      await UserAuthModel.create(data);
      return {
        message: "Created Succees",
      };
    } catch (error) {
      throw error;
    }
  }

  async signUpConfirm(data: {
    username: string | undefined;
    password: string | undefined;
  }) {
    try {
      await UserAuthModel.create(data);
    } catch (error) {}
  }
}
export default AuthService;
