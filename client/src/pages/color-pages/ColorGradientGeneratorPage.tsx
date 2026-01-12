import ColorPicker from 'react-best-gradient-color-picker';
import { useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { useTheme } from '@/providers/theme-provider';

export default function ColorGradientGeneratorPage() {
  const [color, setColor] = useState('linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)');
  const theme = useTheme();

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <>
      <SEO
        title="Gradient Generator - Tools For Frontend"
        description="Create beautiful linear or radial CSS gradients with multiple colors. Free online gradient generator tool for developers and designers."
        keywords="gradient generator, css gradient, linear gradient, radial gradient, gradient maker, css gradient tool"
        ogTitle="Gradient Generator - Tools For Frontend"
        ogDescription="Create beautiful linear or radial CSS gradients with multiple colors."
        canonicalUrl="https://toolsforfrontend.com/color/gradient-generator"
      />
      <div className="max-w-8xl">
        <div>
          <h1 className="text-2xl font-bold">Gradient Generator</h1>
          <p className="text-muted-foreground">Create linear or radial gradients using as many colors as you'd like.</p>
        </div>
        <div className="flex flex-col gap-10 mt-10">
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-3">
            <div className="inline-block p-3 border rounded-md">
              <ColorPicker value={color} onChange={setColor} disableDarkMode={theme.theme !== 'dark'} />
            </div>
            <div className="w-full h-40 md:h-auto rounded-md" style={{ background: color }}></div>
          </div>
          <div className="flex flex-col gap-3 border rounded-md p-4">
            <div>
              <h2 className="text-xl font-bold">How to use?</h2>
              <p className="text-muted-foreground">Paste the following into your css.</p>
              <pre className="whitespace-pre-wrap mt-3">
                {`background: ${color};\ncolor: ${color};`}
              </pre>
            </div>
            <div>
              <Input className="font-mono" value={color} />
            </div>
            <div>
              <Button onClick={() => handleCopy(color)}>Copy</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}