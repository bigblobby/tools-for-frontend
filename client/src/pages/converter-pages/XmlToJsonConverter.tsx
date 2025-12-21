import { useState } from 'react';
import { xml2json } from 'xml-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';

export default function XmlToJsonConverter() {
  const [xml, setXml] = useState("");
  const [json, setJson] = useState("");

  const handleXmlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setXml(event.target.value);
  }

  const handleJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJson(event.target.value);
  }

  const handleConvert = () => {
    setJson(xml2json(xml, { compact: true, spaces: 2 }));
  }
  
  const handleCopy = () => {
    void navigator.clipboard.writeText(json);
    toast.success('JSON copied to clipboard', { position: 'top-center' });
  }

  const handleClear = () => {
    setXml("");
    setJson("");
  }

  return (
    <div className="flex flex-row gap-10">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">XML to JSON Converter</h1>
          <p className="text-gray-500">This page converts XML to JSON.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="xml-input">XML</Label>
          <textarea value={xml} id="xml-input" className="block w-full h-40 border border-gray-300 rounded-md p-2" onChange={handleXmlChange} />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="json-input">JSON <span className="text-xs">(Read Only)</span></Label>
          <textarea readOnly value={json} id="json-input" className="block w-full h-40 border border-gray-300 rounded-md p-2" onChange={handleJsonChange} />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleConvert}>Convert</Button>
          <Button variant="secondary" onClick={handleCopy}>Copy</Button>
          <Button variant="destructive-min" onClick={handleClear}>Clear</Button>
        </div>
      </div>
    </div>
  );
}