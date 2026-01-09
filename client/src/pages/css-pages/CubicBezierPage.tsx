import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import SEO from '@/components/SEO';

interface BezierPoint {
  x: number;
  y: number;
}

const PRESETS = {
  'ease': { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1.0 },
  'ease-in': { x1: 0.42, y1: 0.0, x2: 1.0, y2: 1.0 },
  'ease-out': { x1: 0.0, y1: 0.0, x2: 0.58, y2: 1.0 },
  'ease-in-out': { x1: 0.42, y1: 0.0, x2: 0.58, y2: 1.0 },
  'linear': { x1: 0.0, y1: 0.0, x2: 1.0, y2: 1.0 },
  'bounce': { x1: 0.68, y1: -0.55, x2: 0.265, y2: 1.55 },
  'elastic': { x1: 0.68, y1: -0.6, x2: 0.32, y2: 1.6 },
};

export default function CubicBezierPage() {
  const [x1, setX1] = useState(0.25);
  const [y1, setY1] = useState(0.1);
  const [x2, setX2] = useState(0.25);
  const [y2, setY2] = useState(1.0);
  const [preset, setPreset] = useState<string>('custom');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPosition, setAnimationPosition] = useState<'start' | 'end'>('start');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cubicBezierValue = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = Math.min(rect.width - 32, 500);
      const displayHeight = 400;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      drawBezierCurve();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [x1, y1, x2, y2]);

  useEffect(() => {
    drawBezierCurve();
  }, [x1, y1, x2, y2]);

  const drawBezierCurve = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * graphWidth;
      const y = padding + (i / 10) * graphHeight;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('0', padding, height - padding + 20);
    ctx.fillText('1', width - padding, height - padding + 20);
    ctx.textAlign = 'left';
    ctx.fillText('1', padding - 25, padding + 5);
    ctx.fillText('0', padding - 25, height - padding + 5);

    // Draw control points
    const p0 = { x: padding, y: height - padding };
    const p1 = { x: padding + x1 * graphWidth, y: height - padding - y1 * graphHeight };
    const p2 = { x: padding + x2 * graphWidth, y: height - padding - y2 * graphHeight };
    const p3 = { x: width - padding, y: padding };

    // Draw control lines
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw control point circles
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    const drawControlPoint = (point: BezierPoint) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    };

    drawControlPoint(p1);
    drawControlPoint(p2);

    // Draw bezier curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);

    for (let t = 0; t <= 1; t += 0.01) {
      const point = cubicBezierPoint(t, p0, p1, p2, p3);
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  };

  const cubicBezierPoint = (t: number, p0: BezierPoint, p1: BezierPoint, p2: BezierPoint, p3: BezierPoint): BezierPoint => {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
      y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
    };
  };

  const handlePresetChange = (value: string) => {
    setPreset(value);
    if (value !== 'custom' && PRESETS[value as keyof typeof PRESETS]) {
      const presetValues = PRESETS[value as keyof typeof PRESETS];
      setX1(presetValues.x1);
      setY1(presetValues.y1);
      setX2(presetValues.x2);
      setY2(presetValues.y2);
    }
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(cubicBezierValue);
    toast.success("Copied to clipboard", { position: "top-center" });
  };

  const handleCopyCSS = () => {
    const css = `transition-timing-function: ${cubicBezierValue};`;
    void navigator.clipboard.writeText(css);
    toast.success("CSS copied to clipboard", { position: "top-center" });
  };

  const toggleAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
      setAnimationPosition('start');
    } else {
      // Reset to start position first
      setAnimationPosition('start');
      setIsAnimating(false);
      // Use requestAnimationFrame to ensure the reset renders before starting animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
          setAnimationPosition('end');
        });
      });
    }
  };

  // Restart animation if values change while animating
  useEffect(() => {
    if (isAnimating) {
      // Restart animation to apply new timing function
      setAnimationPosition('start');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPosition('end');
        });
      });
    }
  }, [x1, y1, x2, y2]);

  // Check if current values match a preset
  useEffect(() => {
    for (const [key, values] of Object.entries(PRESETS)) {
      if (
        Math.abs(x1 - values.x1) < 0.01 &&
        Math.abs(y1 - values.y1) < 0.01 &&
        Math.abs(x2 - values.x2) < 0.01 &&
        Math.abs(y2 - values.y2) < 0.01
      ) {
        if (preset !== key) {
          setPreset(key);
        }
        return;
      }
    }
    if (preset !== 'custom') {
      setPreset('custom');
    }
  }, [x1, y1, x2, y2]);

  return (
    <>
      <SEO
        title="CSS Cubic Bezier / Easing Function Generator - Tools For Frontend"
        description="Generate and visualize CSS cubic-bezier easing functions. Interactive tool to create custom easing curves with live preview and animation."
        keywords="cubic bezier, easing function, css easing, transition timing function, bezier curve, animation easing"
        ogTitle="CSS Cubic Bezier / Easing Function Generator - Tools For Frontend"
        ogDescription="Generate and visualize CSS cubic-bezier easing functions with interactive controls."
        canonicalUrl="https://toolsforfrontend.com/css/cubic-bezier"
      />
      <div>
        <div>
          <h1 className="text-2xl font-bold">Cubic Bezier / Easing Function Generator</h1>
          <p className="text-gray-500">Create and visualize CSS cubic-bezier easing functions.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-10 xl:gap-20 mt-10">
          <div className="basis-1/3 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="preset">Preset</Label>
              <Select value={preset} onValueChange={handlePresetChange}>
                <SelectTrigger id="preset">
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom</SelectItem>
                  {Object.keys(PRESETS).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="x1">X1: {x1.toFixed(2)}</Label>
              <div className="flex flex-row gap-2 items-center">
                <Slider
                  id="x1"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[x1]}
                  onValueChange={(value) => {
                    setX1(value[0]);
                    setPreset('custom');
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="y1">Y1: {y1.toFixed(2)}</Label>
              <div className="flex flex-row gap-2 items-center">
                <Slider
                  id="y1"
                  min={-1}
                  max={2}
                  step={0.01}
                  value={[y1]}
                  onValueChange={(value) => {
                    setY1(value[0]);
                    setPreset('custom');
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="x2">X2: {x2.toFixed(2)}</Label>
              <div className="flex flex-row gap-2 items-center">
                <Slider
                  id="x2"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[x2]}
                  onValueChange={(value) => {
                    setX2(value[0]);
                    setPreset('custom');
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="y2">Y2: {y2.toFixed(2)}</Label>
              <div className="flex flex-row gap-2 items-center">
                <Slider
                  id="y2"
                  min={-1}
                  max={2}
                  step={0.01}
                  value={[y2]}
                  onValueChange={(value) => {
                    setY2(value[0]);
                    setPreset('custom');
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Label>Bezier Curve Visualization</Label>
              <div ref={containerRef} className="border border-gray-300 rounded-md bg-white p-4">
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Label>Animation Preview</Label>
              <div className="border border-gray-300 rounded-md bg-gray-50 p-8 h-32 relative overflow-hidden">
                <div
                  className="absolute w-16 h-16 bg-blue-500 rounded-md top-1/2 -translate-y-1/2"
                  style={{
                    left: animationPosition === 'end' ? 'calc(100% - 6rem)' : '2rem',
                    transitionProperty: isAnimating ? 'left' : 'none',
                    transitionDuration: isAnimating ? '2s' : '0s',
                    transitionTimingFunction: cubicBezierValue,
                  }}
                />
              </div>
              <Button variant="secondary" onClick={toggleAnimation}>
                {isAnimating ? 'Stop Animation' : 'Start Animation'}
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cubic-bezier-output">Cubic Bezier Value</Label>
                <textarea
                  readOnly
                  value={cubicBezierValue}
                  id="cubic-bezier-output"
                  className="block w-full h-16 font-mono border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleCopy}>
                  Copy Value
                </Button>
                <Button variant="secondary" onClick={handleCopyCSS}>
                  Copy CSS
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

