import { useState } from "react";
import { Button } from "@/components/ui/button";
import { javascript } from "@codemirror/lang-javascript";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { placeholder as codemirrorPlaceholder } from "@codemirror/view";
import { toast } from "sonner";
import { convertCode } from "@/lib/api";
import {
  apiProviders,
  fromLanguages,
  techStacks,
  getSampleCode,
  sampleReactCodeFromLegacy,
  sampleVueCodeFromLegacy,
  sampleSvelteCodeFromLegacy,
  sampleAngularCodeFromLegacy,
} from "@/lib/samples";
import { generateLegacyAnalysisMarkdown } from "@/lib/markdown";
import { PageHeader } from "./components/PageHeader";
import { ApiConfig } from "./components/ApiConfig";
import { CodeEditor } from "./components/CodeEditor";
import { FooterActions } from "./components/FooterActions";

const Index = () => {
  const [legacyCode, setLegacyCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [targetStack, setTargetStack] = useState("React");
  const [fromLanguage, setFromLanguage] = useState("Ember");
  const [isLoading, setIsLoading] = useState(false);
  const [apiProvider, setApiProvider] = useState("Demo");
  const [apiKey, setApiKey] = useState("");

  const handleConvert = async () => {
    if (!legacyCode) {
      toast.error("Please paste your legacy code first.");
      return;
    }
    if (apiProvider !== 'Demo' && !apiKey) {
      toast.error(`Please enter your ${apiProvider} API key.`);
      return;
    }
    setIsLoading(true);
    setGeneratedCode("");

    if (apiProvider === 'Demo') {
      setTimeout(() => {
        let demoResult = "";
        if (targetStack.toLowerCase() === 'english') {
          demoResult = generateLegacyAnalysisMarkdown(legacyCode);
        } else {
          const normalizedLegacy = legacyCode.replace(/\s|"/g, "").toLowerCase();
          const isUserPostsComponent =
            normalizedLegacy.includes("exportdefaultclassuserpostscomponentextendscomponent") &&
            normalizedLegacy.includes("@trackedposts=[]") &&
            normalizedLegacy.includes("asyncfetchposts()") &&
            normalizedLegacy.includes("@action") &&
            normalizedLegacy.includes("template.hbs");

          if (isUserPostsComponent) {
            demoResult = sampleReactCodeFromLegacy;
          } else {
            const legacyLines = legacyCode.split("\n").slice(0, 12).join("\n");
            demoResult = `// Conversion demo: from ${fromLanguage} to ${targetStack}
${legacyLines ? legacyLines : "// (No code provided)"} 
// ... conversion continues ...`;
          }
        }
        setGeneratedCode(demoResult);
        toast.success("Demo conversion successful!");
        setIsLoading(false);
      }, 900);
      return;
    }

    try {
      const result = await convertCode({
        code: legacyCode,
        fromLanguage,
        toLanguage: targetStack,
        apiKey,
        provider: apiProvider,
      });
      setGeneratedCode(result);
      toast.success("Conversion successful!");
    } catch (error) {
      toast.error("An error occurred during conversion. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLegacyCode("");
    setGeneratedCode("");
    toast.info("Fields cleared.");
  };

  const isDocumentation = targetStack.toLowerCase() === 'english';

  const legacyEditorExtensions = [
    javascript({ jsx: true }),
    codemirrorPlaceholder("Paste your legacy code here, or load a sample."),
  ];

  const generatedCodeExtensions = [
    ...(isDocumentation
      ? [markdown({ base: markdownLanguage, codeLanguages: languages })]
      : [javascript({ jsx: true })]),
    codemirrorPlaceholder("Your new code will appear here."),
  ];

  const handleSampleLoad = () => {
    let sample = "";
    if (legacyCode.trim().length === 0) {
      const stackSample = getSampleCode(targetStack);
      if (stackSample) {
        sample = stackSample;
      } else {
        sample = getSampleCode(fromLanguage);
      }
    } else {
      sample = getSampleCode(fromLanguage);
    }
    if (!sample) {
      toast.error("No sample available for this selection.");
    } else {
      setLegacyCode(sample);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4 md:p-6 lg:p-8 font-sans">
      <PageHeader />

      <ApiConfig
        apiProvider={apiProvider}
        setApiProvider={setApiProvider}
        apiKey={apiKey}
        setApiKey={setApiKey}
        apiProviders={apiProviders}
      />

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        <CodeEditor
          title="Legacy Code"
          value={legacyCode}
          onChange={setLegacyCode}
          extensions={legacyEditorExtensions}
          actionButton={
            <Button variant="link" className="text-muted-foreground" onClick={handleSampleLoad}>
              Load Sample
            </Button>
          }
        />
        <CodeEditor
          title={isDocumentation ? "Migration Document" : "Generated Code"}
          value={generatedCode}
          extensions={generatedCodeExtensions}
          readOnly
          isLoading={isLoading}
        />
      </main>

      <FooterActions
        fromLanguage={fromLanguage}
        setFromLanguage={setFromLanguage}
        fromLanguages={fromLanguages}
        targetStack={targetStack}
        setTargetStack={setTargetStack}
        techStacks={techStacks}
        handleConvert={handleConvert}
        handleReset={handleReset}
        isLoading={isLoading}
        legacyCode={legacyCode}
        generatedCode={generatedCode}
        isDocumentation={isDocumentation}
      />
    </div>
  );
};

export default Index;
