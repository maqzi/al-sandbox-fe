import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface IcdCodeCardProps {
  title: string;
  codes: Array<{
    code: string;
    description: string;
    sourceDoc: string;
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
              className="flex items-start justify-between p-3 bg-white rounded-lg shadow-sm"
            >
              <div>
                <span className="font-semibold text-medical-primary">
                  {code.code}
                </span>
                <p className="text-medical-text mt-1">{code.description}</p>
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