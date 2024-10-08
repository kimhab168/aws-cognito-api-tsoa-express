export interface UserAuthType {
  email: string;
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
