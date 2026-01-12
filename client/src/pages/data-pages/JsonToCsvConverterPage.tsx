import SEO from "@/components/SEO";
import { toast } from "sonner";
import { useState, useRef, type ChangeEvent } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useConverterQueries } from '@/queries/converter.queries';

export default function JsonToCsvConverterPage() {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const converterQueries = useConverterQueries();
  const jsonToCsv = converterQueries.jsonToCsv;
  const loading = jsonToCsv.isPending;

  const handleCsvChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCsv(event.target.value);
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
      toast.error('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJson(text);
      setFileName(file.name);
      toast.success('JSON file loaded');
    };
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    reader.readAsText(file);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async () => {
    try {
      const jsonObj = JSON.parse(json);

      void jsonToCsv.mutate(jsonObj, {
        onSuccess: (data: { csv: string }) => {
          setCsv(data.csv);

          // Get the file name from the JSON file
          const fileBaseName = fileName?.split('.')[0] || 'converted';

          // Create a blob and trigger download
          const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `${fileBaseName}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.success('CSV file downloaded');
        },
        onError: (error: Error) => {
          console.log(error);
          toast.error('Invalid JSON format');
        },
      });
    } catch (error: unknown) {
      console.log(error);
      toast.error('Invalid JSON format');
    }
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(csv);
    toast.success('CSV copied to clipboard');
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
        title="JSON to CSV Converter - Tools For Frontend"
        description="Convert JSON to CSV format instantly. Free online JSON to CSV converter tool for developers."
        keywords="json to csv, json converter, csv converter, json to csv converter, convert json"
        ogTitle="JSON to CSV Converter - Tools For Frontend"
        ogDescription="Convert JSON to CSV format instantly."
        canonicalUrl="https://toolsforfrontend.com/converter/json-to-csv"
      />
      <div className="flex flex-col gap-10 max-w-8xl">
        <div>
          <h1 className="text-2xl font-bold">JSON to CSV Converter</h1>
          <p className="text-gray-500">Convert JSON to CSV.</p>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <Label htmlFor="csv-input">JSON</Label>
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
            <Label htmlFor="json-input">CSV <span className="text-xs">(Read Only)</span></Label>
            <textarea readOnly value={csv} id="csv-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleCsvChange} />
            <div className="flex flex-wrap gap-3">
              <Button className="min-w-24" onClick={handleDownload}>
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-white/20 rounded-full animate-spin"></div>
                ) : (
                  'Download'
                )}
              </Button>
              <Button onClick={handleCopy}>Copy</Button>
              <Button variant="destructive-min" onClick={handleClear}>Clear</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}