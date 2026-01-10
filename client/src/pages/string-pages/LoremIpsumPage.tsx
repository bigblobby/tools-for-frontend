import { useState } from 'react';
import { loremIpsum } from 'lorem-ipsum';
import SEO from '@/components/SEO';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

type LoremType = 'words' | 'sentences' | 'paragraphs';

export default function LoremIpsumPage() {
  const [type, setType] = useState<LoremType>('words');
  const [count, setCount] = useState<number>(5);
  const [generatedText, setGeneratedText] = useState<string>('');

  const handleGenerate = () => {
    if (count < 1) {
      toast.error('Please enter a number greater than 0');
      return;
    }

    try {
      let text = loremIpsum({
        count,
        units: type,
        sentenceLowerBound: 4,
        sentenceUpperBound: 16,
        paragraphLowerBound: 4,
        paragraphUpperBound: 8,
      });
      
      // Add double newlines between paragraphs for better spacing
      if (type === 'paragraphs') {
        // Split by single newlines and join with double newlines to add spacing between paragraphs
        const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
        text = paragraphs.join('\n\n');
      }
      
      setGeneratedText(text);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to generate lorem ipsum text');
      }
    }
  };

  const handleCopy = () => {
    if (!generatedText) {
      toast.error('No text to copy');
      return;
    }
    void navigator.clipboard.writeText(generatedText);
    toast.success('Text copied to clipboard', { position: 'top-center' });
  };

  const handleClear = () => {
    setGeneratedText('');
  };

  return (
    <>
      <SEO
        title="Lorem Ipsum Generator - Generate Placeholder Text - Tools For Frontend"
        description="Generate lorem ipsum placeholder text by words, sentences, or paragraphs. Free online lorem ipsum generator tool for developers and designers."
        keywords="lorem ipsum generator, placeholder text, dummy text generator, lorem ipsum, text generator"
        ogTitle="Lorem Ipsum Generator - Tools For Frontend"
        ogDescription="Generate lorem ipsum placeholder text by words, sentences, or paragraphs."
        canonicalUrl="https://toolsforfrontend.com/string/lorem-ipsum"
      />
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Lorem Ipsum Generator</h1>
          <p className="text-gray-500">Generate lorem ipsum placeholder text by words, sentences, or paragraphs.</p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="lorem-type">Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as LoremType)}>
                <SelectTrigger id="lorem-type" className="w-full md:w-auto">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="words">Words</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="lorem-count">Number</Label>
              <Input
                id="lorem-count"
                type="number"
                min="1"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
                className="w-full md:w-auto"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleGenerate}>Generate</Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="lorem-output">Generated Text</Label>
            <Textarea
              id="lorem-output"
              readOnly
              value={generatedText}
              className="h-80"
              placeholder="Generated lorem ipsum text will appear here..."
            />
            <div className="flex gap-2">
              <Button onClick={handleCopy}>
                Copy
              </Button>
              <Button variant="destructive-min" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

