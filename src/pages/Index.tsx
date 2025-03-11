import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { toast } from "sonner";
import { DemoSignupForm } from "@/components/DemoSignupForm";
import RulesDesignerPage from "@/pages/RulesDesignerPage";
import WorkbenchPage from "@/pages/WorkbenchPage";
import WelcomePage from "@/components/WelcomePage";
import Layout from "@/components/Layout";
import medicalData from "@/data/medicalData.json";
import applicationData from "@/data/applicationData.json";
import { setUser, setStep } from "@/store/userSlice";

const Index = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user);
  const step = useSelector((state: RootState) => state.user.step);
  const [isReferred, setIsReferred] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [workbenchSection, setWorkbenchSection] = useState<string | null>("EHRs");
  const [pageTitle, setPageTitle] = useState("");

  const handleSourceClick = (doc: string) => {
    // Track source document views
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'view_source', {
        document_name: doc,
        step: step,
        user_email: userInfo.email
      });
    }
    toast.info(`Opening source document: ${doc}`);
  };

  const handleRefer = () => {
    // Track case referrals
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'refer_case', {
        reason: 'Missing AHI Score data in EHR',
        user_email: userInfo.email
      });
    }
    setIsReferred(true);
    dispatch(setStep(3));
    toast.info("Case has been referred for manual review");
  };

  const handleStepChange = (newStep: number) => {
    // Track step navigation
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'navigation', {
        from_step: step,
        to_step: newStep,
        user_email: userInfo.email
      });
    }
    dispatch(setStep(newStep));
  };

  const handleSignupComplete = (data: { name: string; email: string }) => {
    dispatch(setUser(data));
    handleStepChange(5);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (newStep: number, title: string) => {
    setPageTitle(title);
    handleStepChange(newStep);
    handleMenuClose();
  };

  const handleWorkbenchSectionClick = (section: string) => {
    setWorkbenchSection(section);
  };

  const handleLogout = () => {
    dispatch(setUser({ name: '', email: '' }));
    dispatch(setStep(0));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomePage userInfo={userInfo} handleLogout={handleLogout} />;
      case 1:
        return <RulesDesignerPage handleStepChange={handleStepChange} selectRule={null} />;
      case 2:
        return <WorkbenchPage handleStepChange={handleStepChange} cases={applicationData.cases} workbenchData={applicationData.workbench} summarizerComponentProps={medicalData.ehrSummarizer} handleWorkbenchSectionClick={handleWorkbenchSectionClick} handleSourceClick={handleSourceClick} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        {pageTitle}
      </Typography>
      {userInfo.name && (
        <div className="flex left-between mb-4">
          <Button
            variant="outlined"
            onClick={handleMenuClick}
            style={{ marginRight: '10px' }} // Add margin to create gap
          >
            Menu
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuItemClick(1, "Rules Designer")}>Rules Designer</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(2, "Workbench")}>Workbench</MenuItem>
          </Menu>
          <Button
            onClick={() => handleMenuItemClick(0, "")}
          >
            Home
          </Button>
        </div>
      )}
      {renderStep()}
    </div>
  );
};

export default Index;