import { useState, useRef, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useConverterQueries } from '@/queries/converter.queries';
import SEO from '@/components/SEO';

export default function JsonToXmlConverterPage() {
  const [xml, setXml] = useState('');
  const [json, setJson] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const converterQueries = useConverterQueries();
  const jsonToXml = converterQueries.jsonToXml;

  const handleXmlChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setXml(event.target.value);
  };

  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJson(event.target.value);
    setFileName(null);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json') && file.type !== 'application/json' && !file.type.includes('json')) {
      toast.error('Please upload a JSON file', { position: 'top-center' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJson(text);
      setFileName(file.name);
      toast.success('JSON file loaded', { position: 'top-center' });
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

  const handleDownload = async () => {
    const jsonObj = JSON.parse(json);

    void jsonToXml.mutate(jsonObj, {
      onSuccess: (data: { xml: string }) => {
        setXml(data.xml);

        // Get the file name from the JSON file
        const fileBaseName = fileName?.split('.')[0] || 'converted';

        // Create a blob and trigger download
        const blob = new Blob([data.xml], { type: 'application/xml' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileBaseName}.xml`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('XML file downloaded', { position: 'top-center' });
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
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <SEO
        title="JSON to XML Converter - Tools For Frontend"
        description="Convert JSON to XML format instantly. Free online JSON to XML converter tool for developers."
        keywords="json to xml, json converter, xml converter, json to xml converter, convert json"
        ogTitle="JSON to XML Converter - Tools For Frontend"
        ogDescription="Convert JSON to XML format instantly."
        canonicalUrl="https://toolsforfrontend.com/converter/json-to-xml"
      />
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-bold">JSON to XML Converter</h1>
          <p className="text-gray-500">Convert JSON to XML.</p>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <Label htmlFor="xml-input">JSON</Label>
              <div className="flex items-center gap-2">
                {fileName && (
                  <span className="text-sm text-gray-500">File: {fileName}</span>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm"
                >
                  Upload File
                </Button>
              </div>
            </div>
            <textarea value={json} id="xml-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleJsonChange} placeholder="Paste JSON here or upload a file" />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="json-input">XML <span className="text-xs">(Read Only)</span></Label>
            <textarea readOnly value={xml} id="json-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleXmlChange} />
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload}>Download</Button>
              <Button onClick={handleCopy}>Copy</Button>
              <Button variant="destructive-min" onClick={handleClear}>Clear</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}