import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from '@/components/ui/label.tsx';

export default function StringTransformPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleUppercase = () => {
    setOutput(input.toUpperCase());
  }

  const handleLowercase = () => {
    setOutput(input.toLowerCase());
  }

  const handleReverse = () => {
    setOutput(input.split("").reverse().join(""));
  }

  const handleCapitalize = () => {
    const words = input.split(/\s+/);
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    setOutput(capitalizedWords.join(" "));
  }

  const handleRemoveExtraSpaces = () => {
    setOutput(input.replaceAll(/\s+/g, " "));
  }

  const handleRemoveSpecialCharacters = () => {
    setOutput(input.replace(/[^a-zA-Z0-9\s]/g, ""));
  }

  const handleRemoveNumbers = () => {
    setOutput(input.replace(/[0-9]/g, ""));
  }

  const handleRemoveLetters = () => {
    setOutput(input.replace(/[a-zA-Z]/g, "").replace(/\s+/g, " ").trim());
  }

  const handleClearInput = () => {
    setInput("");
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  }

  const handleClearOutput = () => {
    setOutput("");
  }

  return (
    <div className="flex flex-row gap-10">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">String Transform</h1>
          <p className="text-gray-500">This page transforms a string into a different format.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="string-input">Input</Label>
          <textarea value={input} id="string-input" className="block w-full h-40 border border-gray-300 rounded-md p-2" onChange={handleInputChange} />
          <div className="flex flex-wrap gap-3" >
            <Button variant="secondary" onClick={handleUppercase}>Uppercase</Button>
            <Button variant="secondary" onClick={handleLowercase}>Lowercase</Button>
            <Button variant="secondary" onClick={handleCapitalize}>Capitalize</Button>
            <Button variant="secondary" onClick={handleReverse}>Reverse</Button>
            <Button variant="secondary" onClick={handleRemoveExtraSpaces}>Remove Extra Spaces</Button>
            <Button variant="secondary" onClick={handleRemoveSpecialCharacters}>Remove Special Characters</Button>
            <Button variant="secondary" onClick={handleRemoveNumbers}>Remove Numbers</Button>
            <Button variant="secondary" onClick={handleRemoveLetters}>Remove Letters</Button>
            <Button variant="destructive-min" onClick={handleClearInput}>Clear</Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="string-output">Output <span className="text-xs">(Read Only)</span></Label>
          <textarea readOnly value={output} id="string-output" className="block w-full h-40 border border-gray-300 rounded-md p-2" />
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleCopy}>Copy</Button>
            <Button variant="destructive-min" onClick={handleClearOutput}>Clear</Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col max-w-[320px] gap-3 bg-zinc-100 p-4 rounded-md">
        <p className="text-gray-500 text-sm">
          <span className="font-bold">Uppercase: </span>
          <span>Converts the string to uppercase</span>
        </p>
        <p className="text-gray-500 text-sm">
          <span className="font-bold">Lowercase: </span>
          <span>Converts the string to lowercase</span>
        </p>
        <p className="text-gray-500 text-sm">
          <span className="font-bold">Capitalize: </span>
          <span>Converts the first letter of each word to uppercase</span>
        </p>
        <p className="text-gray-500 text-sm">
          <span className="font-bold">Reverse: </span>
          <span>Converts the string to its reverse</span>
        </p>
        <p className="text-gray-500 text-sm">
          <span className="font-bold">Remove Extra Spaces: </span>
          <span>Removes extra spaces from the string</span>
        </p>
        <p className="text-gray-500 text-sm">
          <span className="font-bold">Remove Special Characters: </span>
          <span>Removes special characters from the string</span>
        </p>
        <p className="text-gray-500 text-sm">
          <span className="font-bold">Remove Numbers: </span>
          <span>Removes numbers from the string</span>
        </p>
        <p className="text-gray-500 text-sm">
          <span className="font-bold">Remove Letters: </span>
          <span>Removes letters from the string</span>
        </p>
      </div>
    </div>
  );
}