import SEO from '@/components/SEO';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import { Textarea } from '@/components/ui/textarea.tsx';
import { IconCopy, IconExternalLink } from '@tabler/icons-react';
import { toast } from 'sonner';

const DEFAULT_BACKGROUND_COLOR = '#e6e6e6';
const DEFAULT_TEXT_COLOR = '#666666';

export default function ImagePlaceholderGeneratorPage() {
  const [backgroundInputColor, setBackgroundInputColor] = useState(DEFAULT_BACKGROUND_COLOR);
  const [textInputColor, setTextInputColor] = useState(DEFAULT_TEXT_COLOR);
  const [width, setWidth] = useState('400');
  const [height, setHeight] = useState('400');
  const [text, setText] = useState('');

  const debouncedWidth = useDebounce(width, 500);
  const debouncedHeight = useDebounce(height, 500);
  const debouncedBackgroundColor = useDebounce(backgroundInputColor, 500);
  const debouncedTextColor = useDebounce(textInputColor, 500);
  const debouncedText = useDebounce(text, 500);

  const { data: image } = useQuery({
    queryKey: ['image', debouncedWidth, debouncedHeight, debouncedBackgroundColor, debouncedTextColor, debouncedText],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedBackgroundColor && debouncedBackgroundColor !== DEFAULT_BACKGROUND_COLOR) params.set('bgColor', debouncedBackgroundColor.replace('#', ''));
      if (debouncedTextColor && debouncedTextColor !== DEFAULT_TEXT_COLOR) params.set('color', debouncedTextColor.replace('#', ''));
      if (debouncedText) {
        const textForUrl = debouncedText.replace(/\n/g, '\\n');
        params.set('text', textForUrl);
      }

      let url = `${location.origin}/p/${debouncedWidth}x${debouncedHeight}`;
      if (params.size > 0) url += `?${decodeURIComponent(params.toString())}`;
      return url;
    },
  });

  const handleBackgroundColorPickerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById('color-picker')?.click();
  };

  const handleBackgroundColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundInputColor(e.target.value);
  };

  const handleFocusBackgroundColorInput = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget.select();
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundInputColor(e.target.value);
  };

  const handleTextColorPickerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById('color-picker-text')?.click();
  };

  const handleTextColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputColor(e.target.value);
  };

  const handleFocusTextColorInput = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget.select();
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputColor(e.target.value);
  };

  const handleCopyImageUrl = () => {
    void navigator.clipboard.writeText(image || '');
    toast.success('Copied to clipboard');
  };

  const handleCommonSizeClick = (width: string, height: string) => {
    const params = new URLSearchParams();
    if (debouncedBackgroundColor && debouncedBackgroundColor !== DEFAULT_BACKGROUND_COLOR) params.set('bgColor', debouncedBackgroundColor.replace('#', ''));
    if (debouncedTextColor && debouncedTextColor !== DEFAULT_TEXT_COLOR) params.set('color', debouncedTextColor.replace('#', ''));
    if (debouncedText) {
      const textForUrl = debouncedText.replace(/\n/g, '\\n');
      params.set('text', textForUrl);
    }

    let url = `${location.origin}/p/${width}x${height}`;
    if (params.size > 0) url += `?${decodeURIComponent(params.toString())}`;
    window.open(url, '_blank');
  };

  const commonSizes = [
    { width: '1920', height: '1080', name: 'Full HD' },
    { width: '2560', height: '1440', name: '2K / QHD' },
    { width: '3840', height: '2160', name: '4K / UHD' },
    { width: '1200', height: '630', name: 'OG Image' },
    { width: '1080', height: '1080', name: 'Square' },
    { width: '300', height: '250', name: 'Medium Rectangle' },
    { width: '728', height: '90', name: 'Leaderboard' },
    { width: '1280', height: '720', name: 'HD / 720p' },
  ];

  return (
    <>
      <SEO
        title="Placeholder Image Generator - Tools For Frontend"
        description="Generate placeholder images of any size instantly. Free online placeholder image generator for developers and designers."
        keywords="placeholder image, image placeholder generator, placeholder generator, dummy image, placeholder image url"
        ogTitle="Placeholder Image Generator - Tools For Frontend"
        ogDescription="Generate placeholder images of any size instantly."
        canonicalUrl="https://toolsforfrontend.com/image/placeholder"
      />
      <div className="flex flex-col gap-10 max-w-8xl">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Image placeholder generator</h1>
            <p className="text-gray-500">Generate placeholder images of any size with customisable colors and text.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3 border rounded-md p-4">
              <h2 className="text-xl font-bold">Preview</h2>
              <div className="max-h-[800px]">
                {image && <img className="rounded-md max-h-full" src={image} alt="" />}
              </div>
              <div className="flex gap-2 mt-auto">
                <Input value={image || ''} readOnly />
                <Button onClick={handleCopyImageUrl}><IconCopy /></Button>
                <Button asChild>
                  <a href={image || ''} target="_blank" rel="noopener noreferrer">
                    <IconExternalLink />
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="border rounded-md p-4">
                <h3 className="text-xl font-bold">Size</h3>
                <p className="text-gray-500">Set the width and height of your placeholder image.</p>
                <div className="flex gap-3 mt-4">
                  <div className="basis-1/2 space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
                  </div>
                  <div className="basis-1/2 space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="text-xl font-bold">Color</h3>
                <p className="text-gray-500">Customise background and text colors.</p>
                <div className="flex flex-col gap-3 mt-4">
                  <div className="basis-1/2 space-y-2">
                    <Label htmlFor="color-input">Background color <span className="text-xs">(Orange, #FFA500, hsl(36, 100%, 50%), etc.)</span></Label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Button variant="outline" style={{ backgroundColor: backgroundInputColor }} onClick={handleBackgroundColorPickerClick} className="h-10 w-20">
                          <span className="sr-only">Color picker</span>
                        </Button>
                        <input
                          id="color-picker"
                          type="color"
                          value={backgroundInputColor ? (backgroundInputColor.startsWith('#') ? backgroundInputColor : `#${backgroundInputColor}`) : '#000000'}
                          onChange={handleBackgroundColorPickerChange}
                          className="absolute top-0 left-0 -z-10 h-10 w-20 rounded-md cursor-pointer"
                          title="Pick a color"
                        />
                      </div>
                      <input
                        id="color-input"
                        value={backgroundInputColor}
                        onFocus={handleFocusBackgroundColorInput}
                        onChange={handleBackgroundColorChange}
                        type="text"
                        placeholder="Enter a color"
                        className="flex-1 h-10 font-mono border rounded-md p-2"
                      />
                    </div>
                  </div>
                  <div className="basis-1/2 space-y-2">
                    <Label htmlFor="color-input-text">Text color <span className="text-xs">(Orange, #FFA500, hsl(36, 100%, 50%), etc.)</span></Label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Button variant="outline" style={{ backgroundColor: textInputColor }} onClick={handleTextColorPickerClick} className="h-10 w-20">
                          <span className="sr-only">Color picker</span>
                        </Button>
                        <input
                          id="color-picker-text"
                          type="color"
                          value={textInputColor ? (textInputColor.startsWith('#') ? textInputColor : `#${textInputColor}`) : '#000000'}
                          onChange={handleTextColorPickerChange}
                          className="absolute top-0 left-0 -z-10 h-10 w-20 rounded-md cursor-pointer"
                          title="Pick a color"
                        />
                      </div>
                      <input
                        id="color-input-text"
                        value={textInputColor}
                        onFocus={handleFocusTextColorInput}
                        onChange={handleTextColorChange}
                        type="text"
                        placeholder="Enter a color"
                        className="flex-1 h-10 font-mono border rounded-md p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="text-xl font-bold">Text</h3>
                <p className="text-gray-500">Customise the text displayed on the image.</p>
                <div className="flex gap-3 mt-4">
                  <div className="space-y-2 w-full">
                    <Label htmlFor="width">Custom text (optional)</Label>
                    <Textarea className="w-full" id="width" value={text} onChange={(e) => setText(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <h3 className="text-xl font-bold mb-4">Common Sizes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {commonSizes.map((size) => (
                <button
                  key={`${size.width}x${size.height}`}
                  onClick={() => handleCommonSizeClick(size.width, size.height)}
                  className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="text-lg font-bold">{size.width} x {size.height}</span>
                  <span className="text-sm text-gray-500 mt-1">{size.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}