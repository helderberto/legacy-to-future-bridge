
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Wand2, Download, GitBranch } from "lucide-react";
import { convertCode } from "@/lib/api";
import { downloadFile } from "@/lib/download";

const techStacks = ["React", "Vue", "Svelte", "Angular", "English"];
const fromLanguages = ["Ember", "Backbone.js", "jQuery", "AngularJS", "Vanilla JS"];

const Index = () => {
  const [legacyCode, setLegacyCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [targetStack, setTargetStack] = useState("React");
  const [fromLanguage, setFromLanguage] = useState("Ember");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async () => {
    if (!legacyCode) {
      toast.error("Please paste your legacy code first.");
      return;
    }
    if (!apiKey) {
      toast.error("Please enter your Perplexity API key.");
      return;
    }

    setIsLoading(true);
    setGeneratedCode("");

    try {
      const result = await convertCode({
        code: legacyCode,
        fromLanguage,
        toLanguage: targetStack,
        apiKey,
      });
      setGeneratedCode(result);
      toast.success("Conversion successful!");
    } catch (error) {
      toast.error("An error occurred during conversion. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDocumentation = targetStack.toLowerCase() === 'english';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4 md:p-6 lg:p-8 font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <GitBranch className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Legacy Code Converter</h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            type="password"
            placeholder="Perplexity API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Legacy Code</h2>
          <Textarea
            placeholder="Paste your legacy code here..."
            className="flex-grow resize-none font-mono text-sm bg-secondary/50 border-border"
            value={legacyCode}
            onChange={(e) => setLegacyCode(e.target.value)}
            rows={20}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{isDocumentation ? "Migration Document" : "Generated Code"}</h2>
          <Textarea
            placeholder={isLoading ? "Generating..." : "Your new code will appear here."}
            className="flex-grow resize-none font-mono text-sm bg-secondary/50 border-border"
            value={generatedCode}
            readOnly
            rows={20}
          />
        </div>
      </main>

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
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => downloadFile(legacyCode, 'legacy_code.txt', 'text/plain')}><Download className="mr-2 h-4 w-4"/>Legacy</Button>
            <Button variant="outline" onClick={() => downloadFile(generatedCode, isDocumentation ? 'documentation.md' : 'generated_code.txt', isDocumentation ? 'text/markdown' : 'text/plain')}><Download className="mr-2 h-4 w-4"/>{isDocumentation ? "Docs" : "New"}</Button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
