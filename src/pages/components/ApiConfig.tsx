
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiConfigProps {
  apiProvider: string;
  setApiProvider: (value: string) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
  apiProviders: string[];
}

export const ApiConfig = ({
  apiProvider,
  setApiProvider,
  apiKey,
  setApiKey,
  apiProviders,
}: ApiConfigProps) => {
  return (
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
  );
};
