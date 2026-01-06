import type { SearchCategory } from './Search.types';

export const searchItems: SearchCategory[] = [
  {
    category: 'String Utilities',
    items: [
      { title: 'Count', path: '/string/count' },
      { title: 'Transform', path: '/string/transform' },
      { title: 'Case Converter', path: '/string/case-converter' },
      { title: 'Encode Decode', path: '/string/encode-decode' },
      { title: 'JWT Decoder', path: '/string/jwt-decoder' },
      { title: 'JSON Formatter', path: '/string/json-formatter' },
      { title: 'Hash Generator', path: '/string/hash-generator' },
    ]
  },
  {
    category: 'Color Utilities',
    items: [
      { title: 'Color Converter', path: '/color/converter' },
    ]
  },
  {
    category: 'Converters',
    items: [
      { title: 'XML to JSON', path: '/converter/xml-to-json' },
      { title: 'JSON to XML', path: '/converter/json-to-xml' },
    ]
  },
  {
    category: 'Date & Time',
    items: [
      { title: 'Epoch Unix Date Time Converter', path: '/date-time/epoch-unix' },
    ]
  },
  {
    category: 'Image Utilities',
    items: [
      { title: 'Image to Base64', path: '/image/base64' },
      { title: 'Image Optimiser', path: '/image/optimise' },
      { title: 'Placeholder Image Generator', path: '/image/placeholder' },
      { title: 'Favicon Generator', path: '/image/favicon-generator' },
    ]
  }
];

