import type { DisplayFile } from '@/interfaces/file.interface';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { fileListBase64, getFilesize } from '@/utilities/file.utilities.ts';
import { Folder, X } from 'lucide-react';

interface DragAndDropProps {
  fileLimit: number;
  filesizeLimit?: number;
  handleFiles: (files: DisplayFile[]) => void,
  onDropCallback?: () => void,
  text: string;
  helpText: string;
  acceptedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml']
}

export default function DragAndDrop({
  fileLimit,
  filesizeLimit,
  handleFiles,
  onDropCallback,
  text,
  helpText,
  acceptedFileTypes
}: DragAndDropProps) {
  const [dragging, setDragging] = useState(false);
  const [images, setImages] = useState<DisplayFile[]>([]);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dragging) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Drag leave?');

    if (dragging) {
      setDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files: File[] = Array.from(e.dataTransfer.files);
    await handleSetFiles(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // This is needed - do not remove
    e.preventDefault();
    e.stopPropagation();
  };

  const handleManualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    await handleSetFiles(files);
    e.target.value = '';
  };

  const handleSetFiles = async (files: File[]) => {
    const allowedFiles = files.filter(file => (acceptedFileTypes as string[]).includes(file.type));
    const displayFiles = await fileListBase64(allowedFiles);
    const allDisplayFiles = [...displayFiles, ...images];

    if (filesizeLimit) {
      const acceptedFiles = files.filter(file => {
        return file.size <= filesizeLimit;
      });

      if (acceptedFiles.length < files.length && files.length === 1) {
        toast.error(`Your file is too large. Max: ${getFilesize(filesizeLimit)}.`);
        return;
      } else if (acceptedFiles.length < files.length) {
        toast.error(`Some of your files were too large. Max: ${getFilesize(filesizeLimit)}.`);
        return;
      }

      if (images.length + acceptedFiles.length > fileLimit) {
        toast.error(`You can only upload ${fileLimit} image(s) at a time.`);
        return;
      }
    }

    if (files.length !== allowedFiles.length && allowedFiles.length === 0) {
      toast.error('Sorry! These files can\'t be accepted as they\'re the wrong type.');
      return;
    } else if (files.length !== allowedFiles.length) {
      toast.error('Sorry! Some of your files can\'t be accepted as they\'re the wrong type.');
      return;
    } else {
      if (onDropCallback) {
        onDropCallback();
      }
    }

    setImages(allDisplayFiles);
    setDragging(false);
    handleFiles(allDisplayFiles);
  };

  const removeImage = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    e.stopPropagation();

    setImages(images => {
      const updatedImages = images.filter(image => image.id !== id);
      handleFiles(updatedImages);
      return updatedImages;
    });
  };

  const openFolder = () => {
    if (!fileUploadRef) return;
    fileUploadRef.current?.click();
  };

  const getImageStyles = () => {
    if (fileLimit === 1) {
      return {
        flexBasis: '100%',
        height: '100%'
      };
    } else {
      return {
        flexBasis: '33.33333%',
        height: '25%'
      };
    }
  };

  return (
    <div className="drag-and-drop">
      <input
        className="hidden"
        ref={fileUploadRef}
        type="file"
        accept={acceptedFileTypes.join(', ')}
        multiple
        onChange={handleManualUpload}
      />
      <div
        className="relative bg-gray-50 h-96 cursor-pointer rounded-md border-dashed border-2"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={openFolder}
      >
        {
          images.length === 0 && (
            <div
              className="absolute w-full top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 px-2 text-gray-500 text-center pointer-events-none">
              <span>
                <Folder/>
              </span>
              <h3>{text}</h3>
              <h4 className="text-xs">{helpText}</h4>
            </div>
          )
        }

        <div
          className={'absolute top-0 left-0 z-[1] h-full w-full pointer-events-none transition-all ' + (dragging ? 'bg-black/10' : ' ')}></div>
        <div className="flex flex-wrap content-baseline h-full p-2 rounded">
          {
            images.length > 0 && images.map(file => {
              return (
                <div key={file.id} className="relative p-2 cursor-pointer group" style={getImageStyles()}
                     onClick={(e) => removeImage(e, file.id)}>
                  <div
                    className="absolute z-[1] top-1 bottom-1 left-1 right-1 flex justify-center items-center bg-white/70 rounded opacity-0 transition-all group-hover:opacity-100">
                    <p className="flex flex-col justify-center items-center text-xl text-black mb-0 mt-4">
                      <span><X/></span>
                      <span>(Remove)</span>
                    </p>
                  </div>
                  <div
                    className="relative bg-center bg-cover h-full rounded"
                    style={{ backgroundImage: `url(${file.displayImage})` }}
                  >
                    <div
                      className="absolute left-1 bottom-1 bg-white text-xs px-1 rounded">{getFilesize(file.uploadImage.size)}</div>
                    <div
                      className="absolute left-1 right-auto top-1 bottom-auto bg-white text-xs px-1 rounded">{file.width} x {file.height}</div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}