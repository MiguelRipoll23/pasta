import { Base64Utils } from "./base64-utils";
import type { SerializedCredential } from "../interfaces/serialized-credential-interface";

export class WebAuthnUtils {
  public static serializeCredential(
    credential: PublicKeyCredential,
  ): SerializedCredential {
    const { type, rawId, response } = credential;

    return {
      id: Base64Utils.arrayBufferToBase64Url(rawId),
      type,
      rawId: Base64Utils.arrayBufferToBase64Url(rawId),
      response: {
        clientDataJSON: Base64Utils.arrayBufferToBase64Url(
          response.clientDataJSON,
        ),
        attestationObject: (response as AuthenticatorAttestationResponse)
          .attestationObject
          ? Base64Utils.arrayBufferToBase64Url(
              (response as AuthenticatorAttestationResponse).attestationObject!,
            )
          : null,
        authenticatorData: (response as AuthenticatorAssertionResponse)
          .authenticatorData
          ? Base64Utils.arrayBufferToBase64Url(
              (response as AuthenticatorAssertionResponse).authenticatorData!,
            )
          : null,
        signature: (response as AuthenticatorAssertionResponse).signature
          ? Base64Utils.arrayBufferToBase64Url(
              (response as AuthenticatorAssertionResponse).signature!,
            )
          : null,
        userHandle: (response as AuthenticatorAssertionResponse).userHandle
          ? Base64Utils.arrayBufferToBase64Url(
              (response as AuthenticatorAssertionResponse).userHandle!,
            )
          : null,
      },
    };
  }

  public static challengeToArrayBuffer(challenge: string): ArrayBuffer {
    return Base64Utils.base64UrlToArrayBuffer(challenge);
  }
}

/**
 * Check if the error is a user cancellation error
 */
export const isCancellationError = (err: unknown): boolean => {
  return err instanceof Error && (err.name === "NotAllowedError" || err.name === "AbortError");
};

export default {
  WebAuthnUtils,
  isCancellationError,
};
