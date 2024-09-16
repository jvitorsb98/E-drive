
export interface ILoginRequest {
  login: string
  password: string
}

export interface ILoginResponse {
  token: string;
}

export interface IResetPasswordRequest {
  email: string
}

export interface IResetPasswordResponse {
  token: string
}
