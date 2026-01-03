import DragAndDrop from '@/components/DragAndDrop.tsx';
import type { DisplayFile } from '@/interfaces/file.interface.ts';

const MAX_FILESIZE = 1000000;

export default function ImageToBase64Page() {
  
  const handleFiles = (files: DisplayFile[]) => {
    console.log(files);
  };
  
  return (
    <div className="flex flex-row gap-10">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Image to Base64</h1>
          <p className="text-gray-500">Convert an image to Base64 string</p>
        </div>
        <div className="flex flex-col gap-3">
          <DragAndDrop
            fileLimit={1}
            filesizeLimit={MAX_FILESIZE}
            handleFiles={handleFiles}
            text={"Drag and drop your image or click here"}
            helpText={"(1 image only)"}
            acceptedFileTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
          />
        </div>
      </div>
    </div>
  );
}