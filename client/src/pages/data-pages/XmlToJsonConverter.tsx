import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';
import { useConverterQueries } from '@/queries/converter.queries.tsx';
import SEO from '@/components/SEO';

export default function XmlToJsonConverter() {
  const [xml, setXml] = useState('');
  const [json, setJson] = useState('');
  const converterQueries = useConverterQueries();
  const xmlToJson = converterQueries.XmlToJson;

  const handleXmlChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setXml(event.target.value);
  };

  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJson(event.target.value);
  };

  const handleConvert = async () => {
    void xmlToJson.mutate(xml, {
      onSuccess: (data: { json: string }) => {
        setJson(data.json);
      },
      onError: (error: Error) => {
        console.log(error);
        toast.error('Invalid XML format', { position: 'top-center' });
      },
    });
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(json);
    toast.success('JSON copied to clipboard', { position: 'top-center' });
  };

  const handleClear = () => {
    setXml('');
    setJson('');
  };

  return (
    <>
      <SEO
        title="XML to JSON Converter - Tools For Frontend"
        description="Convert XML to JSON format instantly. Free online XML to JSON converter tool for developers."
        keywords="xml to json, xml converter, json converter, xml to json converter, convert xml"
        ogTitle="XML to JSON Converter - Tools For Frontend"
        ogDescription="Convert XML to JSON format instantly."
        canonicalUrl="https://toolsforfrontend.com/converter/xml-to-json"
      />
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-bold">XML to JSON Converter</h1>
          <p className="text-gray-500">Convert XML to JSON.</p>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor="xml-input">XML</Label>
            <textarea value={xml} id="xml-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleXmlChange}/>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="json-input">JSON <span className="text-xs">(Read Only)</span></Label>
            <textarea readOnly value={json} id="json-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleJsonChange}/>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleConvert}>Convert</Button>
            <Button variant="secondary" onClick={handleCopy}>Copy</Button>
            <Button variant="destructive-min" onClick={handleClear}>Clear</Button>
          </div>
        </div>
      </div>
    </>
  );
}