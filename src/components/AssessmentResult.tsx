import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle } from "lucide-react";

interface AssessmentResultProps {
  riskClass: string;
  extractedData: Array<{
    parameter: string;
    value: string;
    sourceDoc: string;
    isNormal: boolean;
    found: boolean;
  }>;
  onSourceClick: (doc: string) => void;
  isReferred: boolean;
  referralReason: string;
}

export const AssessmentResult = ({
  riskClass,
  extractedData,
  onSourceClick,
  isReferred,
  referralReason,
}: AssessmentResultProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-medical-primary">Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-center p-4 ${
              isReferred ? "bg-red-100" : "bg-medical-success/10"
            } rounded-lg`}
          >
            <span
              className={`text-2xl font-semibold ${
                isReferred ? "text-red-600" : "text-medical-success"
              }`}
            >
              {riskClass}
            </span>
            {isReferred && (
              <div className="mt-4 flex items-center justify-center text-red-600 gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span>{referralReason}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-medical-primary">Extracted Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {extractedData.map((data) => (
              <div
                key={data.parameter}
                className={`flex items-center justify-between p-3 ${
                  data.found ? "bg-white" : "bg-red-50"
                } rounded-lg shadow-sm`}
              >
                <div>
                  <span className="font-semibold text-medical-text">
                    {data.parameter}
                  </span>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-lg ${
                        !data.found
                          ? "text-red-500 font-bold"
                          : data.isNormal
                          ? "text-medical-success"
                          : "text-medical-warning"
                      }`}
                    >
                      {data.value}
                    </span>
                    {data.found && data.isNormal && (
                      <span className="ml-2 text-sm text-medical-success">
                        (Normal Range)
                      </span>
                    )}
                    {!data.found && (
                      <span className="ml-2 text-sm text-red-500">
                        (Not Found in EHR)
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSourceClick(data.sourceDoc)}
                  className="text-medical-primary hover:text-medical-primary/80"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Source
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};