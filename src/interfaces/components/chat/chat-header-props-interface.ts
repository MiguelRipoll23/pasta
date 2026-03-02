import type { Model } from "../../../interfaces/model-interface";
import type { MCPServer } from "../../../types/mcp-server-type";

export interface ChatHeaderProps {
  models: Model[];
  selectedModel: Model | null;
  isLoadingModels: boolean;
  showModelDropdown: boolean;
  setShowModelDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  selectedServer: MCPServer;
  setSelectedServer: React.Dispatch<React.SetStateAction<MCPServer>>;
  showServerDropdown: boolean;
  setShowServerDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedModel: React.Dispatch<React.SetStateAction<Model | null>>;
}
