import type { DisplayFile } from '@/interfaces/file.interface.ts';

export function getFilesize(filesize: number) {
  if (filesize < 1000000) {
    return ((filesize / 1000).toFixed(2)) + 'KB';
  } else {
    return ((filesize / 1000000).toFixed(2)) + 'MB';
  }
}

export function fileListBase64(fileList: File[]): Promise<DisplayFile[]> {
  function getBase64(file: File): Promise<DisplayFile> {
    const reader = new FileReader();

    return new Promise(resolve => {
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e) => {
        const image = new Image();

        if (typeof e.target?.result === 'string') {
          image.src = e.target.result;
        }

        image.addEventListener('load', (loadImageEvent) => {
          const path = loadImageEvent.composedPath && loadImageEvent.composedPath();
          const image = path[0] as HTMLImageElement;

          const newFile: DisplayFile = {
            id: Math.random(),
            displayImage: e.target?.result as string,
            uploadImage: file,
            width: image.width,
            height: image.height
          };

          resolve(newFile);
        });
      });
    });
  }

  const promises: Promise<DisplayFile>[] = [];

  for (let i = 0; i < fileList.length; i++) {
    promises.push(getBase64(fileList[i]));
  }

  return Promise.all(promises);
}