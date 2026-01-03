import DragAndDrop from '@/components/DragAndDrop.tsx';
import { Button } from '@/components/ui/button.tsx';
import type { DisplayFile } from '@/interfaces/file.interface.ts';
import { useState } from 'react';

const MAX_FILESIZE = 1000000;

export default function ImageOptimiserPage() {
  const [currentFiles, setCurrentFiles] = useState<DisplayFile[]>([]);
  
  const handleFiles = (files: DisplayFile[]) => {
    if (files.length > 0) {
      setCurrentFiles(files);
    } else {
      setCurrentFiles([]);
    }
  };
  
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
              
            </div>
            <div className="space-x-3">
              <Button variant="secondary">Optimise</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}