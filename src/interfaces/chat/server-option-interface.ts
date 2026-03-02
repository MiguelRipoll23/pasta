import type React from "react";
import type { MCPServer } from "../../types/mcp-server-type";

export interface ServerOption {
  id: MCPServer;
  name: string;
  description: string;
  icon: React.ElementType;
}
