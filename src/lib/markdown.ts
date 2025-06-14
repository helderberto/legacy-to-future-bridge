
export const generateLegacyAnalysisMarkdown = (code: string): string => {
  return `# Legacy Code Analysis

The following is a high-level overview, structure, and analysis of the provided legacy code.

---

## 1. Code Overview

This section provides an overview of the core logic, main features, and intended behavior present in the legacy code.

\`\`\`
${code.substring(0, 300)}${code.length > 300 ? "..." : ""}
\`\`\`

- **Length**: ${code.length} characters
- **Contains ${code.split('\n').length} lines**

## 2. Key Components & Responsibilities

- **Top-level elements (e.g., classes, components, main functions)**:  
  Try to identify core logged components, exported entities, or main loops.
- **Action handlers (methods, event handlers, etc):**  
  List/add details if you see clearly named or marked functions.

## 3. Data Flow & State Management

- **State variables:**  
  Briefly list any \`@tracked\`, \`useState\`, computed props, or global objects observed.
- **Data flow:**  
  Note if the code fetches from APIs, updates UI from state changes, or handles side effects.

## 4. Dependencies & Integrations

- Any notable imports (libraries, APIs, internal utils):
\`\`\`
${
  code
    .split('\n')
    .filter(l => l.trim().startsWith('import '))
    .join('\n') || "No imports detected."
}
\`\`\`

## 5. Areas of Technical Debt

- Are there detected anti-patterns (e.g., direct DOM manipulation, tight coupling, lack of error handling)?
- Detect manual state sync, duplicated logic, lack of modularization, poor separation of concerns if possible.
- Highlight any “magic values”, very long functions, mix of concerns, etc.

## 6. Summary & Recommendations

- Identify biggest risks for refactoring or migration
- Suggest first steps (e.g., write characterization tests, extract API calls, modularize state).

---

*This document was automatically generated. Please review and edit for completeness and accuracy!*
`;
};
