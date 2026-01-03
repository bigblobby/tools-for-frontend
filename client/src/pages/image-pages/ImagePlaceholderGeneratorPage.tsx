import PlaceholderImageInput from '@/components/PlaceholderImageInput.tsx';

export default function ImagePlaceholderGeneratorPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Image placeholder generator</h1>
          <p className="text-gray-500">Generate placeholder images of any size</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="max-w-sm">
            <div className="flex flex-col gap-3">
              <div>
                <img src={location.origin + "/placeholder/400x400"} alt="" />
              </div>
              <PlaceholderImageInput path="/placeholder/400x400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-sm">
        <h2 className="text-xl">Size</h2>
        <p className="text-gray-500 text-sm">Generate an image of any size, just set the width and height.</p>
        <div className="flex flex-col gap-2 mt-3">
          <PlaceholderImageInput path="/placeholder/400x400" />
          <PlaceholderImageInput path="/placeholder/1200x300" />
        </div>
      </div>

      <div className="max-w-sm">
        <h2 className="text-xl">Color</h2>
        <p className="text-gray-500 text-sm">You can use either CSS color names or HEX (without #)</p>
        <div className="flex flex-col gap-4 mt-5">
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-sm">Change both the background and text color:</p>
            <PlaceholderImageInput path="/placeholder/400x400?color=blue&bgColor=000000" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-sm">Only the background color:</p>
            <PlaceholderImageInput path="/placeholder/400x400?bgColor=pink" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-sm">Only the text color:</p>
            <PlaceholderImageInput path="/placeholder/400x400?color=green" />
          </div>
        </div>
      </div>
    </div>
  );
}