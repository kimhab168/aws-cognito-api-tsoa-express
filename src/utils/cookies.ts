import configs from "@/config";
import { CookieOptions, Response } from "express";
interface TokenType {
  token_type: string;
  expires_in: string;
  refresh_token: string;
  access_token: string;
  id_token: string;
}

export const setCookie = (
  res: Response,
  tokens: TokenType,
  options: CookieOptions = {}
) => {
  const originCookie: CookieOptions = {
    httpOnly: true,
    secure: configs.env === "development",
    sameSite: configs.env === "development" ? "none" : "lax",
    maxAge: 1 * 60 * 60 * 1000, //1h
    ...options,
  };

  res.cookie("access_token", tokens.access_token, originCookie);
  res.cookie("refresh_token", tokens.refresh_token, originCookie);
  res.cookie("id_token", tokens.id_token, originCookie);
};
