
export interface LoginRequest {
  email: string
  password: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ResetPasswordResponse {
  token: string
}
