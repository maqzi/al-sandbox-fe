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
        <h1 className="text-2xl font-semibold">alitheia Labs: EHRs Prototype</h1>
        <div className="mt-4">
          <Progress value={step * 50} className="h-2" />
        </div>
      </header>
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
};