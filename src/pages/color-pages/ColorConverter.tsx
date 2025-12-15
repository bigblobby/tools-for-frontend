import { useState } from "react";

export default function ColorConverter() {
  const [hexColor, setHexColor] = useState("#000000");
  const [rgbColor, setRgbColor] = useState({ r: 0, g: 0, b: 0 });
  const [hslColor, setHslColor] = useState({ h: 0, s: 0, l: 0 });
  const [cmykColor, setCmykColor] = useState({ c: 0, m: 0, y: 0, k: 0 });
  const [labColor, setLabColor] = useState({ l: 0, a: 0, b: 0 });
  const [xyzColor, setXyzColor] = useState({ x: 0, y: 0, z: 0 });
  const [hsvColor, setHsvColor] = useState({ h: 0, s: 0, v: 0 });
  const [hsbColor, setHsbColor] = useState({ h: 0, s: 0, b: 0 });


  const rgb = (color: string) => {
    return {
      r: parseInt(color.slice(1, 3), 16),
      g: parseInt(color.slice(3, 5), 16),
      b: parseInt(color.slice(5, 7), 16),
    }
  }

  const hsl = (color: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

    if (!result) {
      throw new Error("Could not parse Hex Color");
    }

    const rHex = parseInt(result[1], 16);
    const gHex = parseInt(result[2], 16);
    const bHex = parseInt(result[3], 16);

    const r = rHex / 255;
    const g = gHex / 255;
    const b = bHex / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = (max + min) / 2;
    let s = h;
    let l = h;

    if (max === min) {
      // Achromatic
      return { h: 0, s: 0, l };
    }

    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    return { h, s, l };
  }

  const setColor = (color: string) => {
    console.log(color);
    setHexColor(color);
    setRgbColor(rgb(color));
    setHslColor(hsl(color));
  }

  return (
    <div>
      <input type="color" value={hexColor} onChange={(e) => setColor(e.target.value)} />
      <div>
        <p>Hex: {hexColor}</p>
        <p>RGB: {rgbColor.r}, {rgbColor.g}, {rgbColor.b}</p>
        <p>HSL: {hslColor.h}%, {hslColor.s}%, {hslColor.l}%</p>
      </div>
    </div>
  )
}