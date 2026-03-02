import React from "react";
import { ChevronDown, Globe, Sparkles } from "lucide-react";
// types moved to props interface file
import { serverOptions } from "../../constants/chat-constants";

import type { ChatHeaderProps } from "../../interfaces/components/chat/chat-header-props-interface";

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  models,
  selectedModel,
  isLoadingModels,
  showModelDropdown,
  setShowModelDropdown,
  selectedServer,
  setSelectedServer,
  showServerDropdown,
  setShowServerDropdown,
  setSelectedModel,
}) => (
  <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
    <div className="flex items-center justify-center md:justify-between px-4 py-3 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="relative model-dropdown-container">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            disabled={models.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
            {isLoadingModels
              ? (
                <span className="text-base font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">Loading...</span>
              ) : (
                <>
                  <span className="text-base font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                    {selectedModel?.id.replace(/^models\//, "") || selectedModel?.id || "Select model"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                </>
              )}
          </button>

          {showModelDropdown && models.length > 0 && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowModelDropdown(false)} />
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-20 py-1 max-h-64 overflow-y-auto overflow-x-hidden">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${selectedModel?.id === model.id ? "bg-gray-50 dark:bg-gray-800" : ""}`}
                  >
                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">{model.id}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative server-dropdown-container">
          <button
            onClick={() => setShowServerDropdown(!showServerDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {(() => {
              const ServerIcon = serverOptions.find((s) => s.id === selectedServer)?.icon || Globe;
              return <ServerIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
            })()}
            <span className="text-base font-medium text-gray-900 dark:text-gray-100 truncate max-w-[80px]">
              {serverOptions.find((s) => s.id === selectedServer)?.name}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
          </button>

          {showServerDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowServerDropdown(false)} />
              <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-20 py-1 max-h-64 overflow-y-auto">
                {serverOptions.map((server) => (
                  <button
                    key={server.id}
                    onClick={() => {
                      setSelectedServer(server.id);
                      setShowServerDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${selectedServer === server.id ? "bg-gray-50 dark:bg-gray-800" : ""}`}
                  >
                    <server.icon className="w-4 h-4 text-emerald-500" />
                    <div className="text-left">
                      <div className="text-base font-medium text-gray-900 dark:text-gray-100">{server.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{server.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);
