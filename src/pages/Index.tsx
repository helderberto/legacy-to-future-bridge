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
import fetch from 'fetch';

export default class UserPostsComponent extends Component {
  @tracked posts = [];
  @tracked isLoading = false;
  @tracked error = null;

  constructor() {
    super(...arguments);
    this.fetchPosts();
  }

  async fetchPosts() {
    this.isLoading = true;
    this.error = null;
    try {
      let response = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1');
      let data = await response.json();
      this.posts = data;
    } catch (e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  refreshPosts() {
    this.fetchPosts();
  }
}

// template.hbs
<div class="user-posts">
  <button {{on "click" this.refreshPosts}}>Refresh</button>
  {{#if this.isLoading}}
    <p>Loading...</p>
  {{else if this.error}}
    <p class="error">Error: {{this.error}}</p>
  {{else}}
    <ul>
      {{#each this.posts as |post|}}
        <li>
          <strong>{{post.title}}</strong>
          <p>{{post.body}}</p>
        </li>
      {{/each}}
    </ul>
  {{/if}}
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

const sampleMigrationDocument = `# Migration Analysis: Ember UserPosts Component ➡️ Modern Tech Stack

## 1. Overview
The legacy code is an Ember component that fetches and displays posts for a user from an external API (\`jsonplaceholder.typicode.com\`). The component handles loading, displays errors, and supports refreshing data on demand.

## 2. Key Components
- **UserPostsComponent (JavaScript class):** Contains state for posts, loading, and error. Encapsulates all logic for data fetching and refreshing.
- **Template (Handlebars):** Renders a button, loading and error states, and lists fetched posts.

## 3. Data Flow
- On instantiation, the component automatically fetches posts from an external API.
- State variables (\`posts\`, \`isLoading\`, \`error\`) are tracked and trigger re-renders.
- User interaction ("Refresh" button) calls an action to re-fetch posts.
- Data flows from the async fetch into the component’s state, then to the UI via the template.

## 4. State Management
- Uses Ember's \`@tracked\` decorators to make \`posts\`, \`isLoading\`, and \`error\` reactive.
- State updates within async methods and actions automatically update the UI.

## 5. Migration Strategy (Based on "Working Effectively with Legacy Code")
- **Characterize Dependencies:** The component depends on Ember decorators, the fetch polyfill, and Ember’s event system.
- **Write Tests Around Existing Behavior:** Cover data loading, error handling, and UI updates in integration tests.
- **Break External Dependencies:** Abstract the fetch logic to a plain JS/TS function and decouple it from Ember’s lifecycle and decorators.
- **Extract and Isolate:** Move API logic and state management out of the Ember-specific class for easier testing.
- **Incremental Conversion:** 
  - First, port data fetching and state logic to the target stack's idioms (e.g., React’s useState/useEffect, Vue’s reactivity, etc.).
  - Migrate templates, restructuring the control flow (if/else, loops) to JSX/Vue/Svelte equivalents.
  - Replace tracked properties with the target stack's reactivity system.
  - Validate data fetching and error handling via tests.

## 6. Potential Challenges
- **Template Flow Differences:** Handlebars blocks must be mapped to new conditional and loop syntax.
- **Reactivity:** Tracked properties need to be translated to hooks, computed properties, or the target system’s reactive primitives.
- **Async Effects:** Lifecycle hooks for data fetching (\`constructor\` in Ember) should move to useEffect (React) or lifecycle hooks in Vue/Svelte.
- **Event Binding:** {{on "click"}} must be replaced with new stack's event bindings.
- **Testing:** Ensure error/loading states remain correctly covered after migration.

---

**Next Steps:**  
1. Write tests that specify post-fetching and UI behavior.
2. Extract API logic to standalone utilities.
3. Migrate to target stack incrementally, preserving tests at each step.
4. Refactor and enhance as needed for idiomatic use in the new framework.

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
