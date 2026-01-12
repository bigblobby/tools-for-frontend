import React, { useState, useMemo } from 'react';
import Color from 'colorjs.io';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Pipette, Check, X } from 'lucide-react';
import type { WindowWithEyeDropper } from '@/interfaces/browser.types';
import SEO from '@/components/SEO';
import { Input } from '@/components/ui/input.tsx';

interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAALarge: boolean;
  passesAAA: boolean;
  passesAAALarge: boolean;
}

// Calculate relative luminance according to WCAG 2.1
function getRelativeLuminance(color: Color): number {
  // Get RGB values (0-1 range)
  const rgb = color.toGamut({ space: 'srgb' }).to('srgb');
  const r = rgb.r || 0;
  const g = rgb.g || 0;
  const b = rgb.b || 0;

  // Apply gamma correction
  const gammaCorrect = (value: number): number => {
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  const rLinear = gammaCorrect(r);
  const gLinear = gammaCorrect(g);
  const bLinear = gammaCorrect(b);

  // Calculate relative luminance
  // L = 0.2126 * R + 0.7152 * G + 0.0722 * B
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function calculateContrastRatio(foreground: Color, background: Color): ContrastResult {
  // Get relative luminance for both colors
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);

  // Calculate contrast ratio
  // Formula: (L1 + 0.05) / (L2 + 0.05) where L1 is lighter, L2 is darker
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  // WCAG standards:
  // AA normal text: 4.5:1
  // AA large text: 3:1
  // AAA normal text: 7:1
  // AAA large text: 4.5:1
  const passesAA = ratio >= 4.5;
  const passesAALarge = ratio >= 3;
  const passesAAA = ratio >= 7;
  const passesAAALarge = ratio >= 4.5;

  return {
    ratio,
    passesAA,
    passesAALarge,
    passesAAA,
    passesAAALarge,
  };
}

function getHex(color: Color): string {
  try {
    const hex = color.toGamut({ space: 'srgb' }).to('srgb').toString({ format: 'hex' });
    const longhex = hex.length < 6 ? hex.split('').map(v => v + v).join('').slice(1) : hex;
    return longhex.toUpperCase();
  } catch {
    return '#000000';
  }
}

export default function ColorContrastChecker() {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const contrastResult = useMemo(() => {
    try {
      const fg = new Color(foregroundColor);
      const bg = new Color(backgroundColor);
      return calculateContrastRatio(fg, bg);
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [foregroundColor, backgroundColor]);

  const handleForegroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForegroundColor(e.target.value);
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
  };

  const handleForegroundFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget.select();
  };

  const handleBackgroundFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget.select();
  };

  const handleForegroundPickerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById('foreground-picker')?.click();
  };

  const handleBackgroundPickerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById('background-picker')?.click();
  };

  const handleForegroundPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForegroundColor(e.target.value);
  };

  const handleBackgroundPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
  };

  const handleEyeDropper = async (type: 'foreground' | 'background') => {
    try {
      if (!('EyeDropper' in window)) {
        toast.error("EyeDropper API is not supported in your browser");
        return;
      }

      const eyeDropper = new (window as WindowWithEyeDropper).EyeDropper();
      const result = await eyeDropper.open();

      if (result.sRGBHex) {
        if (type === 'foreground') {
          setForegroundColor(result.sRGBHex);
        } else {
          setBackgroundColor(result.sRGBHex);
        }
        toast.success("Color picked successfully");
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Failed to pick color");
        console.error(error);
      }
    }
  };

  const getHexFromString = (colorString: string): string => {
    try {
      const color = new Color(colorString);
      return getHex(color);
    } catch {
      return '#000000';
    }
  };

  const fgHex = getHexFromString(foregroundColor);
  const bgHex = getHexFromString(backgroundColor);

  return (
    <>
      <SEO
        title="Color Contrast Checker - Tools For Frontend"
        description="Check if your foreground and background colors meet WCAG 2.1 accessibility standards (AA and AAA). Free online color contrast checker for web accessibility."
        keywords="color contrast checker, wcag, accessibility, contrast ratio, aa compliance, aaa compliance, web accessibility"
        ogTitle="Color Contrast Checker - Tools For Frontend"
        ogDescription="Check if your colors meet WCAG 2.1 accessibility standards for web accessibility."
        canonicalUrl="https://toolsforfrontend.com/color/contrast-checker"
      />
      <div className="max-w-8xl">
        <div>
          <h1 className="text-2xl font-bold">Color Contrast Checker</h1>
          <p className="text-muted-foreground">Check if your foreground and background colors meet WCAG accessibility standards.</p>
        </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Foreground Color Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="foreground-input">Foreground Color</Label>
          <div className="flex gap-2">
            <div className="relative">
              <Button
                variant="outline"
                style={{ backgroundColor: foregroundColor }}
                onClick={handleForegroundPickerClick}
                className="h-10 w-20"
              >
                <span className="sr-only">Color picker</span>
              </Button>
              <Input
                id="foreground-picker"
                type="color"
                value={fgHex.startsWith('#') ? fgHex : `#${fgHex}`}
                onChange={handleForegroundPickerChange}
                className="absolute top-0 left-0 -z-10 h-10 w-20"
                title="Pick foreground color"
              />
            </div>
            <Input
              id="foreground-input"
              value={foregroundColor}
              onFocus={handleForegroundFocus}
              onChange={handleForegroundChange}
              type="text"
              placeholder="Enter foreground color"
              className="flex-1 h-10 font-mono"
            />
            <Button
              onClick={() => handleEyeDropper('foreground')}
              variant="outline"
              className="h-10"
            >
              <Pipette />
            </Button>
          </div>
        </div>

        {/* Background Color Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="background-input">Background Color</Label>
          <div className="flex gap-2">
            <div className="relative">
              <Button
                variant="outline"
                style={{ backgroundColor: backgroundColor }}
                onClick={handleBackgroundPickerClick}
                className="h-10 w-20"
              >
                <span className="sr-only">Color picker</span>
              </Button>
              <Input
                id="background-picker"
                type="color"
                value={bgHex.startsWith('#') ? bgHex : `#${bgHex}`}
                onChange={handleBackgroundPickerChange}
                className="absolute top-0 left-0 -z-10 h-10 w-20"
                title="Pick background color"
              />
            </div>
            <Input
              id="background-input"
              value={backgroundColor}
              onFocus={handleBackgroundFocus}
              onChange={handleBackgroundChange}
              type="text"
              placeholder="Enter background color"
              className="flex-1 h-10 font-mono"
            />
            <Button
              onClick={() => handleEyeDropper('background')}
              variant="outline"
              className="h-10"
            >
              <Pipette />
            </Button>
          </div>
        </div>
      </div>

      {/* Contrast Results */}
      {contrastResult && (
        <div className="mt-10 border rounded-md p-6">
          <h2 className="text-xl font-bold mb-4">WCAG Compliance Results</h2>

          <div className="mb-6">
            <div className="text-3xl font-bold mb-2">
              Contrast Ratio: {contrastResult.ratio.toFixed(2)}:1
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className={`h-2.5 rounded-full ${contrastResult.ratio >= 7
                  ? 'bg-green-500'
                  : contrastResult.ratio >= 4.5
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                  }`}
                style={{ width: `${Math.min((contrastResult.ratio / 7) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WCAG AA */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3">WCAG AA</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Normal Text (4.5:1)</span>
                  {contrastResult.passesAA ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">Pass</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="h-4 w-4" />
                      <span className="text-sm">Fail</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Large Text (3:1)</span>
                  {contrastResult.passesAALarge ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">Pass</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="h-4 w-4" />
                      <span className="text-sm">Fail</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* WCAG AAA */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3">WCAG AAA</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Normal Text (7:1)</span>
                  {contrastResult.passesAAA ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">Pass</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="h-4 w-4" />
                      <span className="text-sm">Fail</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Large Text (4.5:1)</span>
                  {contrastResult.passesAAALarge ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">Pass</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="h-4 w-4" />
                      <span className="text-sm">Fail</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-world Component Examples */}
      {contrastResult && (
        <div className="mt-10 border rounded-md p-6">
          <h2 className="text-xl font-bold mb-4">Component Examples</h2>
          <p className="text-gray-500 mb-6">
            See how your color combination looks in real-world UI components.
          </p>

          <div className="space-y-6">
            {/* Button Examples */}
            <div>
              <h3 className="font-semibold mb-3">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  className="px-4 py-2 rounded-md font-medium"
                  style={{
                    backgroundColor: backgroundColor,
                    color: foregroundColor,
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-md font-medium border-2"
                  style={{
                    backgroundColor: backgroundColor,
                    color: foregroundColor,
                    borderColor: foregroundColor,
                  }}
                >
                  Outlined Button
                </button>
                <button
                  className="px-4 py-2 rounded-md font-medium"
                  style={{
                    backgroundColor: foregroundColor,
                    color: backgroundColor,
                  }}
                >
                  Inverted Button
                </button>
              </div>
            </div>

            {/* Text Examples */}
            <div>
              <h3 className="font-semibold mb-3">Text</h3>
              <div
                className="rounded-md p-4 space-y-2"
                style={{ backgroundColor: backgroundColor }}
              >
                <h4
                  className="text-2xl font-bold"
                  style={{ color: foregroundColor }}
                >
                  Heading Text
                </h4>
                <p
                  className="text-base"
                  style={{ color: foregroundColor }}
                >
                  This is regular body text. It should be readable and meet accessibility standards for normal text.
                </p>
                <p
                  className="text-sm"
                  style={{ color: foregroundColor }}
                >
                  This is smaller text that might be used for captions or secondary information.
                </p>
                <a
                  href="#"
                  className="underline inline-block"
                  style={{ color: foregroundColor }}
                >
                  Link text example
                </a>
              </div>
            </div>

            {/* Card Example */}
            <div>
              <h3 className="font-semibold mb-3">Card</h3>
              <div
                className="rounded-lg p-6 shadow-md"
                style={{ backgroundColor: backgroundColor }}
              >
                <h4
                  className="text-xl font-bold mb-2"
                  style={{ color: foregroundColor }}
                >
                  Card Title
                </h4>
                <p
                  className="mb-4"
                  style={{ color: foregroundColor }}
                >
                  This is a card component with your selected colors. Cards are commonly used for displaying content in a contained format.
                </p>
                <button
                  className="px-4 py-2 rounded-md font-medium"
                  style={{
                    backgroundColor: foregroundColor,
                    color: backgroundColor,
                  }}
                >
                  Action Button
                </button>
              </div>
            </div>

            {/* Badge/Tag Example */}
            <div>
              <h3 className="font-semibold mb-3">Badge / Tag</h3>
              <div className="flex flex-wrap gap-2">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: backgroundColor,
                    color: foregroundColor,
                    border: `1px solid ${foregroundColor}`,
                  }}
                >
                  Tag Label
                </span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: foregroundColor,
                    color: backgroundColor,
                  }}
                >
                  Filled Badge
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

