
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Wand2, Download, RotateCcw } from "lucide-react";
import { downloadFile } from "@/lib/download";
import { generateLegacyAnalysisMarkdown } from "@/lib/markdown";

interface FooterActionsProps {
  fromLanguage: string;
  setFromLanguage: (value: string) => void;
  fromLanguages: string[];
  targetStack: string;
  setTargetStack: (value: string) => void;
  techStacks: string[];
  handleConvert: () => void;
  handleReset: () => void;
  isLoading: boolean;
  legacyCode: string;
  generatedCode: string;
  isDocumentation: boolean;
}

export const FooterActions = ({
  fromLanguage,
  setFromLanguage,
  fromLanguages,
  targetStack,
  setTargetStack,
  techStacks,
  handleConvert,
  handleReset,
  isLoading,
  legacyCode,
  generatedCode,
  isDocumentation,
}: FooterActionsProps) => (
  <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border">
    <div className="flex flex-wrap items-center gap-4">
      <Select value={fromLanguage} onValueChange={setFromLanguage}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="From..." />
        </SelectTrigger>
        <SelectContent>
          {fromLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
        </SelectContent>
      </Select>
      <span className="text-muted-foreground">to</span>
      <Select value={targetStack} onValueChange={setTargetStack}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="To..." />
        </SelectTrigger>
        <SelectContent>
          {techStacks.map(stack => <SelectItem key={stack} value={stack}>{stack}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button onClick={handleConvert} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Wand2 className="mr-2 h-4 w-4" />
        {isLoading ? "Converting..." : "Convert"}
      </Button>
      <Button variant="outline" onClick={handleReset} disabled={isLoading}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        onClick={() =>
          downloadFile(
            legacyCode,
            "legacy_code.txt",
            "text/plain"
          )
        }
        disabled={!legacyCode}
      >
        <Download className="mr-2 h-4 w-4" />
        Legacy Code
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          downloadFile(
            generatedCode,
            isDocumentation ? "documentation.md" : "generated_code.txt",
            isDocumentation ? "text/markdown" : "text/plain"
          )
        }
        disabled={!generatedCode}
      >
        <Download className="mr-2 h-4 w-4" />
        {isDocumentation ? "Docs" : "Generated Code"}
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          downloadFile(
            generateLegacyAnalysisMarkdown(legacyCode),
            "legacy_analysis.md",
            "text/markdown"
          )
        }
        disabled={!legacyCode}
      >
        <Download className="mr-2 h-4 w-4" />
        Legacy Analysis
      </Button>
    </div>
  </footer>
);
