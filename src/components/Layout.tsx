import { ReactNode } from "react";
import { Progress } from "@/components/ui/progress";

interface LayoutProps {
  children: ReactNode;
  step: number;
}

export const Layout = ({ children, step }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-medical-secondary">
      <header className="bg-medical-primary text-white p-4">
        <h1 className="text-2xl font-semibold">Medical Assessment System</h1>
        <div className="mt-4">
          <Progress value={step * 33.33} className="h-2" />
          <div className="flex justify-between mt-2 text-sm">
            <span>ICD-10 Codes</span>
            <span>Rules Analysis</span>
            <span>Assessment</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
};