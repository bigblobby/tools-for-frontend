import React, { useState, useMemo } from "react";
import Color from "colorjs.io";
import { toast } from "sonner";
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Pipette, Copy } from "lucide-react";

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

  const handleCopyColor = (event: React.MouseEvent<HTMLButtonElement>, color: string) => {
    event.preventDefault();
    void navigator.clipboard.writeText(color);
    toast.success("Copied to clipboard", { position: "top-center" });
  }

  const handleFocusColorInput = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget.select();
  }

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
  }

  const handleColorPickerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById('color-picker')?.click();
  }

  const handleEyeDropper = async () => {
    try {
      if (!('EyeDropper' in window)) {
        toast.error("EyeDropper API is not supported in your browser", { position: "top-center" });
        return;
      }

      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();

      if (result.sRGBHex) {
        setInputColor(result.sRGBHex);
        toast.success("Color picked successfully", { position: "top-center" });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast.error("Failed to pick color", { position: "top-center" });
        console.error(error);
      }
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Color Converter</h1>
        <p className="text-gray-500">Convert a color to different formats. Use the color picker, or pick a color from anywhere on the screen using the eye dropper.</p>
      </div>
      <div className="flex flex-row gap-10 mt-10">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2 md:min-w-[380px]">
            <Label htmlFor="color-input">Input color <span className="text-xs">(Orange, #FFA500, hsl(36, 100%, 50%), etc.)</span></Label>
            <div className="flex gap-2">
              <div className="relative">
                <Button variant="outline" style={{ backgroundColor: inputColor }} onClick={handleColorPickerClick} className="h-10 w-20"><span className="sr-only">Color picker</span></Button>
                <input
                  id="color-picker"
                  type="color"
                  value={colorValues.hexColor ? (colorValues.hexColor.startsWith('#') ? colorValues.hexColor : `#${colorValues.hexColor}`) : "#000000"}
                  onChange={handleColorPickerChange}
                  className="absolute top-0 left-0 -z-10 h-10 w-20 rounded-md cursor-pointer"
                  title="Pick a color"
                />
              </div>
              <input
                id="color-input"
                value={inputColor}
                onFocus={handleFocusColorInput}
                onChange={handleColorChange}
                type="text"
                placeholder="Enter a color"
                className="flex-1 h-10 border rounded-md p-2"
              />
              <Button onClick={handleEyeDropper} variant="outline" className="h-10">
                <Pipette />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Output colors</Label>

            <div className="flex flex-col gap-2">
              <Button variant="outline" className="flex items-center justify-normal gap-0 w-full border rounded-md p-0 h-auto cursor-pointer" onClick={(e) => handleCopyColor(e, colorValues.hexColor || "")}>
                <div className="font-bold w-[120px] border-r px-4 py-2">Hex</div>
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <div>{colorValues.hexColor?.toUpperCase()}</div>
                  <div><Copy /></div>
                </div>
              </Button>

              <Button variant="outline" className="flex items-center justify-normal gap-0 w-full border rounded-md p-0 h-auto cursor-pointer" onClick={(e) => handleCopyColor(e, colorValues.hslColor?.toString() || "")}>
                <div className="font-bold w-[120px] border-r px-4 py-2">HSL</div>
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <div>{colorValues.hslColor?.toString()}</div>
                  <div><Copy /></div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-normal gap-0 w-full border rounded-md p-0 h-auto cursor-pointer" onClick={(e) => handleCopyColor(e, colorValues.rgbColor?.toString() || "")}>
                <div className="font-bold w-[120px] border-r px-4 py-2">RGB</div>
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <div>{colorValues.rgbColor?.toString()}</div>
                  <div><Copy /></div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-normal gap-0 w-full border rounded-md p-0 h-auto cursor-pointer" onClick={(e) => handleCopyColor(e, colorValues.oklchColor?.toString() || "")}>
                <div className="font-bold w-[120px] border-r px-4 py-2">OKLCH</div>
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <div>{colorValues.oklchColor?.toString()}</div>
                  <div><Copy /></div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-normal gap-0 w-full border rounded-md p-0 h-auto cursor-pointer" onClick={(e) => handleCopyColor(e, colorValues.oklabColor?.toString() || "")}>
                <div className="font-bold w-[120px] border-r px-4 py-2">OKLAB</div>
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <div>{colorValues.oklabColor?.toString()}</div>
                  <div><Copy /></div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-normal gap-0 w-full border rounded-md p-0 h-auto cursor-pointer" onClick={(e) => handleCopyColor(e, colorValues.lchColor?.toString() || "")}>
                <div className="font-bold w-[120px] border-r px-4 py-2">LCH</div>
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <div>{colorValues.lchColor?.toString()}</div>
                  <div><Copy /></div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-normal gap-0 w-full border rounded-md p-0 h-auto cursor-pointer" onClick={(e) => handleCopyColor(e, colorValues.hwbColor?.toString() || "")}>
                <div className="font-bold w-[120px] border-r px-4 py-2">HWB</div>
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <div>{colorValues.hwbColor?.toString()}</div>
                  <div><Copy /></div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-normal gap-0 w-full border rounded-md p-0 h-auto cursor-pointer" onClick={(e) => handleCopyColor(e, colorValues.labColor?.toString() || "")}>
                <div className="font-bold w-[120px] border-r px-4 py-2">LAB</div>
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <div>{colorValues.labColor?.toString()}</div>
                  <div><Copy /></div>
                </div>
              </Button>
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