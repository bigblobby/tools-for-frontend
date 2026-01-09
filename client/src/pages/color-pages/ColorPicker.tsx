import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip.tsx';
import { Pipette } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import Color from 'colorjs.io';
import type { WindowWithEyeDropper } from '@/interfaces/browser.types';
import SEO from '@/components/SEO';

export default function ColorPicker() {
  const [inputColor, setInputColor] = useState("oklch(42.4% 0.199 265.638)");

  const handleColorPickerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById('color-picker')?.click();
  }

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
  }

  const handleFocusColorInput = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget.select();
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
  }

  const handleEyeDropper = async () => {
    try {
      if (!('EyeDropper' in window)) {
        toast.error("EyeDropper API is not supported in your browser", { position: "top-center" });
        return;
      }

      const eyeDropper = new (window as WindowWithEyeDropper).EyeDropper();
      const result = await eyeDropper.open();

      if (result.sRGBHex) {
        setInputColor(result.sRGBHex);
        toast.success("Color picked successfully", { position: "top-center" });
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Failed to pick color", { position: "top-center" });
        console.error(error);
      }
    }
  }

  const getHex = (color: Color) => {
    try {
      const hex = color.toGamut({ space: 'srgb' }).to('srgb').toString({ format: 'hex' });
      const longhex = hex.length < 6 ? hex.split('').map(v => v + v).join('').slice(1) : hex;
      return longhex.toUpperCase();
    } catch {
      return '#000000';
    }
  };

  const colorHarmonies = useMemo(() => {
    try {
      const baseColor = new Color(inputColor || "#000000");
      const hsl = baseColor.hsl;
      const hue = hsl.h || 0;
      const saturation = hsl.s || 0;
      const lightness = hsl.l || 0;
      const oklch = baseColor.oklch;
      const luminance = oklch.l || 0;
      const chroma = oklch.c || 0;
      const oklchHue = oklch.h || 0;

      const normalizeHue = (h: number) => ((h % 360) + 360) % 360;

      // Complement: +180 degrees
      const complementHue = normalizeHue(hue + 180);
      const complement = new Color('hsl', [complementHue, saturation, lightness]);

      // Split-complementary: +150 and +210 degrees
      const splitComp1Hue = normalizeHue(hue + 150);
      const splitComp2Hue = normalizeHue(hue + 210);
      const splitComp1 = new Color('hsl', [splitComp1Hue, saturation, lightness]);
      const splitComp2 = new Color('hsl', [splitComp2Hue, saturation, lightness]);

      // Triadic: +120 and +240 degrees
      const triadic1Hue = normalizeHue(hue + 120);
      const triadic2Hue = normalizeHue(hue + 240);
      const triadic1 = new Color('hsl', [triadic1Hue, saturation, lightness]);
      const triadic2 = new Color('hsl', [triadic2Hue, saturation, lightness]);

      // Analogous: -30 and +30 degrees (same luminance and saturation)
      const analogous1Hue = normalizeHue(oklchHue - 30);
      const analogous2Hue = normalizeHue(oklchHue + 30);
      const analogous1 = new Color('oklch', [luminance, chroma, analogous1Hue]);
      const analogous2 = new Color('oklch', [luminance, chroma, analogous2Hue]);

      // Monochromatic: same hue, varying RGB values
      // Scale RGB values to create darker and medium shades
      // Example: #ff0000 → #550000 (33%) → #aa0000 (67%)
      // Note: colorjs.io uses RGB values in 0-1 range
      const rgb = baseColor.srgb;
      const r = rgb.r || 0;
      const g = rgb.g || 0;
      const b = rgb.b || 0;

      // Create darker shade (33% of RGB values)
      const darkerR = r * 0.33;
      const darkerG = g * 0.33;
      const darkerB = b * 0.33;
      const mono1 = new Color('srgb', [darkerR, darkerG, darkerB]);

      // Create medium shade (67% of RGB values)
      const mediumR = r * 0.67;
      const mediumG = g * 0.67;
      const mediumB = b * 0.67;
      const mono2 = new Color('srgb', [mediumR, mediumG, mediumB]);

      // Tetradic: complement +60 and -60 degrees
      const tetradic1Hue = normalizeHue(hue + 60);
      const tetradic2Hue = normalizeHue(hue + 180);
      const tetradic3Hue = normalizeHue(hue + 240);
      const tetradic1 = new Color('hsl', [tetradic1Hue, saturation, lightness]);
      const tetradic2 = new Color('hsl', [tetradic2Hue, saturation, lightness]);
      const tetradic3 = new Color('hsl', [tetradic3Hue, saturation, lightness]);

      const baseHex = getHex(baseColor);

      return {
        complement: {
          colors: [baseHex, getHex(complement)],
          description: "Two colors positioned directly opposite each other on the color wheel, creating maximum contrast.",
          bestFor: "Bold statements, call-to-action buttons, brand identities"
        },
        splitComplementary: {
          colors: [baseHex, getHex(splitComp1), getHex(splitComp2)],
          description: "Your base color paired with two colors near its complement. Offers strong contrast while providing more flexibility than a direct complement.",
          bestFor: "Dynamic compositions that need energy without being overwhelming"
        },
        triadic: {
          colors: [baseHex, getHex(triadic1), getHex(triadic2)],
          description: "Three hues positioned at equal intervals around the color wheel. Works best when one color takes the lead and the others support it.",
          bestFor: "Lively, dynamic projects that need a sense of movement"
        },
        analogous: {
          colors: [baseHex, getHex(analogous1), getHex(analogous2)],
          description: "Three neighboring colors on the color wheel that share similar characteristics. Creates gentle, flowing color relationships.",
          bestFor: "Organic, serene designs that feel cohesive"
        },
        monochromatic: {
          colors: [baseHex, getHex(mono1), getHex(mono2)],
          description: "Variations of a single hue using different intensities. Creates a unified, elegant palette with subtle depth.",
          bestFor: "Clean, modern aesthetics that prioritize simplicity"
        },
        tetradic: {
          colors: [baseHex, getHex(tetradic1), getHex(tetradic2), getHex(tetradic3)],
          description: "Four colors arranged in two complementary pairs, offering a wide range of color options.",
          bestFor: "Complex designs that benefit from a varied, expressive palette"
        }
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [inputColor]);

  const colorVariations = useMemo(() => {
    try {
      const baseColor = new Color(inputColor || "#000000");
      const white = new Color('white');
      const black = new Color('black');
      const gray = new Color('gray');

      const shades: string[] = [];
      const tints: string[] = [];
      const tones: string[] = [];

      // Generate shades (0% to 100% black added)
      for (let i = 0; i <= 10; i++) {
        const percentage = i * 10;
        const amount = percentage / 100;
        const shade = baseColor.mix(black, amount, { space: 'srgb' });
        shades.push(getHex(shade));
      }

      // Generate tints (0% to 100% white added)
      for (let i = 0; i <= 10; i++) {
        const percentage = i * 10;
        const amount = percentage / 100;
        const tint = baseColor.mix(white, amount, { space: 'srgb' });
        tints.push(getHex(tint));
      }

      // Generate tones (0% to 100% gray added)
      for (let i = 0; i <= 10; i++) {
        const percentage = i * 10;
        const amount = percentage / 100;
        const tone = baseColor.mix(gray, amount, { space: 'srgb' });
        tones.push(getHex(tone));
      }

      return { shades, tints, tones };
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [inputColor]);

  const handleCopyColor = (color: string) => {
    void navigator.clipboard.writeText(color);
    toast.success("Copied to clipboard", { position: "top-center" });
  }

  return (
    <>
      <SEO
        title="Color Picker - Tools For Frontend"
        description="Pick colors from anywhere on your screen using the eye dropper tool. Convert between color formats (HEX, RGB, HSL, OKLCH) and explore color harmonies, variations, and palettes."
        keywords="color picker, eye dropper, color converter, hex, rgb, hsl, oklch, color harmonies, color palette"
        ogTitle="Color Picker - Tools For Frontend"
        ogDescription="Pick colors from anywhere on your screen using the eye dropper tool. Convert between color formats and explore color harmonies."
        canonicalUrl="https://toolsforfrontend.com/color/picker"
      />
      <div className="max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">Color Picker</h1>
          <p className="text-gray-500">Use the color picker, or pick a color from anywhere on the screen using the eye dropper.</p>
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
                    value={inputColor ? (inputColor.startsWith('#') ? inputColor : `#${inputColor}`) : "#000000"}
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
                  className="flex-1 h-10 font-mono border rounded-md p-2"
                />
                <Button onClick={handleEyeDropper} variant="outline" className="h-10">
                  <Pipette />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-stretch">
            <div className="h-full w-full rounded-md border" style={{ backgroundColor: inputColor }}></div>
          </div>
        </div>

        {colorVariations && (
          <div className="mt-10 border rounded-md p-4">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold">Variations</h2>
            </div>
            <p className="text-gray-500 mb-4">
              Generate tints and shades of your selected color by mixing in white or black in 10% increments.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold mb-1">Pro Tip</p>
              <p className="text-sm text-gray-700">Shades work well for hover states and shadows, while tints are ideal for highlights and backgrounds.</p>
            </div>

            {/* Shades Section */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2">Shades</h3>
              <p className="text-sm text-gray-600 mb-4">Darkened versions of your base color made by blending in black. Shades create a sense of depth and hierarchy in your color palette.</p>
              <div className="relative">
                <div className="flex h-16 gap-1 rounded-lg">
                  {colorVariations.shades.map((color, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === colorVariations.shades.length - 1;
                    const roundedClass = isFirst ? 'rounded-l-lg' : isLast ? 'rounded-r-lg' : '';
                    return (
                      <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleCopyColor(color)}
                            className={`flex-1 cursor-pointer ${roundedClass}`}
                            style={{ backgroundColor: color }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
                <div className="flex mt-2">
                  {Array.from({ length: 11 }, (_, i) => i * 10).map((percentage, idx) => (
                    <div key={idx} className="flex-1 flex justify-center">
                      <span className="text-xs bg-white px-1.5 py-0.5 rounded">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tints Section */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2">Tints</h3>
              <p className="text-sm text-gray-600 mb-4">Lightened versions of your base color made by blending in white. Tints make colors appear brighter and more vibrant.</p>
              <div className="relative">
                <div className="flex h-16 gap-1 rounded-lg">
                  {colorVariations.tints.map((color, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === colorVariations.tints.length - 1;
                    const roundedClass = isFirst ? 'rounded-l-lg' : isLast ? 'rounded-r-lg' : '';
                    return (
                      <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleCopyColor(color)}
                            className={`flex-1 cursor-pointer ${roundedClass}`}
                            style={{ backgroundColor: color }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
                <div className="flex mt-2">
                  {Array.from({ length: 11 }, (_, i) => i * 10).map((percentage, idx) => (
                    <div key={idx} className="flex-1 flex justify-center">
                      <span className="text-xs bg-white px-1.5 py-0.5 rounded">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tones Section */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2">Tones</h3>
              <p className="text-sm text-gray-600 mb-4">Tones of your base color made by blending in gray. Tones are a great way to add subtle depth and contrast to your color palette.</p>
              <div className="relative">
                <div className="flex h-16 gap-1 rounded-lg">
                  {colorVariations.tones.map((color, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === colorVariations.tones.length - 1;
                    const roundedClass = isFirst ? 'rounded-l-lg' : isLast ? 'rounded-r-lg' : '';
                    return (
                      <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleCopyColor(color)}
                            className={`flex-1 cursor-pointer ${roundedClass}`}
                            style={{ backgroundColor: color }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
                <div className="flex mt-2">
                  {Array.from({ length: 11 }, (_, i) => i * 10).map((percentage, idx) => (
                    <div key={idx} className="flex-1 flex justify-center">
                      <span className="text-xs bg-white px-1.5 py-0.5 rounded">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Information Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Where to Use</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Interactive element states (hover, active, disabled)</li>
                  <li>Adding visual depth through shadows and highlights</li>
                  <li>Establishing uniform color palettes</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Best Practice</h4>
                <p className="text-sm text-gray-700">
                  These variations serve as the building blocks for a unified color system. Save and export them to ensure design consistency throughout your project.
                </p>
              </div>
            </div>
          </div>
        )}

        {colorHarmonies && (
          <div className="mt-10 border rounded-md p-4">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold">Color Combinations</h2>
            </div>
            <p className="text-gray-500 mb-6">Discover color harmonies that work together. Each combination creates a different feeling and aesthetic.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 gap-x-16 bg-gray-50 rounded-lg p-4">
              <div>
                <h3 className="font-semibold mb-2">How to Use</h3>
                <p className="text-gray-500 text-sm">Tap any color swatch to copy its hex code. These palettes are based on color theory principles for harmonious results.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Why It Matters</h3>
                <p className="text-gray-500 text-sm">Well-chosen color combinations help establish visual hierarchy and communicate the right tone.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-x-16">
              {/* Complement */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg">Complement</h3>
                <p className="text-sm text-gray-600">{colorHarmonies.complement.description}</p>
                <div className="flex gap-1 h-12 rounded-lg overflow-hidden">
                  {colorHarmonies.complement.colors.map((color, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCopyColor(color)}
                          className="flex-1 cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{color}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <p className="text-sm text-gray-500"><span className="font-semibold">Best for:</span> {colorHarmonies.complement.bestFor}</p>
              </div>

              {/* Split-complementary */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg">Split-complementary</h3>
                <p className="text-sm text-gray-600">{colorHarmonies.splitComplementary.description}</p>
                <div className="flex gap-1 h-12 rounded-lg overflow-hidden">
                  {colorHarmonies.splitComplementary.colors.map((color, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCopyColor(color)}
                          className="flex-1 cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{color}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <p className="text-sm text-gray-500"><span className="font-semibold">Best for:</span> {colorHarmonies.splitComplementary.bestFor}</p>
              </div>

              {/* Triadic */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg">Triadic</h3>
                <p className="text-sm text-gray-600">{colorHarmonies.triadic.description}</p>
                <div className="flex gap-1 h-12 rounded-lg overflow-hidden">
                  {colorHarmonies.triadic.colors.map((color, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCopyColor(color)}
                          className="flex-1 cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{color}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <p className="text-sm text-gray-500"><span className="font-semibold">Best for:</span> {colorHarmonies.triadic.bestFor}</p>
              </div>

              {/* Analogous */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg">Analogous</h3>
                <p className="text-sm text-gray-600">{colorHarmonies.analogous.description}</p>
                <div className="flex gap-1 h-12 rounded-lg overflow-hidden">
                  {colorHarmonies.analogous.colors.map((color, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCopyColor(color)}
                          className="flex-1 cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{color}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <p className="text-sm text-gray-500"><span className="font-semibold">Best for:</span> {colorHarmonies.analogous.bestFor}</p>
              </div>

              {/* Monochromatic */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg">Monochromatic</h3>
                <p className="text-sm text-gray-600">{colorHarmonies.monochromatic.description}</p>
                <div className="flex gap-1 h-12 rounded-lg overflow-hidden">
                  {colorHarmonies.monochromatic.colors.map((color, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCopyColor(color)}
                          className="flex-1 cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{color}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <p className="text-sm text-gray-500"><span className="font-semibold">Best for:</span> {colorHarmonies.monochromatic.bestFor}</p>
              </div>

              {/* Tetradic */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg">Tetradic</h3>
                <p className="text-sm text-gray-600">{colorHarmonies.tetradic.description}</p>
                <div className="flex gap-1 h-12 rounded-lg overflow-hidden">
                  {colorHarmonies.tetradic.colors.map((color, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCopyColor(color)}
                          className="flex-1 cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{color}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <p className="text-sm text-gray-500"><span className="font-semibold">Best for:</span> {colorHarmonies.tetradic.bestFor}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}