import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useState } from 'react';

import { encode, decode } from 'he';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

export default function StringEncodeDecodePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [useNamedReferences, setUseNamedReferences] = useState(false);
  const [encodeEverything, setEncodeEverything] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleURLEncode = () => {
    setOutput(encodeURIComponent(input));
  };

  const handleURLDecode = () => {
    setOutput(decodeURIComponent(input));
  };

  const handleBase64Encode = () => {
    setOutput(btoa(input));
  };

  const handleBase64Decode = () => {
    setOutput(atob(input));
  };

  const handleHTMLEntityEncode = () => {
    setOutput(encode(input, { useNamedReferences, encodeEverything }));
  };

  const handleHTMLEntityDecode = () => {
    setOutput(decode(input));
  };

  const handleSetUseNamedReferences = (checked: boolean) => {
    setUseNamedReferences(checked);
  };

  const handleSetEncodeEverything = (checked: boolean) => {
    setEncodeEverything(checked);
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard');
  };

  const handleClearInput = () => {
    setInput('');
  };

  const handleClearOutput = () => {
    setOutput('');
  };

  const handleClearAll = () => {
    handleClearInput();
    handleClearOutput();
    setUseNamedReferences(false);
    setEncodeEverything(false);
  };

  return (
    <>
      <SEO
        title="String Encode Decode - Base64, URL, HTML Entity - Tools For Frontend"
        description="Encode and decode strings to/from Base64, URL encoding, and HTML entities. Free online string encoder and decoder tool for developers."
        keywords="string encode, string decode, base64 encode, base64 decode, url encode, url decode, html entity encode, html entity decode"
        ogTitle="String Encode Decode - Tools For Frontend"
        ogDescription="Encode and decode strings to/from Base64, URL, and HTML Entity formats."
        canonicalUrl="https://toolsforfrontend.com/string/encode-decode"
      />
      <div className="flex flex-row gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Encode Decode</h1>
            <p className="text-gray-500">Encode and decode strings to/from Base64, URL, and HTML Entity.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="string-input">Input</Label>
            <textarea value={input} id="string-input" className="block w-full h-40 border border-gray-300 rounded-md p-2" onChange={handleInputChange}/>
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col gap-2">
                <span className="block text-gray-500 text-sm">Base64</span>
                <ButtonGroup>
                  <Button onClick={handleBase64Encode}>Encode</Button>
                  <Button onClick={handleBase64Decode}>Decode</Button>
                </ButtonGroup>
              </div>
              <div className="flex flex-col gap-2">
                <span className="block text-gray-500 text-sm">URL</span>
                <ButtonGroup>
                  <Button onClick={handleURLEncode}>Encode</Button>
                  <Button onClick={handleURLDecode}>Decode</Button>
                </ButtonGroup>
              </div>
              <div className="flex flex-col gap-2">
                <span className="block text-gray-500 text-sm">HTML Entity</span>
                <div className="flex items-center gap-2">
                  <ButtonGroup>
                    <Button onClick={handleHTMLEntityEncode}>Encode</Button>
                    <Button onClick={handleHTMLEntityDecode}>Decode</Button>
                  </ButtonGroup>
                  <div className="flex flex-row items-center gap-2">
                    <Checkbox id="use-named-references" checked={useNamedReferences} onCheckedChange={handleSetUseNamedReferences}/>
                    <Label htmlFor="use-named-references">Use Named References</Label>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Checkbox id="encode-everything" checked={encodeEverything} onCheckedChange={handleSetEncodeEverything}/>
                    <Label htmlFor="encode-everything">Encode Everything</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <ButtonGroup>
                <Button variant="destructive-min" onClick={handleClearAll}>Clear All</Button>
              </ButtonGroup>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="string-output">Output <span className="text-xs">(Read Only)</span></Label>
            <textarea readOnly value={output} id="string-output" className="block w-full h-40 border border-gray-300 rounded-md p-2"/>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCopy}>Copy</Button>
              <Button variant="destructive-min" onClick={handleClearOutput}>Clear</Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col max-w-[320px] gap-3 bg-zinc-100 p-4 rounded-md">
          <div>
            <h3 className="mb-2 font-bold text-gray-500">Base64</h3>
            <p className="text-gray-500 text-sm">Encode or decode the string to/from Base64.</p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-gray-500">URL</h3>
            <p className="text-gray-500 text-sm">Encode or decode the string to/from URL.</p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-gray-500">HTML Entity</h3>
            <p className="text-gray-500 text-sm mb-2">
              Encode or decode the string to/from HTML Entity using named references and encode everything.
            </p>
            <p className="text-gray-500 text-sm mb-2"><span className="font-bold">
              Use Named References: </span>Named references are HTML entities like &amp;amp;, &amp;lt;, &amp;gt;, &amp;quot;, &amp;apos;, &amp;nbsp;, etc.
            </p>
            <p className="text-gray-500 text-sm mb-2"><span className="font-bold">
              Encode Everything: </span>Encode everything is a flag that tells the encoder to encode all characters, not just the ones that need to be encoded.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}