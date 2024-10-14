// google-auth.controller.ts
import { googleAuthToken } from "@/services/google-auth.service"; // Adjust path as necessary
import { loginWithGoogle } from "@/utils/getUserToken";
import { Controller, Route, Tags, Get, Request } from "tsoa";
import express from "express";
import { setCookie } from "@/utils/cookies";
@Route("google-auth/token")
@Tags("Google Auth")
export class googleAuthCallback extends Controller {
  private GoogleAuthToken: googleAuthToken;

  constructor() {
    super();
    this.GoogleAuthToken = new googleAuthToken();
  }

  @Get()
  async getTokenGoogle(@Request() req: express.Request) {
    try {
      const code = req.query.code as string;
      // const state = req.query.state as string;
      const token = await this.GoogleAuthToken.getTokenFromCognito(code);
      const response = req.res as express.Response;
      setCookie(response, token);
      return { message: "Success Logged in!" };
    } catch (error) {}
  }
  @Get("link")
  async getLink() {
    try {
      return await loginWithGoogle();
    } catch (error) {}
  }
}
