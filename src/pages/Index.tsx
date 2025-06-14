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
  @tracked currentPage = 1;
  @tracked isLoading = false;
  @tracked error = null;
  @tracked isAuthenticated = false;

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

  @action
  async addPost(title, body) {
    this.isLoading = true;
    this.error = null;
    try {
      let response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      });
      let data = await response.json();
      this.posts.push(data);
    } catch (e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async deletePost(id) {
    this.isLoading = true;
    this.error = null;
    try {
      let response = await fetch('https://jsonplaceholder.typicode.com/posts/' + id, {
        method: 'DELETE',
      });
      if (response.ok) {
        this.posts = this.posts.filter(post => post.id !== id);
      }
    } catch (e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  }
}

// template.hbs
<div class="user-posts">
  <button {{on "click" this.refreshPosts}}>Refresh</button>
  <button {{on "click" this.addPost "New Post" "This is a new post."}}>Add Post</button>
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
The legacy code is an Ember component that fetches and displays posts for a user from an external API (\`jsonplaceholder.typicode.com\`). The component handles loading, displays errors, supports user authentication, paginates posts, and allows post deletion and creation.

## 2. Key Components
- **UserPostsComponent (JavaScript class):** Contains state for posts, current page, user authentication, loading, and errors. Manages async data fetching, post operations, and user permissions.
- **Template (Handlebars):** Renders buttons for loading, adding, and deleting posts, handles multiple UI states (loading, error, paginated list, etc.), binds to component actions.

## 3. Data Flow
- On initialization, the component fetches posts for the authenticated user from an external API.
- State variables (\`posts\`, \`isLoading\`, \`error\`, \`currentPage\`, etc.) are reactive and updated by side-effectful actions.
- Event handlers and API calls propagate updates through component state, which drives the UI via handlebars logic.
- Actions enable users to refresh, paginate, create, or delete posts, interacting with both client state and remote APIs.

## 4. State Management
- Uses Ember's \`@tracked\` decorators for all data properties, ensuring the template updates on state changes.
- State updates (e.g., after API success/error) are performed atomically to prevent UI flicker.
- Errors are tracked per operation, and clear feedback shown to users.

## 5. Migration Strategy (Based on "Working Effectively with Legacy Code")
- **Characterize Dependencies:** Identify reliance on Ember's decorators, fetch utility, event/action system, and handlebars block expressions.
- **Write Tests Around Existing Behavior:** Ensure all interactive states (loading, errors, auth, post CRUD) are covered.
- **Break External Dependencies:** Factor out API logic, authentication flows, and state mutations into standalone modules or hooks.
- **Extract and Isolate:** Incrementally move logic from Ember classes to framework-agnostic services or utilities.
- **Incremental Porting:** 
  - Translate reactivity and async effects to idioms in the new stack (e.g., React hooks, Vue composables).
  - For UI migration, map block and list control to accurate equivalents (JSX, <template v-if>, etc.).
  - Replace event/actions with function props or composables.
  - Test at every stage to validate behavioral parity.
- **Refactor for Testability:** Make side effects and dependencies injectable (to support test doubles).

## 6. Potential Challenges
- **Template Flow Differences:** Handlebars logic for UI states ({{#if}}, {{#each}}...) requires different syntax and sometimes refactoring to fit the new stack’s data-driven views.
- **Reactivity:** Ember’s tracked properties must be mapped to useState/useReducer (React), ref/reactive (Vue), or appropriate Svelte/Angular tools.
- **Async Effects:** Migrate lifecycle hooks and ensure async logic (fetches, CRUD) is compatible with the target framework’s patterns.
- **Event Binding:** Replace {{on "action"}} with new event-binding mechanisms.
- **Authentication:** Abstract and refactor user state/auth guards, leveraging the new stack’s libraries or utilities.
- **Error Boundaries:** Adopt new error handling patterns where needed (e.g., Error Boundaries in React).

---

## 7. **Migration Design Patterns & Principles**

To make the migration process smoother and less risky, apply the following design patterns and principles during refactoring:

### Recommended Design Patterns
- **Adapter Pattern:** Wrap legacy Ember APIs with new interfaces to bridge gaps while migrating functionality.
- **Facade Pattern:** Expose a simplified API for complex modules to reduce coupling and hide implementation details that are likely to change during migration.
- **Dependency Injection:** Decouple logic from Ember-specific systems (fetch, auth) by passing dependencies explicitly, making unit testing and replacement easier.
- **Service Layer:** Centralize business logic and state transition logic outside UI components to facilitate gradual migration and shared logic across stacks.
- **State Reducers:** Use reducers (or Vuex stores, context, etc.) to manage complex state transitions, making side-effects and state updates predictable.

### Principles from "Working Effectively with Legacy Code"
- **Seam Creation:** Use seams (places where you can alter behavior without editing existing code) to inject new implementations and tests.
- **Characterization Tests:** Before refactoring, write tests that describe current behavior to guard against regressions.
- **Sprout Method/Class:** Instead of modifying large legacy methods, create new ones ("sprouts") and shift behavior incrementally.
- **Wrap External Dependencies:** Isolate dependencies (network, window, etc.) behind facades, making it safe to swap implementations or mock in tests.
- **Incremental Refactoring:** Prefer safe, small, testable refactorings over big rewrites.

---

**Next Steps:**  
1. Write comprehensive tests to anchor existing and to-be-migrated logic.
2. Abstract out services and side-effects behind simple APIs/facades.
3. Introduce seams for stepwise migration, using adapters where helpful.
4. Gradually port UI and state layer, keeping legacy and new implementations side-by-side until completely switched.
5. Refactor and improve for idiomatic style in the new framework only after establishing test coverage.

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
