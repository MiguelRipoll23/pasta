export interface OAuthParams {
  client_id: string;
  redirect_uri: string;
  state: string;
  scope: string;
  code_challenge?: string;
  code_challenge_method?: string;
  resource?: string;
}
