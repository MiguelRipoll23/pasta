import { Globe, Receipt, Wallet } from "lucide-react";
import type { ServerOption } from "../interfaces/chat/server-option-interface";

export const serverOptions: ServerOption[] = [
  {
    id: "GLOBAL",
    name: "Global",
    description: "Access to all financial tools",
    icon: Globe,
  },
  {
    id: "PORTFOLIO",
    name: "Portfolio",
    description: "Bank accounts, crypto & balances",
    icon: Wallet,
  },
  {
    id: "EXPENSES",
    name: "Expenses",
    description: "Bills, receipts & subscriptions",
    icon: Receipt,
  },
];

export const chatPulsingDotStyle = `
  @keyframes pulse-dot {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.5); }
  }
  .animate-pulse-dot {
    animation: pulse-dot 1s ease-in-out infinite;
  }
`;

export const chatMarkdownStyle = `
  .markdown-content {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.4;
  }
  .markdown-content p {
    margin: 0;
  }
  .markdown-content p:first-child {
    margin-top: 0;
  }
  .markdown-content p:last-child {
    margin-bottom: 0;
  }
  .markdown-content ul, .markdown-content ol {
    margin: 0.2em 0;
    padding-left: 1.25em;
  }
  .markdown-content li {
    margin: 0;
  }
  .markdown-content code {
    background-color: rgba(0, 0, 0, 0.08);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-family: monospace;
  }
  .dark .markdown-content code {
    background-color: rgba(255, 255, 255, 0.1);
  }
  .markdown-content pre {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.75em;
    border-radius: 8px;
    overflow-x: auto;
    margin: 0.5em 0;
  }
  .dark .markdown-content pre {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;
