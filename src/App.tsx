import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainLayout } from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import { EditorsPage } from "./pages/EditorsPage";
import { SalaryEditor } from "./pages/SalaryEditor/SalaryEditor";
import { CashEditor } from "./pages/CashEditor/CashEditor";
import { BankAccountsEditor } from "./pages/BankAccountsEditor/BankAccountsEditor";
import { RoboadvisorsEditor } from "./pages/RoboadvisorsEditor/RoboadvisorsEditor";
import { CryptoExchangesEditor } from "./pages/CryptoExchangesEditor/CryptoExchangesEditor";
import { BillsEditor } from "./pages/BillsEditor/BillsEditor";
import { MerchantsEditor } from "./pages/MerchantsEditor/MerchantsEditor";
import { SubscriptionsEditor } from "./pages/SubscriptionsEditor/SubscriptionsEditor";
import { SettingsPage } from "./pages/SettingsPage";
import { WelcomePage } from "./pages/WelcomePage";
import { ChatPage } from "./pages/ChatPage";
import { OAuthAuthorizePage } from "./pages/OAuthAuthorizePage";
import { applyTheme, getSettings } from "./services/httpClient";
import ErrorPage from "./pages/ErrorPage";
import React, { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const settings = getSettings();
  const location = useLocation();

  if (!settings.jwt) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const EditorsIndexRedirect = () => {
  const location = useLocation();
  const state = location.state as { lastEditor?: string } | null;
  const lastEditorFromState = state?.lastEditor;
  const lastEditorFromSession = sessionStorage.getItem("lastEditorPath");
  const lastEditor = lastEditorFromState || lastEditorFromSession || "/editors/salary";

  return <Navigate to={lastEditor} replace />;
};

const AuthListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      navigate("/welcome");
    };

    window.addEventListener("auth:force-logout", handleLogout);
    return () => {
      window.removeEventListener("auth:force-logout", handleLogout);
    };
  }, [navigate]);

  return null;
};

function App() {
  useEffect(() => {
    const settings = getSettings();
    // Show error if API base URL is missing
    if (!import.meta.env.VITE_API_BASE_URL) return;
    applyTheme(settings.theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (settings.theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    // If the API base URL is not defined, show a generic error page
    (!import.meta.env.VITE_API_BASE_URL)
      ? (
        <ErrorPage
          title="Configuration error"
          description={"VITE_API_BASE_URL is not defined.\nPlease include it in your environment variables."}
        />
      ) : (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthListener />
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/authorize" element={<OAuthAuthorizePage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="editors" element={<EditorsPage />}>
              <Route index element={<EditorsIndexRedirect />} />
              <Route path="salary" element={<SalaryEditor />} />
              <Route path="cash" element={<CashEditor />} />
              <Route path="banks/*" element={<BankAccountsEditor />} />
              <Route path="roboadvisors/*" element={<RoboadvisorsEditor />} />
              <Route path="crypto" element={<CryptoExchangesEditor />} />
              <Route path="bills" element={<BillsEditor />} />
              <Route path="merchants/*" element={<MerchantsEditor />} />
              <Route path="subscriptions" element={<SubscriptionsEditor />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="chat" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    )
  );
}

export default App;
