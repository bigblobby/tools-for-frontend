import PlaceholderImageInput from '@/components/PlaceholderImageInput.tsx';
import SEO from '@/components/SEO';

export default function ImagePlaceholderGeneratorPage() {
  return (
    <>
      <SEO
        title="Placeholder Image Generator - Tools For Frontend"
        description="Generate placeholder images of any size instantly. Free online placeholder image generator for developers and designers."
        keywords="placeholder image, image placeholder generator, placeholder generator, dummy image, placeholder image url"
        ogTitle="Placeholder Image Generator - Tools For Frontend"
        ogDescription="Generate placeholder images of any size instantly."
        canonicalUrl="https://toolsforfrontend.com/image/placeholder"
      />
      <div className="flex flex-col gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Image placeholder generator</h1>
            <p className="text-gray-500">Generate placeholder images of any size.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="max-w-sm">
              <div className="flex flex-col gap-3">
                <div>
                  <img src={location.origin + '/p/400x400'} alt=""/>
                </div>
                <PlaceholderImageInput path="/p/400x400"/>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-sm border rounded-md p-4">
          <h2 className="text-xl font-bold">Size</h2>
          <p className="text-gray-500 text-sm">Generate an image of any size, just set the width and height.</p>
          <div className="flex flex-col gap-2 mt-3">
            <PlaceholderImageInput path="/p/400x400"/>
            <PlaceholderImageInput path="/p/1200x300"/>
          </div>
        </div>

        <div className="max-w-sm border rounded-md p-4">
          <h2 className="text-xl font-bold">Color</h2>
          <p className="text-gray-500 text-sm">You can use either CSS color names or HEX (without #)</p>
          <div className="flex flex-col gap-4 mt-5">
            <div className="flex flex-col gap-2">
              <p className="text-gray-500 text-sm">Change both the background and text color:</p>
              <PlaceholderImageInput path="/p/400x400?color=blue&bgColor=000000"/>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-500 text-sm">Only the background color:</p>
              <PlaceholderImageInput path="/p/400x400?bgColor=pink"/>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-500 text-sm">Only the text color:</p>
              <PlaceholderImageInput path="/p/400x400?color=green"/>
            </div>
          </div>
        </div>

        <div className="max-w-sm border rounded-md p-4">
          <h2 className="text-xl font-bold">Text</h2>
          <p className="text-gray-500 text-sm">Change the text that is displayed on the image.</p>
          <div className="flex flex-col gap-4 mt-5">
            <div className="flex flex-col gap-2">
              <PlaceholderImageInput path="/p/400x400?text=Hello"/>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-500 text-sm">Add spaces using <code>+</code>:</p>
              <PlaceholderImageInput path="/p/400x400?text=Hello+world"/>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-500 text-sm">Add new lines using <code>\n</code>:</p>
              <PlaceholderImageInput path="/p/400x400?text=Hello\nworld"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}