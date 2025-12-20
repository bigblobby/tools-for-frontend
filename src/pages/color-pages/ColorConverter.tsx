import React, { useState, useEffect } from "react";
import Color from "colorjs.io";
import { toast } from "sonner";

export default function ColorConverter() {
  const [inputColor, setInputColor] = useState("oklch(42.4% 0.199 265.638)");
  const [hexColor, setHexColor] = useState<string | null>(null);
  const [hslColor, setHslColor] = useState<Color | null>(null);
  const [rgbColor, setRgbColor] = useState<Color | null>(null);
  const [oklchColor, setOklchColor] = useState<Color | null>(null);
  const [oklabColor, setOklabColor] = useState<Color | null>(null);
  const [lchColor, setLchColor] = useState<Color | null>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
  }

  const handleSetColor = (color: string) => {
    try {
      const colorObj = new Color(color);
      const hslColor = new Color('hsl', [colorObj.hsl.h, colorObj.hsl.s, colorObj.hsl.l]);
      const rgbColor = new Color('srgb', [colorObj.srgb.r, colorObj.srgb.g, colorObj.srgb.b]);
      const oklchColor = new Color('oklch', [colorObj.oklch.l, colorObj.oklch.c, colorObj.oklch.h]);
      const oklabColor = new Color('oklab', [colorObj.oklab.l, colorObj.oklab.a, colorObj.oklab.b]);
      const lchColor = new Color('lch', [colorObj.lch.l, colorObj.lch.c, colorObj.lch.h]);
      const hexColor = new Color(colorObj).toGamut({ space: 'srgb' }).to('srgb').toString({ format: 'hex' });
      const longhex = hexColor.length < 6 ? hexColor.split('').map(v => v + v).join('').slice(1) : hexColor;

      setHslColor(hslColor);
      setRgbColor(rgbColor);
      setOklchColor(oklchColor);
      setOklabColor(oklabColor);
      setLchColor(lchColor);
      setHexColor(longhex);
    } catch (error) {
      console.error(error);
      // Silently fail.
    }
  }

  const handleCopyColor = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    navigator.clipboard.writeText(event.currentTarget.textContent?.split(":")[1].trim() || "");
    toast.success("Copied to clipboard", { position: "top-center" });
  }

  const handleFocusColorInput = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget.select();
  }

  useEffect(() => {
    handleSetColor(inputColor);
  }, [inputColor]);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Color Converter</h1>
        <p className="text-gray-500">This page converts a color to a different format.</p>
      </div>
      <div className="flex flex-row gap-10 mt-10">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="color-input" className="block text-gray-500">Input color <span className="text-xs">(Orange, #FFA500, hsl(36, 100%, 50%), etc.)</span></label>
            <input value={inputColor} onFocus={handleFocusColorInput} onChange={handleColorChange} type="text" placeholder="Enter a color" className="block w-full h-10 border border-gray-300 rounded-md p-2" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="block text-gray-500">Output colors</span>
            <div className="grid grid-cols-2 gap-2 auto-rows-[1fr]">
              <div className="flex flex-col border rounded-md p-2 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">Hex:</span>
                <span>{hexColor?.toUpperCase()}</span>
              </div>
              <div className="flex flex-col border rounded-md p-2 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">HSL:</span>
                <span>{hslColor?.toString()}</span>
              </div>
              <div className="flex flex-col border rounded-md p-2 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">RGB:</span>
                <span>{rgbColor?.toString()}</span>
              </div>
              <div className="flex flex-col border rounded-md p-2 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">OKLCH:</span>
                <span>{oklchColor?.toString()}</span>
              </div>
              <div className="flex flex-col border rounded-md p-2 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">OKLAB:</span>
                <span>{oklabColor?.toString()}</span>
              </div>
              <div className="flex flex-col border rounded-md p-2 cursor-pointer" onClick={handleCopyColor}>
                <span className="font-bold">LCH:</span>
                <span>{lchColor?.toString()}</span>
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