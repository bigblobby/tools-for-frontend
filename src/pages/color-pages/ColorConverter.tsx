import React, { useState, useEffect } from "react";
import Color from "colorjs.io";

export default function ColorConverter() {
  const [inputColor, setInputColor] = useState("oklch(42.4% 0.199 265.638)");
  const [color, setColor] = useState<Color | null>(null);
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

      setColor(colorObj);
      setHslColor(hslColor);
      setRgbColor(rgbColor);
      setOklchColor(oklchColor);
      setOklabColor(oklabColor);
      setLchColor(lchColor);
    } catch (error) {
      // Silently fail.
    }
  }

  const handleCopyColor = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    navigator.clipboard.writeText(event.currentTarget.textContent?.split(":")[1].trim() || "");
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
                <span>{color?.toString({ format: "hex" }).toUpperCase()}</span>
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
  )

  // const [hexColor, setHexColor] = useState("#000000");
  // const [rgbColor, setRgbColor] = useState({r: 0, g: 0, b: 0 });
  // const [hslColor, setHslColor] = useState({h: 0, s: 0, l: 0 });
  // const [cmykColor, setCmykColor] = useState({c: 0, m: 0, y: 0, k: 0 });
  // const [labColor, setLabColor] = useState({l: 0, a: 0, b: 0 });
  // const [xyzColor, setXyzColor] = useState({x: 0, y: 0, z: 0 });
  // const [hsvColor, setHsvColor] = useState({h: 0, s: 0, v: 0 });
  // const [hsbColor, setHsbColor] = useState({h: 0, s: 0, b: 0 });


  // const rgb = (color: string) => {
  //   return {
  //     r: parseInt(color.slice(1, 3), 16),
  //     g: parseInt(color.slice(3, 5), 16),
  //     b: parseInt(color.slice(5, 7), 16),
  //   }
  // }

  // const hsl = (color: string) => {
  //   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

  //   if (!result) {
  //     throw new Error("Could not parse Hex Color");
  //   }

  //   const rHex = parseInt(result[1], 16);
  //   const gHex = parseInt(result[2], 16);
  //   const bHex = parseInt(result[3], 16);

  //   const r = rHex / 255;
  //   const g = gHex / 255;
  //   const b = bHex / 255;

  //   const max = Math.max(r, g, b);
  //   const min = Math.min(r, g, b);

  //   let h = (max + min) / 2;
  //   let s = h;
  //   let l = h;

  //   if (max === min) {
  //     // Achromatic
  //     return { h: 0, s: 0, l };
  //   }

  //   const d = max - min;
  //   s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  //   switch (max) {
  //     case r:
  //       h = (g - b) / d + (g < b ? 6 : 0);
  //       break;
  //     case g:
  //       h = (b - r) / d + 2;
  //       break;
  //     case b:
  //       h = (r - g) / d + 4;
  //       break;
  //   }
  //   h /= 6;

  //   s = s * 100;
  //   s = Math.round(s);
  //   l = l * 100;
  //   l = Math.round(l);
  //   h = Math.round(360 * h);

  //   return { h, s, l };
  // }

  // const setColor = (color: string) => {
  //   console.log(color);
  //   setHexColor(color);
  //   setRgbColor(rgb(color));
  //   setHslColor(hsl(color));
  // }

  // return (
  //   <div>
  //     <input type="color" value={hexColor} onChange={(e) => setColor(e.target.value)} />
  //     <div>
  //       <p>Hex: {hexColor}</p>
  //       <p>RGB: {rgbColor.r}, {rgbColor.g}, {rgbColor.b}</p>
  //       <p>HSL: {hslColor.h}%, {hslColor.s}%, {hslColor.l}%</p>
  //     </div>
  //   </div>
  // )
}