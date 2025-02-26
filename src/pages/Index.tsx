import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { toast } from "sonner";
import { DemoSignupForm } from "@/components/DemoSignupForm";
import EHRsComponent from "@/components/EHRsComponent";
import RulesDesignerComponent from "@/components/RulesDesignerComponent";
import AssessmentComponent from "@/components/AssessmentComponent";
import WorkbenchComponent from "@/components/WorkbenchComponent";
import WelcomePage from "@/components/WelcomePage";

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

  const diabetesIcdCodes = [
    {
      code: "E11.9",
      description: "Type 2 diabetes mellitus without complications",
      sourceDoc: "Medical Record 2023-01-15",
      found: true,
    },
    {
      code: "E11.65",
      description: "Type 2 diabetes mellitus with hyperglycemia",
      sourceDoc: "Lab Results 2023-02-01",
      found: true,
    },
  ];

  const sleepApneaIcdCodes = [
    {
      code: "G47.33",
      description: "Obstructive sleep apnea (adult) (pediatric)",
      sourceDoc: "Sleep Study 2023-03-10",
      found: true,
    },
    {
      code: "G47.30",
      description: "Sleep apnea, unspecified",
      sourceDoc: "Required for AHI score",
      found: false,
    },
  ];

  const extractedData = [
    {
      parameter: "A1c Level",
      value: "6.4%",
      sourceDoc: "Lab Results 2023-02-01",
      isNormal: true,
      found: true,
    },
    {
      parameter: "AHI Score",
      value: "Not Found",
      sourceDoc: "Sleep Study 2023-03-10",
      isNormal: false,
      found: false,
    },
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (<DemoSignupForm onComplete={handleSignupComplete} />);
      case 1:
        return <RulesDesignerComponent handleStepChange={handleStepChange} />;
      case 2:
        return (
          <WorkbenchComponent
            workbenchSection={workbenchSection}
            handleWorkbenchSectionClick={handleWorkbenchSectionClick}
            diabetesIcdCodes={diabetesIcdCodes}
            sleepApneaIcdCodes={sleepApneaIcdCodes}
            handleSourceClick={handleSourceClick}
            isReferred={isReferred}
            extractedData={extractedData}
            referralReason="Missing AHI Score data in EHR"
          />
        );
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
        <div className="flex justify-between mb-4">
          <Button
        variant="outlined"
        onClick={handleMenuClick}
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
        </div>
      )}
      {renderStep()}
    </Layout>
  );
};

export default Index;