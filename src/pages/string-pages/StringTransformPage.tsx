import { useState } from "react";

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

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  }

  const handleClearOutput = () => {
    setOutput("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">String Transform</h1>
        <p className="text-gray-500">This page transforms a string into a different format.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="string-input" className="block text-gray-500">Input</label>
        <textarea id="string-input" className="block w-full h-40 border border-gray-300 rounded-md p-2" onChange={handleInputChange} />
        <div className="flex flex-wrap gap-2" >
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleUppercase}>Uppercase</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleLowercase}>Lowercase</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleCapitalize}>Capitalize</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleReverse}>Reverse</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleRemoveExtraSpaces}>Remove Extra Spaces</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleRemoveSpecialCharacters}>Remove Special Characters</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleRemoveNumbers}>Remove Numbers</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleRemoveLetters}>Remove Letters</button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="string-output" className="block text-gray-500">Output</label>
        <textarea value={output} id="string-output" className="block w-full h-40 border border-gray-300 rounded-md p-2" />
        <div className="flex flex-wrap gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleCopy}>Copy</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleClearOutput}>Clear</button>
        </div>
      </div>


    </div>
  );
}