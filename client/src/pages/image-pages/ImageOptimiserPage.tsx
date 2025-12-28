export default function ImageOptimiserPage() {
  return (
    <div className="flex flex-row gap-10">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Image optimiser</h1>
          <p className="text-gray-500">Optimise images</p>
        </div>
        <div className="flex flex-col gap-3">
          <input type="file" />
        </div>
      </div>
    </div>
  );
}