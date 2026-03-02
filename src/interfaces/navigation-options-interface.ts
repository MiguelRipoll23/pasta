import type { OAuthParams } from "./oauth-params-interface";

export interface NavigationOptions {
  fromPath?: string;
  fromOAuth?: boolean;
  oauthParams?: OAuthParams;
}
