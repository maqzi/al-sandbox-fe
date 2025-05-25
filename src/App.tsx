import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { useEffect } from "react";
import { Snackbar } from "@mui/material";
import { toast } from "sonner";
import store, { RootState } from "@/store/store";
import datadog from "@/lib/datadog";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";
import RulesDesignerPage from "./pages/RulesDesignerPage";
import WhiteboardPage from "./pages/WhiteboardPage";
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
      search: location.search,
      timestamp: new Date().toISOString(),
      screenResolution: `${window.innerWidth}x${window.innerHeight}`
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
      datadog.setUser({
        email: userInfo.email,
        name: userInfo.name
      });
    }
  }, [userInfo, step]);

  return (
    <div>
      <RouteChangeTracker />
      <Routes>
        <Route path="/" element={<DemoSignupPage />} />
        <Route path="/signup" element={<DemoSignupPage />} />
        
        {/* Routes that use the AppLayout wrapper */}
        <Route element={<AppLayout />}>
          <Route
            path="/welcome"
            element={
              <PrivateRoute step={0}>
                <WelcomePage userInfo={userInfo} />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute step={0}>
                <WelcomePage userInfo={userInfo} />
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
          {/* Whiteboard routes - now inside AppLayout for top nav */}
          <Route
            path="/rules/:ruleId/whiteboard"
            element={
              <PrivateRoute step={1}>
                <WhiteboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/rules/new/whiteboard"
            element={
              <PrivateRoute step={1}>
                <WhiteboardPage />
              </PrivateRoute>
            }
          />
          {/* Legacy route - redirect to welcome */}
          <Route
            path="/index"
            element={
              <PrivateRoute step={0}>
                <WelcomePage userInfo={userInfo} />
              </PrivateRoute>
            }
          />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
);

export default App;