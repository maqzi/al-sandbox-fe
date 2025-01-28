import { useState } from "react";
import { Layout } from "@/components/Layout";
import { IcdCodeCard } from "@/components/IcdCodeCard";
import { RuleTree } from "@/components/RuleTree";
import { AssessmentResult } from "@/components/AssessmentResult";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [step, setStep] = useState(1);

  const handleSourceClick = (doc: string) => {
    toast.info(`Opening source document: ${doc}`);
  };

  const diabetesIcdCodes = [
    {
      code: "E11.9",
      description: "Type 2 diabetes mellitus without complications",
      sourceDoc: "Medical Record 2023-01-15",
    },
    {
      code: "E11.65",
      description: "Type 2 diabetes mellitus with hyperglycemia",
      sourceDoc: "Lab Results 2023-02-01",
    },
  ];

  const sleepApneaIcdCodes = [
    {
      code: "G47.33",
      description: "Obstructive sleep apnea (adult) (pediatric)",
      sourceDoc: "Sleep Study 2023-03-10",
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
          },
        ],
      },
      {
        title: "Sleep Apnea",
        children: [
          {
            title: "AHI Score",
            threshold: "< 5 events/hour",
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
    },
    {
      parameter: "AHI Score",
      value: "3.2 events/hour",
      sourceDoc: "Sleep Study 2023-03-10",
      isNormal: true,
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
              <Button onClick={() => setStep(2)}>View Rules Analysis →</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <RuleTree data={ruleTreeData} />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                ← Back to ICD Codes
              </Button>
              <Button onClick={() => setStep(3)}>View Assessment →</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <AssessmentResult
              riskClass="Standard"
              extractedData={extractedData}
              onSourceClick={handleSourceClick}
            />
            <div className="flex justify-start mt-6">
              <Button variant="outline" onClick={() => setStep(2)}>
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