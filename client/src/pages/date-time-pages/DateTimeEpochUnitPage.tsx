import { Label } from '@/components/ui/label.tsx';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import SEO from '@/components/SEO';

export default function DateTimeEpochUnitPage() {
  const [epoch, setEpoch] = useState(Math.floor(new Date().getTime() / 1000.0));
  const [humanReadable, setHumanReadable] = useState<Date>();

  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [hour, setHour] = useState(new Date().getHours().toString());
  const [minute, setMinute] = useState(new Date().getMinutes().toString());
  const [second, setSecond] = useState(new Date().getSeconds().toString());
  const [epochFromDateTime, setEpochFromDateTime] = useState<number>();

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

  const handleConvertToEpoch = () => {
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // Month is 0-indexed in JavaScript Date
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );

    if (isNaN(date.getTime())) {
      return; // Invalid date
    }

    setEpochFromDateTime(Math.floor(date.getTime() / 1000));
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
      <div className="flex flex-col gap-10 max-w-8xl">
        <div>
          <h1 className="text-2xl font-bold">Epoch/Unix Timestamps</h1>
          <p className="text-gray-500">Convert epoch and unix timestamps to human readable dates/times.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="epoch-time">Convert epoch time to human readable</Label>
          <input value={epoch} onChange={handleSetEpoch} id="epoch-time" type="text" className="block w-full h-10 max-w-lg border border-gray-300 rounded-md p-2" />
          <div>
            <Button onClick={handleConvertToHumanReadable}>Convert to Date</Button>
          </div>
          <div>
            {humanReadable?.toString()}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>Convert date/time to epoch</Label>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-lg">
            <div className="flex flex-col gap-2">
              <Label htmlFor="year">Year</Label>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                id="year"
                type="number"
                className="block w-full h-10 border border-gray-300 rounded-md p-2"
                placeholder="2024"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="month">Month</Label>
              <input
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                id="month"
                type="number"
                className="block w-full h-10 border border-gray-300 rounded-md p-2"
                placeholder="1-12"
                min="1"
                max="12"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="day">Day</Label>
              <input
                value={day}
                onChange={(e) => setDay(e.target.value)}
                id="day"
                type="number"
                className="block w-full h-10 border border-gray-300 rounded-md p-2"
                placeholder="1-31"
                min="1"
                max="31"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hour">Hour</Label>
              <input
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                id="hour"
                type="number"
                className="block w-full h-10 border border-gray-300 rounded-md p-2"
                placeholder="0-23"
                min="0"
                max="23"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="minute">Minute</Label>
              <input
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                id="minute"
                type="number"
                className="block w-full h-10 border border-gray-300 rounded-md p-2"
                placeholder="0-59"
                min="0"
                max="59"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="second">Second</Label>
              <input
                value={second}
                onChange={(e) => setSecond(e.target.value)}
                id="second"
                type="number"
                className="block w-full h-10 border border-gray-300 rounded-md p-2"
                placeholder="0-59"
                min="0"
                max="59"
              />
            </div>
          </div>
          <div>
            <Button onClick={handleConvertToEpoch}>Convert to Epoch</Button>
          </div>
          <div>
            {epochFromDateTime !== undefined && (
              <div className="text-lg">
                {epochFromDateTime}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}