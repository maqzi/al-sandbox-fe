import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { Provider, useSelector } from "react-redux";
import { useEffect } from "react";
import store, { RootState } from "@/store/store";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RulesDesignerPage from "./pages/RulesDesignerPage";
import WorkbenchPage from "./pages/WorkbenchPage";
import WelcomePage from "./pages/WelcomePage";
import DemoSignupPage from "./pages/DemoSignupPage";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const AppContent = () => {
  const step = useSelector((state: RootState) => state.user.step);
  const navigate = useNavigate();

  useEffect(() => {
    // Restore the last visited route
    const savedRoute = localStorage.getItem("lastVisitedRoute");
    if (savedRoute) {
      navigate(savedRoute);
    }
  }, [navigate]);

  return (
    <div>
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
        <Analytics />
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;