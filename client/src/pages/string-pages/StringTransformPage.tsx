import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Card } from '@/components/ui/card.tsx';

export default function StringTransformPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleUppercase = () => {
    setOutput(input.toUpperCase());
  };

  const handleLowercase = () => {
    setOutput(input.toLowerCase());
  };

  const handleReverse = () => {
    setOutput(input.split('').reverse().join(''));
  };

  const handleCapitalize = () => {
    const words = input.split(/\s+/);
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    setOutput(capitalizedWords.join(' '));
  };

  const handleRemoveExtraSpaces = () => {
    setOutput(input.replaceAll(/\s+/g, ' '));
  };

  const handleRemoveSpecialCharacters = () => {
    setOutput(input.replace(/[^a-zA-Z0-9\s]/g, ''));
  };

  const handleRemoveNumbers = () => {
    setOutput(input.replace(/[0-9]/g, ''));
  };

  const handleRemoveLetters = () => {
    setOutput(input.replace(/[a-zA-Z]/g, '').replace(/\s+/g, ' ').trim());
  };

  const handleClearInput = () => {
    setInput('');
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard');
  };

  const handleClearOutput = () => {
    setOutput('');
  };

  return (
    <>
      <SEO
        title="String Transform Tool - Uppercase, Lowercase, Reverse - Tools For Frontend"
        description="Transform strings with uppercase, lowercase, capitalize, reverse, and remove special characters. Free online string transformation tool for developers."
        keywords="string transform, uppercase, lowercase, capitalize, reverse string, remove special characters, text transform"
        ogTitle="String Transform Tool - Tools For Frontend"
        ogDescription="Transform strings with uppercase, lowercase, capitalize, reverse, and more."
        canonicalUrl="https://toolsforfrontend.com/string/transform"
      />
      <div className="flex flex-row gap-10 max-w-8xl">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Transform</h1>
            <p className="text-muted-foreground">Transform a string into a different format.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="string-input">Input</Label>
            <Textarea value={input} id="string-input" className="h-40" onChange={handleInputChange} />
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleUppercase}>Uppercase</Button>
              <Button onClick={handleLowercase}>Lowercase</Button>
              <Button onClick={handleCapitalize}>Capitalize</Button>
              <Button onClick={handleReverse}>Reverse</Button>
              <Button onClick={handleRemoveExtraSpaces}>Remove Extra Spaces</Button>
              <Button onClick={handleRemoveSpecialCharacters}>Remove Special Characters</Button>
              <Button onClick={handleRemoveNumbers}>Remove Numbers</Button>
              <Button onClick={handleRemoveLetters}>Remove Letters</Button>
              <Button variant="destructive-min" onClick={handleClearInput}>Clear</Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="string-output">Output <span className="text-xs">(Read Only)</span></Label>
            <Textarea readOnly value={output} id="string-output" className="h-40" />
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCopy}>Copy</Button>
              <Button variant="destructive-min" onClick={handleClearOutput}>Clear</Button>
            </div>
          </div>
        </div>

        <Card className="max-w-[320px] gap-3 p-4">
          <p className="text-sm">
            <span className="font-bold">Uppercase: </span>
            <span>Converts the string to uppercase</span>
          </p>
          <p className="text-sm">
            <span className="font-bold">Lowercase: </span>
            <span>Converts the string to lowercase</span>
          </p>
          <p className="text-sm">
            <span className="font-bold">Capitalize: </span>
            <span>Converts the first letter of each word to uppercase</span>
          </p>
          <p className="text-sm">
            <span className="font-bold">Reverse: </span>
            <span>Converts the string to its reverse</span>
          </p>
          <p className="text-sm">
            <span className="font-bold">Remove Extra Spaces: </span>
            <span>Removes extra spaces from the string</span>
          </p>
          <p className="text-sm">
            <span className="font-bold">Remove Special Characters: </span>
            <span>Removes special characters from the string</span>
          </p>
          <p className="text-sm">
            <span className="font-bold">Remove Numbers: </span>
            <span>Removes numbers from the string</span>
          </p>
          <p className="text-sm">
            <span className="font-bold">Remove Letters: </span>
            <span>Removes letters from the string</span>
          </p>
        </Card>
      </div>
    </>
  );
}