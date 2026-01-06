import type { PageCategory } from '@/interfaces/search.interface.ts';

export const pageCategories: PageCategory[] = [
  {
    category: 'Strings',
    icon: '🧵',
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
    category: 'Colors',
    icon: '🎨',
    items: [
      { title: 'Color Converter', path: '/color/converter' },
      { title: 'Gradient Generator', path: '/color/gradient-generator' }
    ]
  },
  {
    category: 'Converters',
    icon: '🔄',
    items: [
      { title: 'XML to JSON', path: '/converter/xml-to-json' },
      { title: 'JSON to XML', path: '/converter/json-to-xml' },
    ]
  },
  {
    category: 'Date & Time',
    icon: '⏰',
    items: [
      { title: 'Epoch/Unix Converter', path: '/date-time/epoch-unix' },
    ]
  },
  {
    category: 'Images',
    icon: '🖼️',
    items: [
      { title: 'Image to Base64', path: '/image/base64' },
      { title: 'Image Optimiser', path: '/image/optimise' },
      { title: 'Placeholder Image Generator', path: '/image/placeholder' },
      { title: 'Favicon Generator', path: '/image/favicon-generator' },
    ]
  }
];

