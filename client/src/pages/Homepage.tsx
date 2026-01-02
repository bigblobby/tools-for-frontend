import { Button } from '@/components/ui/button';
import useMostRecentPages from '@/hooks/useMostRecentPages';
import { getPageTitle } from '@/utilities/page.utilities';
import { Link } from '@tanstack/react-router';

export default function Homepage() {
  const recentPages = useMostRecentPages();

  const sections = [
    {
      title: '✨ Tools for strings...',
      tools: [
        {
          title: 'String Count',
          path: '/string/count'
        },
        {
          title: 'String Transform',
          path: '/string/transform'
        },
        {
          title: 'String Case Converter',
          path: '/string/case-converter'
        },
        {
          title: 'String Encode Decode',
          path: '/string/encode-decode'
        },
        {
          title: 'String JWT Decoder',
          path: '/string/jwt-decoder'
        },
        {
          title: 'String JSON Formatter',
          path: '/string/json-formatter'
        },
        {
          title: 'String Hash Generator',
          path: '/string/hash-generator'
        },
      ]
    },
    {
      title: '🎨 Tools for colors...',
      tools: [
        {
          title: 'Color Converter',
          path: '/color/converter'
        }
      ]
    },
    {
      title: '⚡ Tools for converters...',
      tools: [
        {
          title: 'XML to JSON Converter',
          path: '/converter/xml-to-json'
        },
        {
          title: 'JSON to XML Converter',
          path: '/converter/json-to-xml'
        }
      ]
    },
    {
      title: '⏰ Tools for date and time...',
      tools: [
        {
          title: 'Epoch Unix Date Time Converter',
          path: '/date-time/epoch-unix'
        },
      ]
    },
    {
      title: '🖼️ Tools for images...',
      tools: [
        {
          title: 'Image to Base64 Converter',
          path: '/image/base64'
        },
        {
          title: 'Image Optimiser',
          path: '/image/optimise'
        },
        {
          title: 'Placeholder Image Generator',
          path: '/image/placeholder'
        },
      ]
    }
  ];


  return (
    <div className="space-y-8">
      {
        recentPages.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Tools for you...</h2>
            <h3 className="mb-2">👀 Your most recently used tools...</h3>
            <ul className="flex gap-2">
              {recentPages.slice().reverse().map((path: string, index: number) => (
                <li key={index}>
                  <Button variant="secondary" size="lg" asChild>
                    <Link to={path}>{getPageTitle(path)}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )
      }
      
      <div>
        <h2 className="text-2xl font-bold mb-2">All tools...</h2>
        <div className="space-y-8">
          {sections.map((section) => {
            return (
              <div key={section.title}>
                <h3 className="mb-2">{section.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {section.tools.map(tool => {
                    return (
                      <li key={tool.title}>
                        <Button variant="secondary" size="lg" asChild>
                          <Link to={tool.path}>{tool.title}</Link>
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}