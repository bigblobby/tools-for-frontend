import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group.tsx';
import {
  IconCheck,
  IconCopy,
  IconExternalLink,
} from "@tabler/icons-react"
import { useState } from 'react';

export default function ImagePlaceholderGeneratorPage() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (content: string) => {
    void navigator.clipboard.writeText(content);
  }

  return (
    <div className="flex flex-row gap-10">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Image placeholder generator</h1>
          <p className="text-gray-500">Generate placeholder images of any size</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="max-w-sm">
            <div className="flex flex-col gap-3">
              <div>
                <img src={location.origin + "/placeholder/400x400"} alt="" />
              </div>
              <InputGroup>
                <InputGroupInput value={location.origin + "/placeholder/400x400"} readOnly onClick={
                  (event) => {
                    (event.target as HTMLInputElement).select();
                  }
                } />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Open"
                    title="Open"
                    size="icon-xs"
                    onClick={() => {
                      window.open(location.origin + "/placeholder/400x400", "_blank")
                    }}
                  >
                    {<IconExternalLink />}
                  </InputGroupButton>
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Copy"
                    title="Copy"
                    size="icon-xs"
                    onClick={() => {
                      copyToClipboard("http://localhost:3002/placeholder/400x400");
                      setIsCopied(true);
                    }}
                  >
                    {isCopied ? <IconCheck /> : <IconCopy />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}