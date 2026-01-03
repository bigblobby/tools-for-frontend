import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group.tsx';
import { IconCheck, IconCopy, IconExternalLink } from '@tabler/icons-react';
import { useState } from 'react';

interface PlaceholderImageInputProps {
  path: string;
}

export default function PlaceholderImageInput({
  path,
}: PlaceholderImageInputProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  const copyToClipboard = () => {
    void navigator.clipboard.writeText(location.origin + path);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }
  
  return (
    <InputGroup>
      <InputGroupInput value={location.origin + path} readOnly onClick={
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
            window.open(location.origin + path, "_blank")
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
          onClick={() => copyToClipboard()}
        >
          {isCopied ? <IconCheck /> : <IconCopy />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}