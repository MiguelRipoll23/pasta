import type { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  gradientFrom: string;
  color?: string;
  gradientTo: string;
}
