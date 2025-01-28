import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface IcdCodeCardProps {
  title: string;
  codes: Array<{
    code: string;
    description: string;
    sourceDoc: string;
    found: boolean;
  }>;
  onSourceClick: (doc: string) => void;
}

export const IcdCodeCard = ({ title, codes, onSourceClick }: IcdCodeCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-medical-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {codes.map((code) => (
            <div
              key={code.code}
              className={`flex items-start justify-between p-3 ${
                code.found ? "bg-white" : "bg-red-50"
              } rounded-lg shadow-sm`}
            >
              <div>
                <span
                  className={`font-semibold ${
                    code.found
                      ? "text-medical-primary"
                      : "text-red-500 font-bold"
                  }`}
                >
                  {code.code}
                </span>
                <p
                  className={`${
                    code.found ? "text-medical-text" : "text-red-600"
                  } mt-1`}
                >
                  {code.description}
                </p>
                {!code.found && (
                  <p className="text-sm text-red-500 mt-1">Not found in EHR</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSourceClick(code.sourceDoc)}
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
  );
};