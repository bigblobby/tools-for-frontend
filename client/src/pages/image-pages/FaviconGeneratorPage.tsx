import DragAndDrop from '@/components/DragAndDrop.tsx';
import type { DisplayFile } from '@/interfaces/file.interface.ts';
import { useState } from 'react';
import { useConverterQueries } from '@/queries/converter.queries.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea.tsx';
import SEO from '@/components/SEO';

const MAX_FILESIZE = 1024 * 1024;

export default function FaviconGeneratorPage() {
  const [currentFiles, setCurrentFiles] = useState<DisplayFile[]>([]);
  const converterQueries = useConverterQueries();
  const createIco = converterQueries.createIco;

  const html = '<link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">\n' +
    '<link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">\n' +
    '<link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">\n' +
    '<link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">\n' +
    '<link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">\n' +
    '<link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">\n' +
    '<link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">\n' +
    '<link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">\n' +
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">\n' +
    '<link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">\n' +
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n' +
    '<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">\n' +
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n' +
    '<link rel="manifest" href="/manifest.json">\n' +
    '<meta name="msapplication-TileColor" content="#ffffff">\n' +
    '<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">\n' +
    '<meta name="theme-color" content="#ffffff">';

  const handleFiles = (files: DisplayFile[]) => {
    if (files.length > 0) {
      setCurrentFiles(files);
    } else {
      setCurrentFiles([]);
    }
  };

  const handleGenerate = () => {
    const formData = new FormData();

    for (const file of currentFiles) {
      formData.append('images', file.uploadImage);
    }

    createIco.mutate(formData, {
      onSuccess: async (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ico.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('ICO images generated and downloaded!', { position: 'top-center' });
      },
      onError: (error: Error) => {
        console.log(error);
        toast.error('Failed to generate ICO images', { position: 'top-center' });
      },
    });
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(html);
    toast.success('Copied to clipboard', { position: 'top-center' });
  };

  return (
    <>
      <SEO
        title="Favicon Generator - Create Favicon Icons - Tools For Frontend"
        description="Generate favicon icons in multiple sizes for your website. Free online favicon generator tool that creates ICO files and HTML code."
        keywords="favicon generator, favicon maker, ico generator, favicon creator, website icon generator, favicon html"
        ogTitle="Favicon Generator - Tools For Frontend"
        ogDescription="Generate favicon icons in multiple sizes for your website."
        canonicalUrl="https://toolsforfrontend.com/image/favicon-generator"
      />
      <div className="flex flex-row gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Favicon Generator</h1>
            <p className="text-gray-500">Favicons are used to create icons that display next to the address bar.</p>
          </div>
          <div className="flex h-[200px]">
            <div className="basis-full flex flex-col gap-3 md:basis-1/2 md:max-w-48">
              <DragAndDrop
                fileLimit={1}
                filesizeLimit={MAX_FILESIZE}
                handleFiles={handleFiles}
                text={'Drag and drop your image or click here'}
                acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
              />
              <div>
                <Button onClick={handleGenerate}>Generate</Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl">Next steps</h2>
            <div>
              <ol className="list-decimal list-inside text-gray-500">
                <li>Paste the generated files into the relevant directory of your site. This might be at the root, <code>/assets</code> or <code>/public</code>.
                </li>
                <li>Paste the following into the <code>&lt;head&gt;</code> of your HTML document.</li>
              </ol>
            </div>
            <Textarea className="font-mono" readOnly defaultValue={html}/>
            <div>
              <Button onClick={handleCopy}>Copy</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}