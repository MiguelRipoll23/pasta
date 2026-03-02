export interface AuthenticationOptionsResponse {
  challenge: string;
  rpId: string;
  timeout?: number;
  userVerification?: string;
}
