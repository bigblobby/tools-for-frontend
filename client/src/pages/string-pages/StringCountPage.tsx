import { useState } from 'react';
import SEO from '@/components/SEO';

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
          <p className="text-gray-500">Counts the number of words and characters in a string.</p>
        </div>

        <div>
          <textarea id="string-input" className="block w-full h-40 border border-gray-300 rounded-md p-2" onChange={handleInputChange}/>
        </div>

        <div>
          <p className="text-gray-500">Word Count: <span className="font-bold">{wordCount}</span></p>
          <p className="text-gray-500">Character Count: <span className="font-bold">{characterCount}</span></p>
        </div>
      </div>
    </>
  );
}