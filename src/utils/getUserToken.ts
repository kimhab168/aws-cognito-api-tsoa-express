import { cognitoClient } from "@/configs/cognito.config";
import crypto from "crypto";
import {
  GetUserCommand,
  GetUserCommandInput,
  GetUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { URLSearchParams } from "url";
import configs from "@/config";

export async function getUserDetail(
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
export const loginWithGoogle = (state?: string) => {
  if (!state) state = crypto.randomBytes(16).toString("hex");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: configs.COGNITO_CLIENT_ID,
    redirect_uri: `${configs.REDIRECT_URL}`,
    identity_provider: "Google",
    scope: "profile email openid",
    state: state,
    prompt: "select_account",
  });
  const Url = `${configs.COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
  return Url;
};
