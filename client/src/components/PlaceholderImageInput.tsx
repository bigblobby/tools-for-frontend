import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group.tsx';
import { IconCheck, IconCopy, IconExternalLink } from '@tabler/icons-react';
import { useState, memo } from 'react';

interface PlaceholderImageInputProps {
  url: string;
}

function PlaceholderImageInput({
                                 url,
}: PlaceholderImageInputProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <InputGroup>
      <InputGroupInput value={url} readOnly onClick={
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
            window.open(url, "_blank")
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
          onClick={copyToClipboard}
        >
          {isCopied ? <IconCheck /> : <IconCopy />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export default memo(PlaceholderImageInput, (prevProps, nextProps) => {
  // This has been added because the React profiler is saying its re-rendering all the PlaceholderImageInput components
  // when the copy is clicked even though it isn't... apparently this is something to do with reconciliation checks, but
  // this needs more investigation, for now this fixes the problem.
  return prevProps.url === nextProps.url;
});