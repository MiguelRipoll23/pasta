import React from "react";
import { ResponsiveContainer, Sankey, Tooltip } from "recharts";
import type { LiquidFlowSankeyCardProps } from "../../interfaces/dashboard/liquid-flow-sankey-card-props-interface";
import { Skeleton } from "../Skeleton";

const DEFAULT_NODE_COLOR = "#94a3b8";

const NODE_COLOR_MAP: Record<string, string> = {
  Salary: "#22c55e",
  Interest: "#14b8a6",
  "Liquid Money": "#10b981",
  Bills: "#60a5fa",
  Merchants: "#fb923c",
  Subscriptions: "#a855f7",
};

const getNodeColor = (name?: string) => (name ? NODE_COLOR_MAP[name] ?? DEFAULT_NODE_COLOR : DEFAULT_NODE_COLOR);
const getNodeLabel = (name?: string) => (name === "Liquid Money" ? "" : (name ?? ""));

const toPastel = (hexColor: string, amount = 0.45) => {
  const hex = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;
  if (hex.length !== 6) return hexColor;

  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);

  const mix = (channel: number) => Math.round(channel + (255 - channel) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

export const LiquidFlowSankeyCard = ({ loadingCharts, charts, format }: LiquidFlowSankeyCardProps) => {
  const gradientIdPrefix = React.useId();

  return (
    <div className="group relative bg-white dark:bg-gray-900/80 rounded-2xl p-6 h-[28rem] flex flex-col transition-all duration-300 ease-out hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <h2 className="relative z-10 text-xl font-semibold mb-4">Money Flow</h2>
      <div className="relative z-10 flex-1" style={{ minHeight: 0 }}>
        {loadingCharts
          ? <Skeleton className="h-full w-full" />
          : charts && (
            <ResponsiveContainer width="100%" height="100%" style={{ outline: "none" }} className="focus:outline-none">
              <Sankey
                data={charts.liquidFlow}
                nodePadding={36}
                nodeWidth={20}
                margin={{ top: 24, right: 80, bottom: 24, left: 60 }}
                link={(props) => {
                  const sourceColor = getNodeColor(props.payload.source?.name);
                  const targetColor = getNodeColor(props.payload.target?.name);
                  const gradientId = `${gradientIdPrefix}-link-gradient-${props.index}`;

                  return (
                    <g>
                      <defs>
                        <linearGradient id={gradientId} x1={props.sourceX} y1={props.sourceY} x2={props.targetX} y2={props.targetY} gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor={toPastel(sourceColor)} stopOpacity={0.7} />
                          <stop offset="100%" stopColor={toPastel(targetColor)} stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <path
                        d={`M${props.sourceX},${props.sourceY} C${props.sourceControlX},${props.sourceY} ${props.targetControlX},${props.targetY} ${props.targetX},${props.targetY}`}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth={props.linkWidth}
                      />
                    </g>
                  );
                }}
                node={(props) => {
                  const color = getNodeColor(props.payload.name);
                  return (
                    <g>
                      <rect x={props.x} y={props.y} width={props.width} height={props.height} fill={color} fillOpacity={0.9} rx={4} ry={4} />
                      <text x={props.x + props.width + 8} y={props.y + props.height / 2} textAnchor="start" dominantBaseline="middle" fontSize={12} fill="currentColor">
                        {getNodeLabel(props.payload.name)}
                      </text>
                    </g>
                  );
                }}
              >
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0) {
                      const item = payload[0]?.payload;
                      if (!item) return null;

                      const label = item.name || `${item.source?.name ?? ""} → ${item.target?.name ?? ""}`;
                      const value = typeof item.value === "number" ? item.value : null;

                      return (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-lg text-xs">
                          <p className="font-bold mb-1 text-gray-500">{label}</p>
                          <p className="text-gray-800 dark:text-gray-100">Amount: <span className="font-mono">{format(value)}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </Sankey>
            </ResponsiveContainer>
          )}
      </div>
      {!loadingCharts && charts && (
        <div className="relative z-10 mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Gained</p>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">{format(charts.liquidFlowSummary.gained)}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Net Change</p>
            <p className={`font-semibold ${charts.liquidFlowSummary.netChange >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
              {format(charts.liquidFlowSummary.netChange)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Lost</p>
            <p className="font-semibold text-orange-600 dark:text-orange-400">{format(charts.liquidFlowSummary.lost)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
