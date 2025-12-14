import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { useState } from "react";

export default function StringEncodeDecodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleURLEncode = () => {
    setOutput(encodeURIComponent(input));
  }

  const handleURLDecode = () => {
    setOutput(decodeURIComponent(input));
  }

  const handleBase64Encode = () => {
    setOutput(btoa(input));
  }

  const handleBase64Decode = () => {
    setOutput(atob(input));
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
          <h1 className="text-2xl font-bold">String Encode Decode</h1>
          <p className="text-gray-500">This page encodes and decodes a string.</p>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="string-input" className="block text-gray-500">Input</label>
          <textarea value={input} id="string-input" className="block w-full h-40 border border-gray-300 rounded-md p-2" onChange={handleInputChange} />
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-3">
              <label htmlFor="base64-encode" className="block text-gray-500">Base64</label>
              <ButtonGroup>
                <Button variant="secondary" onClick={handleBase64Encode}>Base64 Encode</Button>
                <Button variant="secondary" onClick={handleBase64Decode}>Base64 Decode</Button>
              </ButtonGroup>
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="url-encode" className="block text-gray-500">URL</label>
              <ButtonGroup>
                <Button variant="secondary" onClick={handleURLEncode}>URL Encode</Button>
                <Button variant="secondary" onClick={handleURLDecode}>URL Decode</Button>
              </ButtonGroup>
            </div>
            <div className="flex flex-col gap-3 self-end">
              <ButtonGroup>
                <Button variant="destructive" onClick={handleClearInput}>Clear</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="string-output" className="block text-gray-500">Output</label>
          <textarea readOnly value={output} id="string-output" className="block w-full h-40 border border-gray-300 rounded-md p-2" />
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleCopy}>Copy</Button>
            <Button variant="destructive" onClick={handleClearOutput}>Clear</Button>
          </div>
        </div>
      </div>
    </div>
  );
}