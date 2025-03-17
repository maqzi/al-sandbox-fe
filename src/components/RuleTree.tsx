import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RuleNode {
  title: string;
  children?: RuleNode[];
  threshold?: string;
  action?: string;
}

interface RuleTreeProps {
  data: RuleNode;
  onRefer?: () => void;
}

export const RuleTree = ({ data, onRefer }: RuleTreeProps) => {
  const renderNode = (node: RuleNode, level: number = 0) => {
    return (
      <div
        key={node.title}
        className={`ml-${level * 4} ${level > 0 ? "mt-2" : ""}`}
      >
        <div className="flex items-center">
          {level > 0 && (
            <div className="w-6 h-px bg-medical-primary mr-2"></div>
          )}
          <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
            <span className="font-semibold text-medical-primary">
              {node.title}
            </span>
            {node.threshold && (
              <span className="ml-2 text-sm text-medical-text">
                Threshold: {node.threshold}
              </span>
            )}
            {node.action && (
              <div className="mt-2 text-sm text-red-500">{node.action}</div>
            )}
          </div>
        </div>
        {node.children && (
          <div className="ml-6">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-medical-primary">Rules Designer</CardTitle>
      </CardHeader>
      <CardContent>
        {renderNode(data)}
        {onRefer && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={onRefer}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600"
            >
              Refer Case
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};