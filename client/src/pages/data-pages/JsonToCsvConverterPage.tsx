import SEO from "@/components/SEO";
import { toast } from "sonner";
import { useState, type ChangeEvent } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useConverterQueries } from '@/queries/converter.queries';

export default function JsonToCsvConverterPage() {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');
  const converterQueries = useConverterQueries();
  const jsonToCsv = converterQueries.jsonToCsv;

  const handleCsvChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCsv(event.target.value);
  };

  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJson(event.target.value);
  };

  const handleDownload = async () => {
    try {
      const jsonObj = JSON.parse(json);

      void jsonToCsv.mutate(jsonObj, {
        onSuccess: (data: { csv: string }) => {
          setCsv(data.csv);

          // Create a blob and trigger download
          const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'converted.csv');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.success('CSV file downloaded', { position: 'top-center' });
        },
        onError: (error: Error) => {
          console.log(error);
          toast.error('Invalid JSON format', { position: 'top-center' });
        },
      });
    } catch (error) {
      toast.error('Invalid JSON format', { position: 'top-center' });
    }
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(csv);
    toast.success('CSV copied to clipboard', { position: 'top-center' });
  };

  const handleClear = () => {
    setCsv('');
    setJson('');
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
      <div className="flex flex-row gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">JSON to CSV Converter</h1>
            <p className="text-gray-500">Convert JSON to CSV.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="csv-input">JSON</Label>
            <textarea value={json} id="xml-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleJsonChange} />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="json-input">CSV <span className="text-xs">(Read Only)</span></Label>
            <textarea readOnly value={csv} id="csv-input" className="block w-full h-80 font-mono border border-gray-300 rounded-md p-2" onChange={handleCsvChange} />
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