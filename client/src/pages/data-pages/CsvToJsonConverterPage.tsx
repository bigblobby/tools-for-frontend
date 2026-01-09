import { useState, useRef, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';
import { useConverterQueries } from '@/queries/converter.queries.tsx';
import SEO from '@/components/SEO';

export default function CsvToJsonConverterPage() {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const converterQueries = useConverterQueries();
  const csvToJson = converterQueries.csvToJson;

  const handleCsvChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCsv(event.target.value);
    setFileName(null);
  };

  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJson(event.target.value);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv' && !file.type.includes('csv')) {
      toast.error('Please upload a CSV file', { position: 'top-center' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsv(text);
      setFileName(file.name);
      toast.success('CSV file loaded', { position: 'top-center' });
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

  const handleConvert = async () => {
    void csvToJson.mutate(csv, {
      onSuccess: (data: { json: string }) => {
        setJson(data.json);
        // Get the file name from the CSV file
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

        toast.success('CSV converted to JSON', { position: 'top-center' });
      },
      onError: (error: Error) => {
        console.log(error);
        toast.error('Invalid CSV format', { position: 'top-center' });
      },
    });
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(json);
    toast.success('JSON copied to clipboard', { position: 'top-center' });
  };

  const handleClear = () => {
    setCsv('');
    setJson('');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <SEO
        title="CSV to JSON Converter - Tools For Frontend"
        description="Convert CSV to JSON format instantly. Free online CSV to JSON converter tool for developers."
        keywords="csv to json, csv converter, json converter, csv to json converter, convert csv"
        ogTitle="CSV to JSON Converter - Tools For Frontend"
        ogDescription="Convert CSV to JSON format instantly."
        canonicalUrl="https://toolsforfrontend.com/converter/csv-to-json"
      />
      <div className="flex flex-row gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">CSV to JSON Converter</h1>
            <p className="text-gray-500">Convert CSV to JSON.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <Label htmlFor="csv-input">CSV</Label>
              <div className="flex items-center gap-2">
                {fileName && (
                  <span className="text-sm text-gray-500">File: {fileName}</span>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
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
            <textarea value={csv} id="csv-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleCsvChange} placeholder="Paste CSV here or upload a file" />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="json-input">JSON <span className="text-xs">(Read Only)</span></Label>
            <textarea readOnly value={json} id="json-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleJsonChange} />
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

