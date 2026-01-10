import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

export default function JSONFormatterPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [spaces, setSpaces] = useState(2);

  const handleFormatJson = (spaces?: number) => {
    if (!jsonInput.trim().length) {
      toast.error('No JSON added.');
      return;
    }

    const formattedJSON = JSON.stringify(JSON.parse(jsonInput), null, spaces);

    setJsonOutput(formattedJSON);
  };

  const handleBeautifyJson = () => {
    handleFormatJson(spaces);
  };

  const handleMinifyJson = () => {
    handleFormatJson();
  };

  const handleCopyJsonOutput = () => {
    void navigator.clipboard.writeText(jsonOutput);
    toast.success('Copied to clipboard', { position: 'top-center' });
  };

  const handleClearAll = () => {
    setJsonInput('');
    setJsonOutput('');
  };

  return (
    <>
      <SEO
        title="JSON Formatter - Beautify & Minify JSON - Tools For Frontend"
        description="Beautify and minify JSON with customizable indentation. Free online JSON formatter and validator tool for developers."
        keywords="json formatter, json beautify, json minify, json validator, json prettifier, format json"
        ogTitle="JSON Formatter - Tools For Frontend"
        ogDescription="Beautify and minify JSON with customizable indentation."
        canonicalUrl="https://toolsforfrontend.com/string/json-formatter"
      />
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-bold">JSON formatter</h1>
          <p className="text-gray-500">Beautify or minify JSON.</p>
        </div>

        <div className="flex row gap-10">
          <div className="flex-1 flex flex-col gap-3">
            <Label htmlFor="input">Input</Label>
            <textarea value={jsonInput} rows={30} id="input" className="block w-full font-mono border border-gray-300 rounded-md p-2" onChange={(e) => setJsonInput(e.target.value)}/>
          </div>
          <div className="flex flex-col gap-3 mt-10">
            <Label>Number of spaces</Label>
            <Select value={String(spaces)} onValueChange={(value) => setSpaces(Number(value))}>
              <SelectTrigger className="w-40 xl:w-60">
                <SelectValue placeholder="Number of spaces"/>
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleBeautifyJson}>Beautify</Button>
            <Button onClick={handleMinifyJson}>Minify</Button>
            <Button onClick={handleCopyJsonOutput}>Copy Output</Button>
            <Button variant="destructive-min" onClick={handleClearAll}>Clear All</Button>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <Label htmlFor="output">Output <span className="text-xs">(Read Only)</span></Label>
            <textarea value={jsonOutput} readOnly rows={30} id="output" className="block w-full font-mono border border-gray-300 rounded-md p-2"/>
          </div>
        </div>
      </div>
    </>
  );
}