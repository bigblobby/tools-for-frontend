import { useState, useRef, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';
import { useConverterQueries } from '@/queries/converter.queries.tsx';
import SEO from '@/components/SEO';

export default function XmlToJsonConverter() {
  const [xml, setXml] = useState('');
  const [json, setJson] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const converterQueries = useConverterQueries();
  const xmlToJson = converterQueries.XmlToJson;

  const handleXmlChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setXml(event.target.value);
    setFileName(null);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xml') && file.type !== 'application/xml' && file.type !== 'text/xml' && !file.type.includes('xml')) {
      toast.error('Please upload an XML file', { position: 'top-center' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setXml(text);
      setFileName(file.name);
      toast.success('XML file loaded', { position: 'top-center' });
    };
    reader.onerror = () => {
      toast.error('Error reading file', { position: 'top-center' });
    };
    reader.readAsText(file);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJson(event.target.value);
  };

  const handleDownload = async () => {
    void xmlToJson.mutate(xml, {
      onSuccess: (data: { json: string }) => {
        setJson(data.json);

        // Get the file name from the XML file
        const fileBaseName = fileName?.split('.')[0] || 'converted';

        // Create a blob and trigger download
        const blob = new Blob([data.json], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileBaseName}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('JSON file downloaded', { position: 'top-center' });
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
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            <div className="flex items-end justify-between">
              <Label htmlFor="xml-input">XML</Label>
              <div className="flex items-center gap-2">
                {fileName && (
                  <span className="text-sm text-gray-500">File: {fileName}</span>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xml,application/xml,text/xml"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm"
                >
                  Upload File
                </Button>
              </div>
            </div>
            <textarea value={xml} id="xml-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleXmlChange} placeholder="Paste XML here or upload a file" />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="json-input">JSON <span className="text-xs">(Read Only)</span></Label>
            <textarea readOnly value={json} id="json-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleJsonChange} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleDownload}>Download</Button>
            <Button variant="secondary" onClick={handleCopy}>Copy</Button>
            <Button variant="destructive-min" onClick={handleClear}>Clear</Button>
          </div>
        </div>
      </div>
    </>
  );
}