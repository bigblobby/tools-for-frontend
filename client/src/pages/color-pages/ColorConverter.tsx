import React, { useState, useMemo } from "react";
import Color from "colorjs.io";
import { toast } from "sonner";
import { Label } from '@/components/ui/label.tsx';

export default function ColorConverter() {
  const [inputColor, setInputColor] = useState("oklch(42.4% 0.199 265.638)");

  const colorValues = useMemo(() => {
    try {
      const colorObj = new Color(inputColor);
      const hslColor = new Color('hsl', [colorObj.hsl.h, colorObj.hsl.s, colorObj.hsl.l]);
      const rgbColor = new Color('srgb', [colorObj.srgb.r, colorObj.srgb.g, colorObj.srgb.b]);
      const oklchColor = new Color('oklch', [colorObj.oklch.l, colorObj.oklch.c, colorObj.oklch.h]);
      const oklabColor = new Color('oklab', [colorObj.oklab.l, colorObj.oklab.a, colorObj.oklab.b]);
      const lchColor = new Color('lch', [colorObj.lch.l, colorObj.lch.c, colorObj.lch.h]);
      const hexColor = new Color(colorObj).toGamut({ space: 'srgb' }).to('srgb').toString({ format: 'hex' });
      const longhex = hexColor.length < 6 ? hexColor.split('').map(v => v + v).join('').slice(1) : hexColor;
      const hwbColor = new Color('hwb', [colorObj.hwb.h, colorObj.hwb.w, colorObj.hwb.b]);
      const labColor = new Color('lab', [colorObj.lab.l, colorObj.lab.a, colorObj.lab.b]);

      return {
        hexColor: longhex,
        hslColor,
        rgbColor,
        oklchColor,
        oklabColor,
        lchColor,
        hwbColor,
        labColor,
      };
    } catch (error) {
      console.error(error);
      return {
        hexColor: null,
        hslColor: null,
        rgbColor: null,
        oklchColor: null,
        oklabColor: null,
        lchColor: null,
        hwbColor: null,
        labColor: null,
      };
    }
  }, [inputColor]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
  }

  const handleCopyColor = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    void navigator.clipboard.writeText(event.currentTarget.textContent?.split(":")[1].trim() || "");
    toast.success("Copied to clipboard", { position: "top-center" });
  }

  const handleFocusColorInput = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget.select();
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Color Converter</h1>
        <p className="text-gray-500">Convert a color to different formats.</p>
      </div>
      <div className="flex flex-row gap-10 mt-10">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="color-input">Input color <span className="text-xs">(Orange, #FFA500, hsl(36, 100%, 50%), etc.)</span></Label>
            <input value={inputColor} onFocus={handleFocusColorInput} onChange={handleColorChange} type="text" placeholder="Enter a color" className="block w-full h-10 border border-gray-300 rounded-md p-2" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Output colors</Label>
            <div className="grid grid-cols-2 gap-2 auto-rows-[1fr]">
              <div className="flex flex-col border rounded-md py-2 px-4 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">Hex:</span>
                <span>{colorValues.hexColor?.toUpperCase()}</span>
              </div>
              <div className="flex flex-col border rounded-md py-2 px-4 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">HSL:</span>
                <span>{colorValues.hslColor?.toString()}</span>
              </div>
              <div className="flex flex-col border rounded-md py-2 px-4 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">RGB:</span>
                <span>{colorValues.rgbColor?.toString()}</span>
              </div>
              <div className="flex flex-col border rounded-md py-2 px-4 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">OKLCH:</span>
                <span>{colorValues.oklchColor?.toString()}</span>
              </div>
              <div className="flex flex-col border rounded-md py-2 px-4 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">OKLAB:</span>
                <span>{colorValues.oklabColor?.toString()}</span>
              </div>
              <div className="flex flex-col border rounded-md py-2 px-4 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">LCH:</span>
                <span>{colorValues.lchColor?.toString()}</span>
              </div>
              <div className="flex flex-col border rounded-md py-2 px-4 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">HWB:</span>
                <span>{colorValues.hwbColor?.toString()}</span>
              </div>
              <div className="flex flex-col border rounded-md py-2 px-4 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">LAB:</span>
                <span>{colorValues.labColor?.toString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-stretch">
          <div className="h-full w-full rounded-md border" style={{ backgroundColor: inputColor }}></div>
        </div>
      </div>
    </div>
  );
}