import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOAuthRequestDetails, approveOAuthRequest, denyOAuthRequest } from "../services/api/oauth";
import { getSettings } from "../services/httpClient";
import { Loader2, Shield, CheckCircle } from "lucide-react";
import type { OAuthAuthorizationParams } from "../interfaces/oauth-authorization-params-interface";
import type { OAuthRequestDetails } from "../interfaces/oauth-request-details-interface";

export const OAuthAuthorizePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorizing, setAuthorizing] = useState(false);
  const [oauthParams, setOauthParams] = useState<OAuthAuthorizationParams | null>(null);

  useEffect(() => {
    const validateAndAuthorize = async () => {
      const settings = getSettings();
      const rId = searchParams.get("request_id");

      if (!rId) {
        setError("Missing authorization request ID");
        setLoading(false);
        return;
      }

      try {
        const requestDetails: OAuthRequestDetails = await getOAuthRequestDetails(rId);

        if (requestDetails.status !== "pending") {
          setError(`Request has already been ${requestDetails.status}`);
          setLoading(false);
          return;
        }

        if (!requestDetails.clientId) {
          setError("Invalid request: missing client_id");
          setLoading(false);
          return;
        }

        setOauthParams({
          client_id: requestDetails.clientId,
          redirect_uri: requestDetails.redirectUri || "",
          state: requestDetails.state || "",
          scope: requestDetails.scope,
          resource: requestDetails.resource,
          code_challenge: requestDetails.codeChallenge,
          code_challenge_method: requestDetails.codeChallengeMethod,
        });

        if (!settings.jwt) {
          navigate("/welcome", {
            state: {
              from: `/authorize?request_id=${rId}`,
            },
          });
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch OAuth request details:", err);
        setError("Failed to load authorization request. The request may have expired.");
        setLoading(false);
      }
    };

    validateAndAuthorize();
  }, [navigate, searchParams]);

  const handleAuthorize = async () => {
    if (!oauthParams) return;

    setAuthorizing(true);
    setError(null);

    try {
      const rId = searchParams.get("request_id");
        const response = await approveOAuthRequest(rId!);
      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else {
        throw new Error("No redirect URL received from server");
      }
    } catch (err) {
      console.error("Authorization error:", err);
      setError(err instanceof Error ? err.message : "Authorization failed");
      setAuthorizing(false);
    }
  };

  const handleDeny = async () => {
    if (!oauthParams) return;

    setAuthorizing(true);
    setError(null);

    try {
      const rId = searchParams.get("request_id");
      const response = await denyOAuthRequest(rId!);
      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else {
        throw new Error("No redirect URL received from server");
      }
    } catch (err) {
      console.error("Denial error:", err);
      setError(err instanceof Error ? err.message : "Denial failed");
      setAuthorizing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Preparing authorization...</p>
        </div>
      </div>
    );
  }

  if (error && !oauthParams) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Authorization Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!oauthParams) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:items-center md:justify-center md:p-4">
      <div className="w-full md:max-w-[420px] flex-1 md:flex-initial flex flex-col">
        <div className="bg-white dark:bg-gray-900 md:rounded-2xl md:shadow-xl p-8 backdrop-blur md:border md:border-gray-200 md:dark:border-gray-800 flex-1 md:flex-initial flex flex-col justify-center md:justify-start">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
              <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Authorization Request
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              An external application is requesting access
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              This application will be able to:
            </h2>
            <ul className="space-y-2">
              {oauthParams.scope.split(" ").filter(Boolean).map((scope) => {
                const scopeDescriptions: Record<string, string> = {
                  "read:user": "Access your profile information",
                  "mcp:tools": "Execute integrated tools",
                  "mcp:resources": "Access resources and data sources",
                };
                const description = scopeDescriptions[scope] || scope.replace(/_/g, " ");
                return (
                  <li key={scope} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {description}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {oauthParams.code_challenge && (
            <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                Using PKCE with {oauthParams.code_challenge_method || "S256"} challenge for enhanced security
              </p>
            </div>
          )}

          <div className="space-y-3 mt-auto pt-2">
            <button
              onClick={handleAuthorize}
              disabled={authorizing}
              className="relative inline-flex h-11 items-center justify-center gap-2 px-4 rounded-xl font-semibold text-sm leading-none transition-all active:translate-y-[1px] active:scale-[0.995] cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 w-full"
            >
              <span className={authorizing ? "opacity-0" : ""}>Authorize</span>
              {authorizing && <Loader2 className="absolute w-4 h-4 animate-spin" />}
            </button>
            <button
              onClick={handleDeny}
              disabled={authorizing}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gray-100 px-6 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            >
              Deny
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
