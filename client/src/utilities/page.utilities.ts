export const getPageTitle = (path: string): string => {
  switch (path) {
    case '/':
      return 'Home';
    case '/string/count':
      return 'Count';
    case '/string/transform':
      return 'Transform';
    case '/string/case-converter':
      return 'Case Converter';
    case '/string/encode-decode':
      return 'Encode Decode';
    case '/string/jwt-decoder':
      return 'JWT Decoder';
    case '/string/json-formatter':
      return 'JSON Formatter';
    case '/string/hash-generator':
      return 'Hash Generator';
    case '/color/converter':
      return 'Color Converter';
    case '/converter/xml-to-json':
      return 'XML to JSON';
    case '/converter/json-to-xml':
      return 'JSON to XML';
    case '/date-time/epoch-unix':
      return 'Epoch Unix Date Time Converter';
    case '/image/base64':
      return 'Image to Base64';
    case '/image/optimise':
      return 'Image Optimiser';
    case '/image/placeholder':
      return 'Placeholder Image Generator';
    case '/image/favicon-generator':
      return 'Favicon Generator';
    default:
      return 'Unknown';
  }
};