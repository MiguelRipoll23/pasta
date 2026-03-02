export interface OAuthAuthorizationParams {
  client_id: string;
  redirect_uri: string;
  state: string;
  scope: string;
  resource?: string;
  code_challenge?: string;
  code_challenge_method?: "S256" | "plain";
}
