
export interface ILoginRequest {
  login: string
  password: string
}

export interface IResetPasswordRequest {
  email: string
}

export interface IResetPasswordResponse {
  token: string
}
