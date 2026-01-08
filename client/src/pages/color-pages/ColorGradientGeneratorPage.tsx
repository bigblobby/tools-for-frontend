import ColorPicker from 'react-best-gradient-color-picker';
import { useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';

export default function ColorGradientGeneratorPage() {
  const [color, setColor] = useState('linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)');

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { position: "top-center" });
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Gradient Generator</h1>
        <p className="text-gray-500">Create linear or radial gradients using as many colors as you'd like.</p>
      </div>
      <div className="flex flex-col gap-10 mt-10">
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-3">
          <div className="inline-block p-3 border rounded-md">
            <ColorPicker value={color} onChange={setColor} disableDarkMode={true} />
          </div>
          <div className="w-full h-40 md:h-auto rounded-md" style={{ background: color }}></div>
        </div>
        <div className="flex flex-col gap-3 border rounded-md p-4">
          <div>
            <h2 className="text-xl font-bold">How to use?</h2>
            <p className="text-gray-500">Paste the following into your css.</p>
            <pre className="whitespace-pre-wrap mt-3">
              {`background: ${color};\ncolor: ${color};`}
            </pre>
          </div>
          <div>
            <Input value={'background: ' + color + ';'} />
          </div>
          <div>
            <Button variant="secondary" onClick={() => handleCopy(color)}>Copy</Button>
          </div>
        </div>
      </div>
    </div>
  );
}