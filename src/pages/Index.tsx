import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { toast } from "sonner";
import { DemoSignupForm } from "@/components/DemoSignupForm";
import RulesDesignerPage from "@/pages/RulesDesignerPage";
import WorkbenchPage from "@/pages/WorkbenchPage";
import WelcomePage from "@/components/WelcomePage";
import medicalData from "@/data/medicalData.json";
import applicationData from "@/data/applicationData.json";

const Index = () => {
  const [step, setStep] = useState(0); // 0 = signup form, 1-3 = main flow
  const [isReferred, setIsReferred] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [workbenchSection, setWorkbenchSection] = useState<string | null>("EHRs");
  const [pageTitle, setPageTitle] = useState("");

  const handleSourceClick = (doc: string) => {
    // Track source document views
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'view_source', {
        document_name: doc,
        step: step,
        user_email: userInfo?.email
      });
    }
    toast.info(`Opening source document: ${doc}`);
  };

  const handleRefer = () => {
    // Track case referrals
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'refer_case', {
        reason: 'Missing AHI Score data in EHR',
        user_email: userInfo?.email
      });
    }
    setIsReferred(true);
    setStep(3);
    toast.info("Case has been referred for manual review");
  };

  const handleStepChange = (newStep: number) => {
    // Track step navigation
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'navigation', {
        from_step: step,
        to_step: newStep,
        user_email: userInfo?.email
      });
    }
    setStep(newStep);
  };

  const handleSignupComplete = (data: { name: string; email: string }) => {
    setUserInfo(data);
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
    setUserInfo(null);
    setStep(0);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <DemoSignupForm onComplete={handleSignupComplete} />;
      case 1:
        return <RulesDesignerPage handleStepChange={handleStepChange} selectRule={null}/>;
      case 2:
        return <WorkbenchPage handleStepChange={handleStepChange} cases={applicationData.cases} workbenchData={applicationData.workbench} summarizerComponentProps={medicalData.ehrSummarizer} handleWorkbenchSectionClick={handleWorkbenchSectionClick} handleSourceClick={handleSourceClick}/>;
        // return (
          // <WorkbenchComponent
          //   workbenchSection={workbenchSection}
            // handleWorkbenchSectionClick={handleWorkbenchSectionClick}
          //   diabetesIcdCodes={diabetesIcdCodes}
          //   sleepApneaIcdCodes={sleepApneaIcdCodes}
            // handleSourceClick={handleSourceClick}
          //   isReferred={isReferred}
          //   referralReason="Missing AHI Score in EHR"
          //   extractedData={extractedData}
          //   alitheiaEHRAssessments={alitheiaEHRAssessments}
          //   carrierRuleDecisions={carrierRuleDecisions}
          //   alitheiaAssessments={alitheiaAssessments}
          //   summarizerComponentProps={summarizerComponent}
          // />
        // );
      case 5:
        return <WelcomePage userInfo={userInfo} handleLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <Layout step={step}>
      <Typography variant="h4" align="center" gutterBottom>
        {pageTitle}
      </Typography>
      {userInfo && (
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
            onClick={() => handleMenuItemClick(5, "")}
          >
            Home
          </Button>
        </div>
      )}
      {renderStep()}
    </Layout>
  );
};

export default Index;