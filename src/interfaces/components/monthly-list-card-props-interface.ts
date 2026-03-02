export interface MonthlyListCardItem {
  name: string;
  total: number;
}

export interface MonthlyListCardProps {
  title: string;
  subtitle: string;
  loading: boolean;
  items?: MonthlyListCardItem[];
  emptyLabel: string;
  borderClassName: string;
  format: (value: number | null) => string;
}
