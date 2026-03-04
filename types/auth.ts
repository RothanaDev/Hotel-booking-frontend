export interface AuthUser {
  id: number
  email: string
  role: string
}

export interface SendVerificationRequest {
  email: string;
}

export interface VerificationRequest {
  email: string;
  verifiedCode: string;
}
