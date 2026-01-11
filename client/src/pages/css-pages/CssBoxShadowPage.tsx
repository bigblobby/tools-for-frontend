import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import SEO from '@/components/SEO';

export default function CssBoxShadowPage() {
  const [horizontalOffset, setHorizontalOffset] = useState(5);
  const [verticalOffset, setVerticalOffset] = useState(5);
  const [blurRadius, setBlurRadius] = useState(30);
  const [spreadRadius, setSpreadRadius] = useState(5);
  const [color, setColor] = useState("#727272");
  const [inset, setInset] = useState(false);

  const shadowValue = `${inset ? "inset " : ""}${horizontalOffset}px ${verticalOffset}px ${blurRadius}px ${spreadRadius}px ${color}`;
  const boxShadow = `box-shadow: ${shadowValue};
-webkit-box-shadow: ${shadowValue};
-moz-box-shadow: ${shadowValue};`;

  const handleCopyBoxShadow = () => {
    void navigator.clipboard.writeText(boxShadow);
    toast.success("Copied to clipboard");
  }

  return (
    <>
      <SEO
        title="CSS Box Shadow Generator - Tools For Frontend"
        description="Generate CSS box shadows with customizable offset, blur, spread, color, and inset options. Free online CSS box shadow generator tool."
        keywords="box shadow generator, css box shadow, shadow generator, css shadow, box shadow css, shadow tool"
        ogTitle="CSS Box Shadow Generator - Tools For Frontend"
        ogDescription="Generate CSS box shadows with customizable options."
        canonicalUrl="https://toolsforfrontend.com/css/box-shadow"
      />
      <div>
        <div>
          <h1 className="text-2xl font-bold">Box Shadow Generator</h1>
          <p className="text-gray-500">Generate box shadows for your CSS.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-10 xl:gap-20 mt-10">
          <div className="basis-1/3 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="horizontal-offset">Horizontal offset (px)</Label>
              <div className="flex flex-row gap-2 items-center">
                <Slider id="horizontal-offset" min={-100} max={100} value={[horizontalOffset]} onValueChange={(value) => setHorizontalOffset(value[0])} />
                <span>{horizontalOffset}px</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vertical-offset">Vertical offset (px)</Label>
              <div className="flex flex-row gap-2 items-center">
                <Slider id="vertical-offset" min={-100} max={100} value={[verticalOffset]} onValueChange={(value) => setVerticalOffset(value[0])} />
                <span>{verticalOffset}px</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="blur-radius">Blur radius (px)</Label>
              <div className="flex flex-row gap-2 items-center">
                <Slider id="blur-radius" min={0} max={100} value={[blurRadius]} onValueChange={(value) => setBlurRadius(value[0])} />
                <span>{blurRadius}px</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="spread-radius">Spread radius (px)</Label>
              <div className="flex flex-row gap-2 items-center">
                <Slider id="spread-radius" min={0} max={100} value={[spreadRadius]} onValueChange={(value) => setSpreadRadius(value[0])} />
                <span>{spreadRadius}px</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="inset">Inset</Label>
              <Switch id="inset" checked={inset} size="lg" onCheckedChange={setInset} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="color">Color</Label>
              <input type="color" id="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full" />
            </div>
          </div>
  
          <div className="flex-1 flex flex-col gap-20">
            <div className="w-1/2 mx-auto h-40 rounded-md bg-white border border-gray-300" style={{ boxShadow: shadowValue }}></div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="box-shadow-output">Box Shadow</Label>
                <textarea readOnly value={boxShadow} id="box-shadow-output" className="block w-full h-24 font-mono border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <Button onClick={handleCopyBoxShadow}>Copy</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}