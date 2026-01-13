import { useState } from 'react';
import SEO from '@/components/SEO';
import { Textarea } from '@/components/ui/textarea.tsx';

export default function StringCountPage() {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setWordCount(text.split(/\s+/).filter(Boolean).length);
    setCharacterCount(text.length);
  };

  return (
    <>
      <SEO
        title="String Counter - Word & Character Count Tool - Tools For Frontend"
        description="Count words and characters in any text string. Free online word counter and character counter tool for writers, developers, and content creators."
        keywords="word counter, character counter, text counter, string counter, word count, character count"
        ogTitle="String Counter - Word & Character Count Tool"
        ogDescription="Count words and characters in any text string instantly."
        canonicalUrl="https://toolsforfrontend.com/string/count"
      />
      <div className="flex flex-col gap-4 max-w-8xl">
        <div>
          <h1 className="text-2xl font-bold">Count</h1>
          <p className="text-muted-foreground">Counts the number of words and characters in a string.</p>
        </div>

        <div>
          <Textarea id="string-input" className="h-40" onChange={handleInputChange} />
        </div>

        <div>
          <p className="text-muted-foreground">Word Count: <span className="font-bold">{wordCount}</span></p>
          <p className="text-muted-foreground">Character Count: <span className="font-bold">{characterCount}</span></p>
        </div>
      </div>
    </>
  );
}