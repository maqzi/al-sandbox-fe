import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { useEffect } from "react";
import store, { RootState } from "@/store/store";
import datadog from "@/lib/datadog";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RulesDesignerPage from "./pages/RulesDesignerPage";
import WorkbenchPage from "./pages/WorkbenchPage";
import WelcomePage from "./pages/WelcomePage";
import DemoSignupPage from "./pages/DemoSignupPage";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

// Router component to track route changes
const RouteChangeTracker = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Log page view when location changes
    const pageName = location.pathname.replace(/^\//, '') || 'home';
    datadog.logPageView(pageName, {
      path: location.pathname,
      navigationType,
      search: location.search
    });
  }, [location, navigationType]);

  return null;
};

const AppContent = () => {
  const step = useSelector((state: RootState) => state.user.step);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    // Set user information in Datadog if available
    if (userInfo?.email) {
      datadog.setUser(userInfo.email, {
        email: userInfo.email,
        name: userInfo.name,
        step: step
      });
    }
  }, [userInfo, step]);

  return (
    <div>
      <RouteChangeTracker />
      <Routes>
        <Route path="/" element={<DemoSignupPage />} />
        <Route path="/signup" element={<DemoSignupPage />} />
        <Route
          path="/index"
          element={
            <PrivateRoute step={0}>
              <Index />
            </PrivateRoute>
          }
        />
        <Route
          path="/rules-designer"
          element={
            <PrivateRoute step={1}>
              <RulesDesignerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/workbench"
          element={
            <PrivateRoute step={2}>
              <WorkbenchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/welcome"
          element={
            <PrivateRoute step={0}>
              <WelcomePage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;