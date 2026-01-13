import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import md5 from 'md5';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Card } from '@/components/ui/card.tsx';

export default function StringHashGeneratorPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleClearAll = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard');
  };

  const handleClearOutput = () => {
    setOutput('');
  };

  const handleGenerateMD5Hash = () => {
    setOutput(md5(input));
  };

  const handleGenerateSHA256Hash = () => {
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)).then(hash => {
      const hashString = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
      setOutput(hashString);
    });
  };

  const handleGenerateSHA512Hash = () => {
    crypto.subtle.digest('SHA-512', new TextEncoder().encode(input)).then(hash => {
      const hashString = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
      setOutput(hashString);
    });
  };

  return (
    <>
      <SEO
        title="Hash Generator - MD5, SHA-256, SHA-512 - Tools For Frontend"
        description="Generate MD5, SHA-256, and SHA-512 hashes from any string. Free online hash generator tool for developers and security professionals."
        keywords="hash generator, md5 hash, sha256 hash, sha512 hash, hash calculator, string hash"
        ogTitle="Hash Generator - Tools For Frontend"
        ogDescription="Generate MD5, SHA-256, and SHA-512 hashes from any string."
        canonicalUrl="https://toolsforfrontend.com/string/hash-generator"
      />
      <div className="flex flex-row gap-10 max-w-8xl">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Hash Generator</h1>
            <p className="text-muted-foreground">Generate hashes of a string using MD5, SHA-256, and SHA-512.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="string-input">Input</Label>
            <Textarea value={input} id="string-input" className="h-40" onChange={handleInputChange} />

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleGenerateMD5Hash}>MD5</Button>
              <Button onClick={handleGenerateSHA256Hash}>SHA-256</Button>
              <Button onClick={handleGenerateSHA512Hash}>SHA-512</Button>
            </div>
            <div className="flex flex-col gap-3">
              <ButtonGroup>
                <Button variant="destructive-min" onClick={handleClearAll}>Clear All</Button>
              </ButtonGroup>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="string-output">Output <span className="text-xs">(Read Only)</span></Label>
            <Textarea readOnly value={output} id="string-output" className="h-40" />
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCopy}>Copy</Button>
              <Button variant="destructive-min" onClick={handleClearOutput}>Clear</Button>
            </div>
          </div>
        </div>

        <Card className="max-w-[320px] gap-3 p-4">
          <p className="text-sm">
            <span className="font-bold">MD5: </span>
            <span>Generates an MD5 hash of the string</span>
          </p>
          <p className="text-sm">
            <span className="font-bold">SHA-256: </span>
            <span>Generates an SHA-256 hash of the string</span>
          </p>
          <p className="text-sm">
            <span className="font-bold">SHA-512: </span>
            <span>Generates an SHA-512 hash of the string</span>
          </p>
        </Card>
      </div>
    </>
  );
}