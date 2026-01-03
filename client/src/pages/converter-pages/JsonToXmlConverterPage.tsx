import { useState, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useConverterQueries } from '@/queries/converter.queries';

export default function JsonToXmlConverterPage() {
  const [xml, setXml] = useState('');
  const [json, setJson] = useState('');
  const converterQueries = useConverterQueries();
  const jsonToXml = converterQueries.jsonToXml;

  const handleXmlChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setXml(event.target.value);
  };

  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJson(event.target.value);
  };

  const handleConvert = async () => {
    const jsonObj = JSON.parse(json);

    void jsonToXml.mutate(jsonObj, {
      onSuccess: (data: { xml: string }) => {
        setXml(data.xml);
      },
      onError: (error: Error) => {
        console.log(error);
        toast.error('Invalid JSON format', { position: 'top-center' });
      },
    });
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(xml);
    toast.success('XML copied to clipboard', { position: 'top-center' });
  };

  const handleClear = () => {
    setXml('');
    setJson('');
  };

  return (
    <div className="flex flex-row gap-10">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">JSON to XML Converter</h1>
          <p className="text-gray-500">This page converts JSON to XML.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="xml-input">JSON</Label>
          <textarea value={json} id="xml-input" className="block w-full h-80 border border-gray-300 rounded-md p-2" onChange={handleJsonChange}/>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="json-input">XML <span className="text-xs">(Read Only)</span></Label>
          <textarea readOnly value={xml} id="json-input" className="block w-full h-80 border border-gray-300 rounded-md p-2" onChange={handleXmlChange}/>
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