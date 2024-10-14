// google-auth.service.ts
// import { URLSearchParams } from "url";
// import configs from "@/config"; // Adjust the import path as necessary

import configs from "@/config";
import axios from "axios";

export class googleAuthToken {
  async getTokenFromCognito(code: string) {
    try {
      const token = await fetchAccessToken(code);
      // console.log(token);

      return token;
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error; // Re-throw the error for further handling
    }
  }
}

async function fetchAccessToken(authorizationCode: string) {
  const url =
    "https://auth-with-hab.auth.us-east-1.amazoncognito.com/oauth2/token";

  // Base64 encode client_id:client_secret for Authorization header
  const clientId = `${configs.COGNITO_CLIENT_ID}`;
  const clientSecret = `${configs.COGNITO_CLIENT_SECRET}`;
  const authString = `${clientId}:${clientSecret}`;
  const encodedAuth = Buffer.from(authString).toString("base64");

  // Create the request headers
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${encodedAuth}`,
  };

  // Construct the request body parameters
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code: authorizationCode, // Replace this with the actual authorization code you received
    redirect_uri: "http://localhost:3000/google-auth/token", // Replace this with the redirect URI registered in Cognito
  });

  try {
    // Make the POST request to the /oauth2/token endpoint
    const response = await axios.post(url, body.toString(), {
      headers: headers,
    });
    // console.log("Access Token Response:", response.data);
    return response.data; // Return the token response
  } catch (error) {
    throw error;
  }
}
