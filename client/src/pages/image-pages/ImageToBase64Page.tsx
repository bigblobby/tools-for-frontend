import DragAndDrop from '@/components/DragAndDrop.tsx';
import type { DisplayFile } from '@/interfaces/file.interface.ts';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const MAX_FILESIZE = 10 * 1024 * 1024;

export default function ImageToBase64Page() {
  const [format, setFormat] = useState('raw');
  const [currentFile, setCurrentFile] = useState<DisplayFile | null>(null);
  const [key, setKey] = useState(1);

  const transformOutput = (file: DisplayFile | null, format: string): string => {
    if (!file) {
      return 'Your encoded string will appear here.';
    }

    if (format === 'raw') {
      return file.displayImage.split(',')[1];
    } else if (format === 'data_uri') {
      return file.displayImage;
    } else if (format === 'css_background') {
      return `background-image: url("${file.displayImage}");`;
    } else if (format === 'html_image') {
      return `<img alt="" src="${file.displayImage}" />`;
    } else if (format === 'js_image') {
      return `const img = new Image();img.src = ${file.displayImage};`;
    } else {
      return file.displayImage;
    }
  };

  const handleFiles = (files: DisplayFile[]) => {
    if (files.length > 0) {
      setCurrentFile(files[0]);
    } else {
      setCurrentFile(null);
    }
  };

  const handleFormatChange = (value: string) => {
    setFormat(value);
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard');
  };

  const output = transformOutput(currentFile, format);

  return (
    <>
      <SEO
        title="Image to Base64 Converter - Tools For Frontend"
        description="Convert images to Base64 strings in multiple formats (raw, data URI, CSS background, HTML image, JS image). Free online image to base64 converter."
        keywords="image to base64, base64 converter, image base64, data uri, css background image, html image base64"
        ogTitle="Image to Base64 Converter - Tools For Frontend"
        ogDescription="Convert images to Base64 strings in multiple formats."
        canonicalUrl="https://toolsforfrontend.com/image/base64"
      />
      <div className="flex flex-row gap-10 max-w-8xl">
        <div className="flex-1 flex flex-col gap-6 w-full">
          <div>
            <h1 className="text-2xl font-bold">Image to Base64</h1>
            <p className="text-muted-foreground">Convert an image to Base64 string.</p>
          </div>
          <div className="flex h-[600px]">
            <div className="basis-1/2 max-w-1/2">
              <DragAndDrop
                key={key}
                fileLimit={1}
                filesizeLimit={MAX_FILESIZE}
                handleFiles={handleFiles}
                text={"Drag and drop your images or click here"}
                helpText={"(1 image only)"}
                acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
              />
            </div>
            <div className="basis-1/2 max-w-1/2 flex flex-col gap-4 pl-4">
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={format} onValueChange={handleFormatChange}>
                  <SelectTrigger className="w-40 xl:w-60">
                    <SelectValue placeholder="Number of spaces" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="raw">Raw</SelectItem>
                    <SelectItem value="data_uri">Data URI</SelectItem>
                    <SelectItem value="css_background">CSS Background</SelectItem>
                    <SelectItem value="html_image">HTML Image</SelectItem>
                    <SelectItem value="js_image">JS Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              <Textarea className="flex-grow-1 h-full font-mono" value={output} readOnly />
              <div className="space-x-3">
                <Button onClick={handleCopy}>Copy</Button>
                <Button variant="destructive-min" onClick={() => {
                  setKey(prevKey => prevKey + 1);
                  setCurrentFile(null);
                }}>Clear</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}