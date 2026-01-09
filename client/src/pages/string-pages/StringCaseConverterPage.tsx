import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

export default function StringCaseConverterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };


  const handleClearAll = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard', { position: 'top-center' });
  };

  const handleClearOutput = () => {
    setOutput('');
  };

  const splitInputIntoWords = (input: string) => {
    let words: string[] = [];

    if (input.includes('_')) {
      words = input.split('_');
    } else if (input.includes('-')) {
      words = input.split('-');
    } else if (input.match(/^[A-Z][a-z]*(?:[A-Z][a-z]*)*$/)) {
      words = input.split(/(?=[A-Z])/);
    } else if (input.match(/^[a-z]+(?:[A-Z][a-z]*)*$/)) {
      words = input.split(/(?=[A-Z])/);
    } else {
      words = input.split(/\s+/);
    }

    return words;
  };

  const handleConvertToCamelCase = () => {
    const words: string[] = splitInputIntoWords(input);
    const camelCaseWords = words.map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    setOutput(camelCaseWords.join(''));
  };

  const handleConvertToSnakeCase = () => {
    const words: string[] = splitInputIntoWords(input);

    const snakeCaseWords = words.map(word => word.toLowerCase());
    setOutput(snakeCaseWords.join('_'));
  };

  const handleConvertToKebabCase = () => {
    const words: string[] = splitInputIntoWords(input);
    const kebabCaseWords = words.map(word => word.toLowerCase());
    setOutput(kebabCaseWords.join('-'));
  };

  const handleConvertToPascalCase = () => {
    const words: string[] = splitInputIntoWords(input);

    const pascalCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    setOutput(pascalCaseWords.join(''));
  };

  return (
    <>
      <SEO
        title="Case Converter - camelCase, snake_case, kebab-case, PascalCase - Tools For Frontend"
        description="Convert strings between different case formats: camelCase, snake_case, kebab-case, and PascalCase. Free online case converter tool for developers."
        keywords="case converter, camelcase, snake case, kebab case, pascal case, string case converter, text case converter"
        ogTitle="Case Converter - Tools For Frontend"
        ogDescription="Convert strings between camelCase, snake_case, kebab-case, and PascalCase formats."
        canonicalUrl="https://toolsforfrontend.com/string/case-converter"
      />
      <div className="flex flex-row gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Case Converter</h1>
            <p className="text-gray-500">Converts a string to a different case.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="string-input">Input</Label>
            <textarea value={input} id="string-input" className="block w-full h-40 border border-gray-300 rounded-md p-2" onChange={handleInputChange}/>

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handleConvertToCamelCase}>camelCase</Button>
              <Button variant="secondary" onClick={handleConvertToSnakeCase}>snake_case</Button>
              <Button variant="secondary" onClick={handleConvertToKebabCase}>kebab-case</Button>
              <Button variant="secondary" onClick={handleConvertToPascalCase}>PascalCase</Button>
            </div>
            <div className="flex flex-col gap-3">
              <ButtonGroup>
                <Button variant="destructive-min" onClick={handleClearAll}>Clear All</Button>
              </ButtonGroup>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="string-output">Output <span className="text-xs">(Read Only)</span></Label>
            <textarea readOnly value={output} id="string-output" className="block w-full h-40 border border-gray-300 rounded-md p-2"/>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handleCopy}>Copy</Button>
              <Button variant="destructive-min" onClick={handleClearOutput}>Clear</Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col max-w-[320px] gap-3 bg-zinc-100 p-4 rounded-md">
          <p className="text-gray-500 text-sm">
            <span className="font-bold">camelCase: </span>
            <span>Converts the string to camelCase</span>
          </p>
          <p className="text-gray-500 text-sm">
            <span className="font-bold">snake_case: </span>
            <span>Converts the string to snake_case</span>
          </p>
          <p className="text-gray-500 text-sm">
            <span className="font-bold">kebab-case: </span>
            <span>Converts the string to kebab-case</span>
          </p>
          <p className="text-gray-500 text-sm">
            <span className="font-bold">PascalCase: </span>
            <span>Converts the string to PascalCase</span>
          </p>
        </div>
      </div>
    </>
  );
}