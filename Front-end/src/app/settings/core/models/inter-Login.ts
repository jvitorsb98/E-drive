
export interface ILoginRequest {
  login: string
  password: string
}

export interface ILoginResponse {
  token: string;
}

export interface IRecoverPasswordRequest {
  email: string
}

export interface IRecoverAccountRequest {
  email: string
}

export interface IRecoverPasswordResponse {
  token: string
}

export interface IRecoverAccountResponse {
  token: string
}

export interface IResetPasswordRequest {
  token: string
  password: string
}
