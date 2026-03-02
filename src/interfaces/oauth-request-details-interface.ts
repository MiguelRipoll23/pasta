export interface OAuthRequestDetails {
  requestId: string;
  clientId: string;
  scope: string;
  state?: string;
  redirectUri?: string;
  status: "pending" | "approved" | "denied";
  codeChallenge?: string;
  codeChallengeMethod?: "S256" | "plain";
  resource?: string;
  createdAt: number;
  expiresAt: number;
}
