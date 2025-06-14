
import { GitBranch } from "lucide-react";

export const PageHeader = () => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-border">
      <div className="flex items-center gap-3 mb-4 sm:mb-0">
        <GitBranch className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Legacy Code Converter</h1>
      </div>
    </header>
  );
};
