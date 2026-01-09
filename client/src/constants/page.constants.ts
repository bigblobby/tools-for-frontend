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
      { title: 'Hash Generator', path: '/string/hash-generator' },
    ]
  },
  {
    category: 'Colors',
    icon: '🫟',
    items: [
      { title: 'Color Picker', path: '/color/picker' },
      { title: 'Color Converter', path: '/color/converter' },
      { title: 'Gradient Generator', path: '/color/gradient-generator' },
      { title: 'Contrast Checker', path: '/color/contrast-checker' }
    ]
  },
  {
    category: 'CSS',
    icon: '🎨',
    items: [
      { title: 'Box Shadow', path: '/css/box-shadow' },
    ]
  },
  {
    category: 'Data',
    icon: '',
    items: [
      { title: 'XML to JSON', path: '/data/xml-to-json', tags: ['converter'] },
      { title: 'JSON to XML', path: '/data/json-to-xml', tags: ['converter'] },
      { title: 'JWT Decoder', path: '/data/jwt-decoder' },
      { title: 'JSON Formatter', path: '/data/json-formatter' },
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

