import { useState } from "react";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { placeholder as codemirrorPlaceholder } from "@codemirror/view";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wand2, Download, GitBranch, RotateCcw } from "lucide-react";
import { convertCode } from "@/lib/api";
import { downloadFile } from "@/lib/download";

const techStacks = ["React", "Vue", "Svelte", "Angular", "English"];
const fromLanguages = ["Ember", "Backbone.js", "jQuery", "AngularJS", "Vanilla JS"];
const apiProviders = ["Demo", "Perplexity", "OpenAI", "Claude"];

const sampleEmberCode = `import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;

  @action
  increment() {
    this.count += 1;
  }

  @action
  decrement() {
    this.count -= 1;
  }
}

// template.hbs
<div class="counter">
  <p>Count: {{this.count}}</p>
  <button {{on "click" this.increment}}>+</button>
  <button {{on "click" this.decrement}}>-</button>
</div>
`;

const sampleReactCode = `import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div className="counter p-4 border rounded-lg">
      <p className="mb-4">Count: {count}</p>
      <div className="flex gap-2">
        <button
          onClick={increment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          +
        </button>
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Counter;`;

const sampleMigrationDocument = `# Migration Analysis: Ember Counter Component ➡️ Modern Tech Stack

## 1. Overview
The provided legacy code is an Ember component implementing a simple counter with increment and decrement actions. It uses tracked properties and template bindings for state and UI updates.

## 2. Key Components
- **CounterComponent (JavaScript class):** Holds the counter logic, state, and methods.
- **Template (Handlebars):** Renders the current count and provides increment/decrement buttons with event bindings.

## 3. Data Flow
- Data (the \`count\` variable) flows from the \`CounterComponent\` class into the template via tracked properties.
- User interacts with buttons, triggering the \`increment\` and \`decrement\` actions, which mutate the state and cause re-render.

## 4. State Management
- State is local to the component and managed with Ember's \`@tracked\` decorator to trigger UI updates.

## 5. Migration Strategy (Based on "Working Effectively with Legacy Code")
- **Characterize Dependencies:** The Counter logic is self-contained but uses Ember framework features (\`@tracked\`, \`@action\`).
- **Write Tests Around the Existing Behavior:** Before refactoring, ensure the counter behavior (increment/decrement) is covered by tests.
- **Break External Dependencies:** Identify framework-specific logic (decorators, template syntax) and plan to abstract or replace them.
- **Extract and Isolate:** Move business logic out of Ember-specific constructs to plain JavaScript/TypeScript classes or functions.
- **Incremental Conversion:** Gradually port the component logic and template to the target stack (React, Vue, Svelte, etc.) while keeping tests green.

## 6. Potential Challenges
- **Template Syntax Differences:** Mapping Handlebars bindings to JSX/Vue/Svelte templates.
- **State Management Patterns:** Translating tracked properties/actions to hooks or the target stack's equivalent.
- **Event Binding Differences:** Migrating \`{{on "click"}}\` to target stack's event system.
- **Testing:** Setting up tests in the new stack to match legacy behavior.

---

**Next Steps:**  
1. Create integration/unit tests for counter behavior.  
2. Abstract business logic from Ember-specific details.  
3. Begin incremental rewrite, validating each step with tests.

---

*Migration guidance leverages principles from "Working Effectively with Legacy Code" by Michael Feathers.*
`;

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
      // Simulate API call for demo purposes
      setTimeout(() => {
        setGeneratedCode(
          targetStack.toLowerCase() === 'english' ? sampleMigrationDocument : sampleReactCode
        );
        toast.success("Demo conversion successful!");
        setIsLoading(false);
      }, 1500);
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4 md:p-6 lg:p-8 font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <GitBranch className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Legacy Code Converter</h1>
        </div>
      </header>

      <section className="py-6 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto">
          <div className={apiProvider === 'Demo' ? 'md:col-span-2' : ''}>
            <Label htmlFor="api-provider">API Provider</Label>
            <Select value={apiProvider} onValueChange={setApiProvider}>
              <SelectTrigger id="api-provider">
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent>
                {apiProviders.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {apiProvider !== 'Demo' && (
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder={`Your ${apiProvider} API Key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          )}
        </div>
      </section>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Legacy Code</h2>
            <Button variant="link" className="text-muted-foreground" onClick={() => setLegacyCode(sampleEmberCode)}>Load Sample</Button>
          </div>
          <div className="flex-grow min-h-[480px] rounded-md border border-input overflow-hidden text-sm">
            <CodeMirror
              value={legacyCode}
              height="100%"
              theme={vscodeDark}
              extensions={legacyEditorExtensions}
              onChange={setLegacyCode}
              style={{ height: '100%' }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{isDocumentation ? "Migration Document" : "Generated Code"}</h2>
          <div className="flex-grow min-h-[480px] rounded-md border border-input overflow-hidden text-sm">
            <CodeMirror
              value={isLoading ? "Generating..." : generatedCode}
              height="100%"
              theme={vscodeDark}
              extensions={generatedCodeExtensions}
              readOnly
              style={{ height: '100%' }}
            />
          </div>
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
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
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
