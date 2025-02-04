import { useState } from "react";
import { Layout } from "@/components/Layout";
import { IcdCodeCard } from "@/components/IcdCodeCard";
import { RuleTree } from "@/components/RuleTree";
import { AssessmentResult } from "@/components/AssessmentResult";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [step, setStep] = useState(1);
  const [isReferred, setIsReferred] = useState(false);

  const handleSourceClick = (doc: string) => {
    // Track source document views
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'view_source', {
        document_name: doc,
        step: step
      });
    }
    toast.info(`Opening source document: ${doc}`);
  };

  const handleRefer = () => {
    // Track case referrals
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'refer_case', {
        reason: 'Missing AHI Score data in EHR'
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
        to_step: newStep
      });
    }
    setStep(newStep);
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

  const ruleTreeData = {
    title: "Medical Assessment",
    children: [
      {
        title: "Type 2 Diabetes",
        children: [
          {
            title: "A1c Level",
            threshold: "≤ 7.0%",
            action: "If not found, refer case",
          },
        ],
      },
      {
        title: "Sleep Apnea",
        children: [
          {
            title: "AHI Score",
            threshold: "< 5 events/hour",
            action: "If not found, refer case",
          },
        ],
      },
    ],
  };

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
      case 1:
        return (
          <div>
            <IcdCodeCard
              title="Type 2 Diabetes ICD-10 Codes"
              codes={diabetesIcdCodes}
              onSourceClick={handleSourceClick}
            />
            <IcdCodeCard
              title="Sleep Apnea ICD-10 Codes"
              codes={sleepApneaIcdCodes}
              onSourceClick={handleSourceClick}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={() => handleStepChange(2)}>View Rules Analysis →</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <RuleTree data={ruleTreeData} onRefer={handleRefer} />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => handleStepChange(1)}>
                ← Back to ICD Codes
              </Button>
              <Button onClick={() => handleStepChange(3)}>View Assessment →</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <AssessmentResult
              riskClass={isReferred ? "Referred" : "Standard"}
              extractedData={extractedData}
              onSourceClick={handleSourceClick}
              isReferred={isReferred}
              referralReason="Missing AHI Score data in EHR"
            />
            <div className="flex justify-start mt-6">
              <Button variant="outline" onClick={() => handleStepChange(2)}>
                ← Back to Rules Analysis
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <Layout step={step}>{renderStep()}</Layout>;
};

export default Index;