import api from "../httpClient";
import type { SetupTokenResponse } from "../../interfaces/setup-token-response-interface";
import type { RegistrationOptionsRequest } from "../../interfaces/registration-options-request-interface";
import type { VerifyRegistrationRequest } from "../../interfaces/verify-registration-request-interface";
import type { AuthenticationOptionsRequest } from "../../interfaces/authentication-options-request-interface";
import type { VerifyAuthenticationRequest } from "../../interfaces/verify-authentication-request-interface";
import type { AuthenticationResponse } from "../../interfaces/authentication-response-interface";

export const getSetupToken = async (): Promise<SetupTokenResponse | null> => {
  const response = await api.post("/api/v1/registration/setup");
  // 204 No Content means passkeys already exist, user should authenticate
  if (response.status === 204) {
    return null;
  }
  return response.data;
};

export const getRegistrationOptions = async (
  request: RegistrationOptionsRequest,
  setupToken?: string,
) => {
  const config = setupToken ? { headers: { Authorization: `Bearer ${setupToken}` } } : undefined;
  const response = await api.post("/api/v1/registration/registration/options", request, config);
  return response.data;
};

export const verifyRegistrationResponse = async (
  request: VerifyRegistrationRequest,
  setupToken?: string,
): Promise<AuthenticationResponse> => {
  const config = setupToken ? { headers: { Authorization: `Bearer ${setupToken}` } } : undefined;
  const response = await api.post("/api/v1/registration/registration/response", request, config);
  return response.data;
};

export const getAuthenticationOptions = async (
  request: AuthenticationOptionsRequest,
) => {
  const response = await api.post("/api/v1/authentication/options", request);
  return response.data;
};

export const verifyAuthenticationResponse = async (
  request: VerifyAuthenticationRequest,
): Promise<AuthenticationResponse> => {
  const response = await api.post("/api/v1/authentication/response", request);
  return response.data;
};

export default {
  getSetupToken,
  getRegistrationOptions,
  verifyRegistrationResponse,
  getAuthenticationOptions,
  verifyAuthenticationResponse,
};
