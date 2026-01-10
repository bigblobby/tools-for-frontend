import { Button } from '@/components/ui/button.tsx';
import { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-error_marker";

export default function JSONFormatterPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [spaces, setSpaces] = useState(2);
  const inputEditorRef = useRef<any>(null);

  const handleFormatJson = (spaces?: number) => {
    if (!jsonInput.trim().length) {
      toast.error('No JSON added.');
      return;
    }

    const formattedJSON = JSON.stringify(JSON.parse(jsonInput), null, spaces);

    setJsonOutput(formattedJSON);
  };

  const handleBeautifyJson = () => {
    try {
      handleFormatJson(spaces);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message, { position: 'top-center' });
      } else {
        toast.error('Invalid JSON format', { position: 'top-center' });
      }
    }
  };

  const handleMinifyJson = () => {
    try {
      handleFormatJson();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message, { position: 'top-center' });
      } else {
        toast.error('Invalid JSON format', { position: 'top-center' });
      }
    }
  };

  const handleCopyJsonOutput = () => {
    void navigator.clipboard.writeText(jsonOutput);
    toast.success('Copied to clipboard', { position: 'top-center' });
  };

  const handleClearAll = () => {
    setJsonInput('');
    setJsonOutput('');
  };

  const validateJSON = (text: string, editor: any) => {
    if (!editor) return;

    if (!text.trim()) {
      editor.getSession().setAnnotations([]);
      return;
    }

    try {
      JSON.parse(text);
      editor.getSession().setAnnotations([]);
    } catch (error: any) {
      // Try to extract position from error message
      let row = 0;
      let column = 0;
      let message = error.message;

      // Check if error message contains position information
      const positionMatch = error.message.match(/position (\d+)/);
      if (positionMatch) {
        const position = parseInt(positionMatch[1], 10);
        const lines = text.substring(0, position).split('\n');
        row = lines.length - 1;
        column = lines[lines.length - 1].length;
      } else {
        // If no position, try to find the error by parsing line by line
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
          try {
            JSON.parse(lines.slice(0, i + 1).join('\n'));
          } catch (e) {
            row = i;
            column = 0;
            break;
          }
        }
      }

      editor.getSession().setAnnotations([{
        row,
        column,
        text: message,
        type: 'error'
      }]);
    }
  };

  useEffect(() => {
    if (inputEditorRef.current?.editor) {
      validateJSON(jsonInput, inputEditorRef.current.editor);
    }
  }, [jsonInput]);

  return (
    <>
      <SEO
        title="JSON Formatter/Validator - Beautify & Minify JSON - Tools For Frontend"
        description="Beautify and minify JSON with customizable indentation. Free online JSON formatter and validator tool for developers. Validate your JSON data and beautify it with customizable indentation."
        keywords="json formatter, json beautify, json minify, json validator, json prettifier, format json, validate json"
        ogTitle="JSON Formatter/Validator - Tools For Frontend"
        ogDescription="Beautify and minify JSON with customizable indentation. Validate your JSON data and beautify it with customizable indentation."
        canonicalUrl="https://toolsforfrontend.com/string/json-formatter"
      />
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-bold">JSON formatter/validator</h1>
          <p className="text-gray-500">Beautify/minify and validate your JSON data.</p>
        </div>

        <div className="flex row gap-10">
          <div className="flex-1 flex flex-col gap-3">
            <Label htmlFor="input">Input</Label>
            <AceEditor
              ref={inputEditorRef}
              value={jsonInput}
              mode="json"
              theme="github"
              onChange={(e) => setJsonInput(e)}
              name="input"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                useWorker: false,
                showLineNumbers: true,
                showGutter: true
              }}
              onLoad={(editor) => {
                validateJSON(jsonInput, editor);
              }}
              style={{ width: '100%', height: '600px', border: '1px solid oklch(87.2% 0.01 258.338)', borderRadius: '4px' }}
            />
          </div>
          <div className="flex flex-col gap-3 mt-10">
            <Label>Number of spaces</Label>
            <Select value={String(spaces)} onValueChange={(value) => setSpaces(Number(value))}>
              <SelectTrigger className="w-40 xl:w-60">
                <SelectValue placeholder="Number of spaces" />
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
            <AceEditor
              value={jsonOutput}
              mode="json"
              theme="github"
              name="output"
              readOnly
              tabSize={spaces}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                useWorker: false
              }}
              style={{ width: '100%', height: '600px', border: '1px solid oklch(87.2% 0.01 258.338)', borderRadius: '4px' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}