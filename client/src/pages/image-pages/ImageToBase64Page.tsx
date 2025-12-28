export default function ImageToBase64Page() {
  return (
    <div className="flex flex-row gap-10">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Image to Base64</h1>
          <p className="text-gray-500">Convert an image to Base64 string</p>
        </div>
        <div className="flex flex-col gap-3">
          <input type="file" />
          <img src="http://localhost:3001/api/image/placeholder/400x400" alt=""/>
          <img src="https://placehold.co/400x400" alt=""/>
        </div>
      </div>
    </div>
  );
}