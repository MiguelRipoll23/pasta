import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CredentialService } from "../services/credential-service";
import { getSettings, saveSettings } from "../services/httpClient";
import { isCancellationError } from "../utils/credential-utils";
import { KeyRound, Loader2 } from "lucide-react";
import type { OAuthAuthorizationParams } from "../interfaces/oauth-authorization-params-interface";

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [setupToken, setSetupToken] = useState<string | null>(null);

  const oauthParams = location.state?.oauthParams as OAuthAuthorizationParams | undefined;
  const fromPath = location.state?.from as string | undefined;
  const fromOAuth = !!oauthParams || !!fromPath;

  // Clear any stale JWT when landing on welcome page
  useEffect(() => {
    CredentialService.clearStaleJwt();
  }, []);

  const handleRegisterOrSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if passkeys are supported
      if (!CredentialService.isPasskeySupported()) {
        throw new Error(
          "Your browser or device doesn't support passkeys. Please try using a different browser or device.",
        );
      }

      // Check setup status
      const { needsRegistration, setupToken: token } = await CredentialService.checkSetup();

      if (!needsRegistration) {
        // Passkeys already exist, proceed with authentication
        await handleAuthentication();
      } else {
        // No passkeys exist, show registration form
        setSetupToken(token);
        setDisplayName(CredentialService.getDeviceName());
        setIsRegistering(true);
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error("Setup error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred during setup",
      );
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!setupToken) {
        throw new Error("Setup token not available");
      }

      // Register passkey using the credential service
      const verifyResponse = await CredentialService.registerPasskey({
        displayName,
        setupToken,
      });

      // Store the JWT token with current settings
      CredentialService.saveJwtToken(verifyResponse.token);

      // Navigate to the authorization page or dashboard
      if (fromPath) {
        // New flow: redirect back to the path (e.g., /authorize?request_id=...)
        navigate(fromPath, { replace: true });
      } else if (fromOAuth && oauthParams) {
        // Old flow: reconstruct authorization URL from params
        const searchParams = new URLSearchParams();
        searchParams.set("client_id", oauthParams.client_id);
        searchParams.set("redirect_uri", oauthParams.redirect_uri);
        searchParams.set("state", oauthParams.state);
        searchParams.set("scope", oauthParams.scope);
        if (oauthParams.code_challenge) {
          searchParams.set("code_challenge", oauthParams.code_challenge);
        }
        if (oauthParams.code_challenge_method) {
          searchParams.set("code_challenge_method", oauthParams.code_challenge_method);
        }
        if (oauthParams.resource) {
          searchParams.set("resource", oauthParams.resource);
        }
        navigate(`/authorize?${searchParams.toString()}`, { replace: true });
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      if (isCancellationError(err)) {
        setLoading(false);
        return;
      }
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration",
      );
      setLoading(false);
    }
  };

  const handleAuthentication = async () => {
    setLoading(true);
    setError(null);
    try {
      // Authenticate using the credential service
      const verifyResponse = await CredentialService.authenticateWithPasskey();

      // Store the JWT token with current settings
      CredentialService.saveJwtToken(verifyResponse.token);

      // Navigate to the authorization page or dashboard
      if (fromPath) {
        // New flow: redirect back to the path (e.g., /authorize?request_id=...)
        navigate(fromPath, { replace: true });
      } else if (fromOAuth && oauthParams) {
        // Old flow: reconstruct authorization URL from params
        const searchParams = new URLSearchParams();
        searchParams.set("client_id", oauthParams.client_id);
        searchParams.set("redirect_uri", oauthParams.redirect_uri);
        searchParams.set("state", oauthParams.state);
        searchParams.set("scope", oauthParams.scope);
        if (oauthParams.code_challenge) {
          searchParams.set("code_challenge", oauthParams.code_challenge);
        }
        if (oauthParams.code_challenge_method) {
          searchParams.set("code_challenge_method", oauthParams.code_challenge_method);
        }
        if (oauthParams.resource) {
          searchParams.set("resource", oauthParams.resource);
        }
        navigate(`/authorize?${searchParams.toString()}`, { replace: true });
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      console.error("Authentication error:", err);
      if (isCancellationError(err)) {
        setLoading(false);
        return;
      }
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during authentication",
      );
      setLoading(false);
    }
  };

  const handleBack = () => {
    setIsRegistering(false);
    setDisplayName("");
    setSetupToken(null);
    setError(null);

    // Clear any temporary JWT token
    const settings = getSettings();
    if (settings.jwt) {
      saveSettings({ ...settings, jwt: "" });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col md:items-center md:justify-center md:p-4">
      <div className="w-full md:max-w-[340px] md:h-auto flex-1 md:flex-initial flex flex-col">
        <div className="bg-white dark:bg-gray-900 md:dark:bg-gray-900 md:rounded-2xl md:shadow-xl p-8 backdrop-blur md:border md:border-gray-200 md:dark:border-gray-800 flex-1 md:flex-initial flex flex-col">
          <div className="md:flex-initial flex-1 flex flex-col items-center justify-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
              <KeyRound className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isRegistering ? "Register Passkey" : "Welcome"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {isRegistering
                ? "Create your first passkey to secure your account"
                : "Sign in or register with a passkey"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {!isRegistering
            ? (
              <div className="space-y-4 mt-auto">
                <button
                  onClick={handleRegisterOrSignIn}
                  disabled={loading}
                  className="relative inline-flex h-11 items-center justify-center gap-2 px-4 rounded-xl font-semibold text-base leading-none transition-all active:translate-y-[1px] active:scale-[0.995] cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 w-full"
                  // nudge up slightly on small screens so the button sits a little higher
                  style={{ marginBottom: '6px' }}
                >
                  <span className={loading ? "opacity-0" : ""}>Continue</span>
                  {loading && <Loader2 className="absolute w-4 h-4 animate-spin" />}
                </button>
              </div>
            )
            : (
              <form onSubmit={handleRegistration} className="space-y-4 flex-1 flex flex-col">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Passkey Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g., My MacBook Pro"
                    maxLength={255}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Choose a name to identify this passkey
                  </p>
                </div>

                <div className="flex gap-3 mt-auto pt-2">
                  <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 px-4 rounded-xl font-semibold text-sm leading-none transition-all active:translate-y-[1px] active:scale-[0.995] cursor-pointer bg-emerald-500/10 text-emerald-900 dark:text-white hover:bg-emerald-500/20 flex-1"
                >
                    Back
                  </button>
                   <button
                     type="submit"
                     disabled={loading || !displayName.trim()}
                        className="relative inline-flex h-11 items-center justify-center gap-2 px-4 rounded-xl font-semibold text-sm leading-none transition-all active:translate-y-[1px] active:scale-[0.995] cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 flex-1"
                    >
                    <span className={loading ? "opacity-0" : ""}>Create Passkey</span>
                    {loading && <Loader2 className="absolute w-4 h-4 animate-spin" />}
                  </button>
                </div>
              </form>
            )}
        </div>


      </div>
    </div>
  );
};
