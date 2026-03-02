import React from "react";
import ReactMarkdown from "react-markdown";
import { AlertCircle, Bot, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import type { ChatMessagesProps } from "../../interfaces/components/chat/chat-messages-props-interface";

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, streamingError, messagesEndRef, onExampleClick }) => {
  const expensePromptExamples = React.useMemo(
    () => [
      "Add my electricity bill for $127.43 from today",
      "Add a Netflix monthly subscription for $15.99",
      "Save this grocery receipt from Trader Joe's for $86.27",
      "Show all of my active subscriptions and their monthly totals",
      "Summarize my spending patterns over the last 90 days",
      "What were my top 3 expense categories this month",
    ],
    [],
  );

  const portfolioPromptExamples = React.useMemo(
    () => [
      "Show my current portfolio balances across bank and crypto accounts",
      "What percentage of my portfolio is in crypto versus cash",
      "List my connected bank accounts and their latest balances",
      "How has my total portfolio value changed this month",
      "Give me a quick portfolio allocation summary by account type",
      "Which account has the highest current balance in my portfolio",
    ],
    [],
  );

  const randomPromptExamples = React.useMemo(() => {
    const getRandomItems = (items: string[], count: number) => {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    };

    return [...getRandomItems(portfolioPromptExamples, 2), ...getRandomItems(expensePromptExamples, 2)];
  }, [expensePromptExamples, portfolioPromptExamples]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full text-center py-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 px-6 md:px-0">How can I help you today?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md px-6 md:px-0">
          Ask me anything about your finances, expenses, or portfolio. I can analyze data and provide insights.
        </p>
        <div className="mt-5 w-full max-w-xl px-6 md:px-0 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">Try one of these prompts</p>
          <ul className="grid gap-2 md:grid-cols-2">
            {randomPromptExamples.map((example) => (
              <li
                key={example}
                onClick={() => onExampleClick?.(example)}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-900/60 hover:border-gray-300 dark:hover:border-gray-700"
              >
                {example}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`${message.role === "user" ? "max-w-[65%]" : "w-full max-w-full"} ${message.role === "user" ? "bg-emerald-600 dark:bg-emerald-600 rounded-[2rem] px-5 py-2.5 self-end" : ""}`}>
            {message.images && message.images.length > 0 && (
              <div className="flex gap-2 m-2 flex-wrap">
                {message.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Uploaded ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                ))}
              </div>
            )}
            <div className={`flex items-start gap-2 text-base whitespace-pre-wrap ${message.role === "user" ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>
              {message.role === "assistant" && message.isStreaming
                ? <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full animate-pulse-dot mt-2 flex-shrink-0" />
                : message.role === "assistant" && !message.isStreaming && !message.content && streamingError
                  ? <span className="text-red-600 text-base">{streamingError}</span>
                  : (
                    <div className="markdown-content">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )}
            </div>

            {message.toolCalls && message.toolCalls.length > 0 && (
              <div className="mt-3 space-y-2 w-full max-w-full">
                {message.toolCalls.map((toolCall) => (
                  <details key={toolCall.id} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 w-full">
                    <summary className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/40 border-b border-purple-200 dark:border-purple-800 cursor-pointer list-none hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors w-full">
                      <ChevronDown className="w-4 h-4 text-purple-500 rotate-0 transition-transform open:rotate-180 flex-shrink-0" />
                      <span className="text-sm font-medium text-purple-900 dark:text-purple-100 truncate min-w-0">{toolCall.name}</span>
                      <div className="ml-auto flex-shrink-0">
                        {toolCall.error
                          ? <AlertCircle className="w-4 h-4 text-red-500" />
                          : toolCall.output !== undefined
                            ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                            : <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />}
                      </div>
                    </summary>

                    {toolCall.input && (
                      <div className="w-full border-b border-purple-200 dark:border-purple-800 w-full">
                        <div className="px-3 py-2 text-xs text-purple-700 dark:text-purple-300 font-medium w-full">Request</div>
                        <div className="px-3 pb-2 overflow-x-auto w-full">
                          <pre className="text-xs text-purple-800 dark:text-purple-200 whitespace-pre-wrap break-all w-full bg-purple-200 dark:bg-purple-900/60 rounded p-2 box-border">{toolCall.input}</pre>
                        </div>
                      </div>
                    )}
                    {toolCall.output !== undefined && (
                      <div className="w-full">
                        <div className="px-3 py-2 text-xs text-purple-700 dark:text-purple-300 font-medium w-full">Response</div>
                        <div className="px-3 pb-2 overflow-x-auto w-full">
                          <pre className="text-xs text-purple-800 dark:text-purple-200 whitespace-pre-wrap break-all w-full bg-purple-200 dark:bg-purple-900/60 rounded p-2 box-border">
                            {typeof toolCall.output === "string" ? toolCall.output : JSON.stringify(toolCall.output, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
