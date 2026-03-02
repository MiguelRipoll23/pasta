import {
  getSetupToken,
  getRegistrationOptions,
  verifyRegistrationResponse,
  getAuthenticationOptions,
  verifyAuthenticationResponse,
} from "./api/auth";
import { getSettings, saveSettings } from "./httpClient";
import { WebAuthnUtils } from "../utils/credential-utils";
import type { AuthenticationResponse } from "../interfaces/authentication-response-interface";
import type { RegistrationOptionsResponse } from "../interfaces/registration-options-response-interface";
import type { AuthenticationOptionsResponse } from "../interfaces/authentication-options-response-interface";
import type { CredentialServiceOptions } from "../interfaces/credential-service-options-interface";
import { ServerError } from "../models/server-error";

export class CredentialService {
  /**
   * Check if the browser supports passkeys
   */
  public static isPasskeySupported(): boolean {
    return (
      typeof window !== "undefined" && window.PublicKeyCredential !== undefined
    );
  }

  /**
   * Get the device name from user agent
   */
  public static getDeviceName(): string {
    const ua = navigator.userAgent;
    if (/iPhone/i.test(ua)) return "iPhone";
    if (/iPad/i.test(ua)) return "iPad";
    if (/Android/i.test(ua)) return "Android Device";
    if (/Mac/i.test(ua)) return "Mac";
    if (/Win/i.test(ua)) return "Windows PC";
    if (/Linux/i.test(ua)) return "Linux Machine";
    return "Unknown Device";
  }

  /**
   * Clear any stale JWT when landing on welcome page
   */
  public static clearStaleJwt(): void {
    const settings = getSettings();
    if (settings.jwt) {
      saveSettings({ ...settings, jwt: "" });
    }
  }

  /**
   * Save JWT token to settings
   */
  public static saveJwtToken(token: string): void {
    const currentSettings = getSettings();
    saveSettings({ ...currentSettings, jwt: token });
  }

  /**
   * Check setup status and return setup token if registration is needed
   */
  public static async checkSetup(): Promise<{
    needsRegistration: boolean;
    setupToken: string | null;
  }> {
    const setupResponse = await getSetupToken();

    if (setupResponse === null) {
      return { needsRegistration: false, setupToken: null };
    } else {
      return { needsRegistration: true, setupToken: setupResponse.token };
    }
  }

  /**
   * Register a new passkey
   */
  public static async registerPasskey(
    options: CredentialServiceOptions,
  ): Promise<AuthenticationResponse> {
    const { displayName, setupToken } = options;

    if (!setupToken) {
      throw new Error("Setup token not available");
    }

    const transactionId = crypto.randomUUID();

    const registrationOptions = await getRegistrationOptions(
      {
        transactionId,
        displayName,
      },
      setupToken,
    );

    const publicKey = this.buildRegistrationPublicKey(registrationOptions);

    const credential = await navigator.credentials.create({
      publicKey,
    });

    if (credential === null) {
      throw new Error("Credential creation was cancelled");
    }

    const verifyResponse = await verifyRegistrationResponse(
      {
        transactionId,
        registrationResponse: WebAuthnUtils.serializeCredential(
          credential as PublicKeyCredential,
        ),
      },
      setupToken,
    );

    return verifyResponse;
  }

  /**
   * Authenticate with existing passkey
   */
  public static async authenticateWithPasskey(): Promise<AuthenticationResponse> {
    const transactionId = crypto.randomUUID();

    const authenticationOptions = await getAuthenticationOptions({
      transactionId,
    });

    const publicKey = this.buildAuthenticationPublicKey(authenticationOptions);

    const credential = await navigator.credentials.get({
      publicKey,
    });

    if (credential === null) {
      throw new Error("Credential retrieval was cancelled");
    }

    const serializedCredential = WebAuthnUtils.serializeCredential(
      credential as PublicKeyCredential,
    );

    try {
      const verifyResponse = await verifyAuthenticationResponse({
        transactionId,
        authenticationResponse: serializedCredential,
      });

      return verifyResponse;
    } catch (error) {
      if (this.isCredentialNotFoundError(error)) {
        await this.signalUnknownCredential(
          authenticationOptions.rpId,
          serializedCredential.id,
        );
      }
      throw error;
    }
  }

  /**
   * Build the public key options for registration
   */
  private static buildRegistrationPublicKey(
    registrationOptions: RegistrationOptionsResponse,
  ): PublicKeyCredentialCreationOptions {
    return {
      challenge: WebAuthnUtils.challengeToArrayBuffer(
        registrationOptions.challenge,
      ),
      rp: registrationOptions.rp,
      user: {
        id: WebAuthnUtils.challengeToArrayBuffer(registrationOptions.user.id),
        name: registrationOptions.user.name,
        displayName: registrationOptions.user.displayName,
      },
      pubKeyCredParams:
        registrationOptions.pubKeyCredParams as PublicKeyCredentialParameters[],
      timeout: registrationOptions.timeout,
      attestation:
        registrationOptions.attestation as AttestationConveyancePreference,
      excludeCredentials: registrationOptions.excludeCredentials?.map(
        (cred) => ({
          id: WebAuthnUtils.challengeToArrayBuffer(cred.id),
          type: cred.type as PublicKeyCredentialType,
        }),
      ) as PublicKeyCredentialDescriptor[] | undefined,
      authenticatorSelection:
        registrationOptions.authenticatorSelection as AuthenticatorSelectionCriteria,
      extensions: registrationOptions.extensions,
    };
  }

  /**
   * Build the public key options for authentication
   */
  private static buildAuthenticationPublicKey(
    authenticationOptions: AuthenticationOptionsResponse,
  ): PublicKeyCredentialRequestOptions {
    return {
      challenge: WebAuthnUtils.challengeToArrayBuffer(
        authenticationOptions.challenge,
      ),
      rpId: authenticationOptions.rpId,
      timeout: authenticationOptions.timeout,
      userVerification:
        authenticationOptions.userVerification as UserVerificationRequirement,
    };
  }

  /**
   * Check if error indicates credential was not found on the server
   */
  private static isCredentialNotFoundError(
    error: unknown,
  ): error is ServerError {
    return (
      error instanceof ServerError && error.code === "CREDENTIAL_NOT_FOUND"
    );
  }

  /**
   * Signal to the authenticator that a credential is unknown.
   * This helps the authenticator clean up stale credentials.
   */
  public static async signalUnknownCredential(
    rpId: string,
    credentialId: string,
  ): Promise<void> {
    if (
      typeof PublicKeyCredential !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (PublicKeyCredential as any).signalUnknownCredential
    ) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (PublicKeyCredential as any).signalUnknownCredential({
          rpId,
          credentialId,
        });
        console.log(
          `Signaled unknown credential for credential (${credentialId})`,
        );
      } catch (signalError) {
        console.warn("Failed to signal unknown credential:", signalError);
      }
    }
  }
}

export default CredentialService;
