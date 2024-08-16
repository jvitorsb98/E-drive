
export interface LoginRequest {
  login: string
  password: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ResetPasswordResponse {
  token: string
}
