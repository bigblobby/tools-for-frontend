import { Button } from '@/components/ui/button.tsx';
import { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import 'ace-builds/src-noconflict/theme-github_dark';
import "ace-builds/src-noconflict/ext-error_marker";
import "ace-builds/src-noconflict/ext-language_tools";
import type { Editor } from 'ace-builds';
import { useTheme } from '@/providers/theme-provider';

export default function JSONFormatterPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [spaces, setSpaces] = useState(2);
  const inputEditorRef = useRef<AceEditor>(null);
  const theme = useTheme();

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
        toast.error(error.message);
      } else {
        toast.error('Invalid JSON format');
      }
    }
  };

  const handleMinifyJson = () => {
    try {
      handleFormatJson();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Invalid JSON format');
      }
    }
  };

  const handleCopyJsonOutput = () => {
    void navigator.clipboard.writeText(jsonOutput);
    toast.success('Copied to clipboard');
  };

  const handleClearAll = () => {
    setJsonInput('');
    setJsonOutput('');
  };

  const validateJSON = (text: string, editor: Editor) => {
    if (!editor) return;

    if (!text.trim()) {
      editor.getSession().setAnnotations([]);
      return;
    }

    try {
      JSON.parse(text);
      editor.getSession().setAnnotations([]);
    } catch (error: unknown) {
      // Try to extract position from error message
      let row = 0;
      let column = 0;
      const message = error instanceof Error ? error.message : 'Unknown error';

      // Check if error message contains position information
      const positionMatch = message.match(/position (\d+)/);
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
          } catch (_e) {
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
      <div className="flex flex-col gap-10 max-w-8xl">
        <div>
          <h1 className="text-2xl font-bold">JSON formatter/validator</h1>
          <p className="text-muted-foreground">Beautify/minify and validate your JSON data.</p>
        </div>

        <div className="flex row gap-6">
          <div className="flex-1 flex flex-col gap-3">
            <Label htmlFor="input">Input</Label>
            <AceEditor
              ref={inputEditorRef}
              value={jsonInput}
              mode="json"
              theme={theme.theme === 'dark' ? 'github_dark' : 'github'}
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
              className="border"
              style={{ width: '100%', height: '600px', borderRadius: '4px' }}
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
              theme={theme.theme === 'dark' ? 'github_dark' : 'github'}
              name="output"
              readOnly
              tabSize={spaces}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                useWorker: false
              }}
              className="border"
              style={{ width: '100%', height: '600px', borderRadius: '4px' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}