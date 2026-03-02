export interface RegistrationOptionsResponse {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: string;
    alg: number;
  }>;
  timeout?: number;
  attestation?: string;
  excludeCredentials?: Array<{
    id: string;
    type: string;
  }>;
  authenticatorSelection?: {
    authenticatorAttachment?: string;
    userVerification?: string;
  };
  extensions?: Record<string, unknown>;
}
