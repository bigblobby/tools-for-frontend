import { Label } from '@/components/ui/label.tsx';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import SEO from '@/components/SEO';

export default function DateTimeEpochUnitPage() {
  const [epoch, setEpoch] = useState(Math.floor(new Date().getTime() / 1000.0));
  const [humanReadable, setHumanReadable] = useState<Date>();

  const handleSetEpoch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEpoch(parseInt(event.target.value));
  };

  const handleConvertToHumanReadable = () => {
    const d = new Date(epoch * 1000);
    const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
      timeStyle: 'full',
    });
    const formatDate = dateTimeFormatter.format(d);
    console.log(formatDate);
    setHumanReadable(d);
  };

  return (
    <>
      <SEO
        title="Epoch/Unix Timestamp Converter - Tools For Frontend"
        description="Convert epoch and Unix timestamps to human-readable dates and times. Free online timestamp converter tool for developers."
        keywords="epoch converter, unix timestamp converter, timestamp converter, epoch to date, unix to date, timestamp to date"
        ogTitle="Epoch/Unix Timestamp Converter - Tools For Frontend"
        ogDescription="Convert epoch and Unix timestamps to human-readable dates and times."
        canonicalUrl="https://toolsforfrontend.com/date-time/epoch-unix"
      />
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-bold">Epoch/Unix Timestamps</h1>
          <p className="text-gray-500">Convert epoch and unix timestamps to human readable dates/times.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="epoch-time">Convert epoch time to human readable</Label>
          <input value={epoch} onChange={handleSetEpoch} id="epoch-time" type="text" className="block w-full h-10 border border-gray-300 rounded-md p-2"/>
          <div>
            <Button variant="secondary" onClick={handleConvertToHumanReadable}>Convert</Button>
          </div>
          <div>
            {humanReadable?.toString()}
          </div>
        </div>
      </div>
    </>
  );
}