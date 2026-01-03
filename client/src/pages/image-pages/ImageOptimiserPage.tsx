import DragAndDrop from '@/components/DragAndDrop.tsx';
import { Button } from '@/components/ui/button.tsx';
import type { DisplayFile } from '@/interfaces/file.interface.ts';
import { useState } from 'react';
import { useConverterQueries } from '@/queries/converter.queries.tsx';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';

const MAX_FILESIZE = 5 * 1024 * 1024;

export default function ImageOptimiserPage() {
  const [currentFiles, setCurrentFiles] = useState<DisplayFile[]>([]);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [quality, setQuality] = useState('80');
  const converterQueries = useConverterQueries();
  const optimiseImages = converterQueries.optimiseImages;

  const handleFiles = (files: DisplayFile[]) => {
    if (files.length > 0) {
      setCurrentFiles(files);
    } else {
      setCurrentFiles([]);
    }
  };

  const handleOptimise = () => {
    const formData = new FormData();

    for (const file of currentFiles) {
      formData.append('images', file.uploadImage);
    }

    formData.append('width', width);
    formData.append('height', height);
    formData.append('quality', quality);
    // formData.append('fitment', this.state.fitment);
    // formData.append('position', this.state.position);
    // formData.append('output', this.state.output);

    optimiseImages.mutate(formData, {
      onSuccess: async (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'optimized-images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Images optimized and downloaded!', { position: 'top-center' });
      },
      onError: (error: Error) => {
        console.log(error);
        toast.error('Failed to optimize images', { position: 'top-center' });
      },
    })
  }

  return (
    <div className="flex flex-row gap-10">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Image optimiser</h1>
          <p className="text-gray-500">Optimise images</p>
        </div>
        <div className="flex h-[600px]">
          <div className="basis-1/2 max-w-1/2">
            <DragAndDrop
              fileLimit={12}
              filesizeLimit={MAX_FILESIZE}
              handleFiles={handleFiles}
              text={"Drag and drop your image or click here"}
              helpText={"(Up to 12 images)"}
              acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
            />
          </div>
          <div className="basis-1/2 max-w-1/2 flex flex-col gap-4 pl-4">
            <div className="flex-grow-1 h-full">
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="basis-1/2 space-y-2">
                    <Label htmlFor="width">Width</Label>
                    <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Leave empty for auto sizing" />
                  </div>
                  <div className="basis-1/2 space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Leave empty for auto sizing" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Input id="quality" type="number" value={quality} onChange={(e) => setQuality(e.target.value)} placeholder="Between 1 and 100" />
                </div>
              </div>
            </div>
            <div className="space-x-3">
              <Button variant="secondary" onClick={handleOptimise}>Optimise</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}