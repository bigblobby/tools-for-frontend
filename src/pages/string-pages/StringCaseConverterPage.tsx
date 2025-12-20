import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";

export default function StringCaseConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  }


  const handleClearAll = () => {
    setInput("");
    setOutput("");
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  }

  const handleClearOutput = () => {
    setOutput("");
  }

  const splitInputIntoWords = (input: string) => {
    let words: string[] = [];

    if (input.includes("_")) {
      words = input.split("_");
    } else if (input.includes("-")) {
      words = input.split("-");
    } else if (input.match(/^[A-Z][a-z]*(?:[A-Z][a-z]*)*$/)) {
      words = input.split(/(?=[A-Z])/);
    } else if (input.match(/^[a-z]+(?:[A-Z][a-z]*)*$/)) {
      words = input.split(/(?=[A-Z])/);
    } else {
      words = input.split(/\s+/);
    }

    return words;
  }

  const handleConvertToCamelCase = () => {
    const words: string[] = splitInputIntoWords(input);
    const camelCaseWords = words.map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    setOutput(camelCaseWords.join(""));
  }

  const handleConvertToSnakeCase = () => {
    const words: string[] = splitInputIntoWords(input);

    const snakeCaseWords = words.map(word => word.toLowerCase());
    setOutput(snakeCaseWords.join("_"));
  }

  const handleConvertToKebabCase = () => {
    const words: string[] = splitInputIntoWords(input);
    const kebabCaseWords = words.map(word => word.toLowerCase());
    setOutput(kebabCaseWords.join("-"));
  }

  const handleConvertToPascalCase = () => {
    const words: string[] = splitInputIntoWords(input);

    const pascalCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    setOutput(pascalCaseWords.join(""));
  }

  return (
    <div className="flex flex-row gap-10">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">String Case Converter</h1>
          <p className="text-gray-500">This page converts a string to a different case.</p>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="string-input" className="block text-gray-500">Input</label>
          <textarea value={input} id="string-input" className="block w-full h-40 border border-gray-300 rounded-md p-2" onChange={handleInputChange} />

          <div className="flex flex-wrap gap-3">

            <Button variant="secondary" onClick={handleConvertToCamelCase}>camelCase</Button>
            <Button variant="secondary" onClick={handleConvertToSnakeCase}>snake_case</Button>
            <Button variant="secondary" onClick={handleConvertToKebabCase}>kebab-case</Button>
            <Button variant="secondary" onClick={handleConvertToPascalCase}>PascalCase</Button>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonGroup>
              <Button variant="destructive-outline" onClick={handleClearAll}>Clear All</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="string-output" className="block text-gray-500">Output <span className="text-xs">(Read Only)</span></label>
          <textarea readOnly value={output} id="string-output" className="block w-full h-40 border border-gray-300 rounded-md p-2" />
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleCopy}>Copy</Button>
            <Button variant="destructive-outline" onClick={handleClearOutput}>Clear</Button>
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
  );
}