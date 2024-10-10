export interface UserAuthType {
  username: string;
  password: string;
}
export interface UserCreateType {
  email: string;
  password: string;
}
export interface UserAuthResponse {
  message: string;
  data: {
    email: string;
    password: string;
  };
}
