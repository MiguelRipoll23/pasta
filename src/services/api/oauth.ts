import api from "../httpClient";

export const getOAuthRequestDetails = async (requestId: string) => {
  const base = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${base}/api/v1/oauth/requests/${requestId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch request details: ${response.statusText}`);
  }
  return response.json();
};

export const approveOAuthRequest = async (requestId: string) => {
  const response = await api.post(`/api/v1/oauth/requests/${requestId}/approve`);
  return response.data;
};

export const denyOAuthRequest = async (requestId: string) => {
  const response = await api.post(`/api/v1/oauth/requests/${requestId}/deny`);
  return response.data;
};

export default {
  getOAuthRequestDetails,
  approveOAuthRequest,
  denyOAuthRequest,
};
