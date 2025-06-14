
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Extension } from '@codemirror/state';

interface CodeEditorProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  extensions: Extension[];
  readOnly?: boolean;
  isLoading?: boolean;
  actionButton?: React.ReactNode;
}

export const CodeEditor = ({
  title,
  value,
  onChange,
  extensions,
  readOnly = false,
  isLoading = false,
  actionButton,
}: CodeEditorProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {actionButton}
    </div>
    <div className="flex-grow min-h-[480px] rounded-md border border-input overflow-hidden text-sm">
      <CodeMirror
        value={isLoading ? "Generating..." : value}
        height="100%"
        theme={vscodeDark}
        extensions={extensions}
        onChange={onChange}
        readOnly={readOnly}
        style={{ height: '100%' }}
      />
    </div>
  </div>
);
