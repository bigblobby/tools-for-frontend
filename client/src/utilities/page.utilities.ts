export const getPageTitle = (path: string): string => {
  switch (path) {
    case '/':
      return 'Home';
    case '/string/count':
      return 'String Count';
    case '/string/transform':
      return 'String Transform';
    case '/string/case-converter':
      return 'String Case Converter';
    case '/string/encode-decode':
      return 'String Encode Decode';
    case '/string/jwt-decoder':
      return 'String JWT Decoder';
    case '/string/json-formatter':
      return 'String JSON Formatter';
    case '/string/hash-generator':
      return 'String Hash Generator';
    case '/color/converter':
      return 'Color Converter';
    case '/converter/xml-to-json':
      return 'XML to JSON Converter';
    case '/converter/json-to-xml':
      return 'JSON to XML Converter';
    case '/date-time/epoch-unix':
      return 'Epoch Unix Date Time Converter';
    case '/image/base64':
      return 'Image to Base64 Converter';
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