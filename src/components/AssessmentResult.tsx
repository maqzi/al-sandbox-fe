import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface AssessmentResultProps {
  riskClass: string;
  extractedData: Array<{
    parameter: string;
    value: string;
    sourceDoc: string;
    isNormal: boolean;
  }>;
  onSourceClick: (doc: string) => void;
}

export const AssessmentResult = ({
  riskClass,
  extractedData,
  onSourceClick,
}: AssessmentResultProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-medical-primary">Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 bg-medical-success/10 rounded-lg">
            <span className="text-2xl font-semibold text-medical-success">
              {riskClass}
            </span>
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
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
              >
                <div>
                  <span className="font-semibold text-medical-text">
                    {data.parameter}
                  </span>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-lg ${
                        data.isNormal
                          ? "text-medical-success"
                          : "text-medical-warning"
                      }`}
                    >
                      {data.value}
                    </span>
                    {data.isNormal && (
                      <span className="ml-2 text-sm text-medical-success">
                        (Normal Range)
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