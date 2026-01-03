import { isHexLikeColor } from '@/utlities/color.utilities';

export function parseColor(color: string) {
  if (!color) return null;
  
  let parsedColor = color;
  const isHexLike = isHexLikeColor(parsedColor);

  if (isHexLike) {
    parsedColor = `#${parsedColor}`;
  }
  
  return parsedColor;
}