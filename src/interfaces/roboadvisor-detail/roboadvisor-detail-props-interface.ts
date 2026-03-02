import type { Roboadvisor } from "./roboadvisor-detail-interface";

export interface RoboadvisorDetailProps {
  onEdit: (roboadvisor: Roboadvisor) => void;
  onDelete: (id: number) => void;
  onBack: () => void;
}
