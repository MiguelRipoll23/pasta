import api from "../httpClient";

export interface ServerSettings {
  defaultCheckingAccountId: number | null;
  autoCalculateBalance: boolean;
}

export const getServerSettings = async (): Promise<ServerSettings> => {
  const response = await api.get("/api/v1/settings");
  return response.data;
};

export const updateServerSettings = async (
  data: Partial<ServerSettings>,
): Promise<ServerSettings> => {
  const response = await api.patch("/api/v1/settings", data);
  return response.data;
};

export default { getServerSettings, updateServerSettings };
