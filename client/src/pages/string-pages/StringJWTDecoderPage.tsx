import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label.tsx';

export default function StringJWTDecoderPage() {
  const [jwtToken, setJwtToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');

  const handleJWTTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJwtToken(event.target.value);
  };

  const handleDecodeJWT = () => {
    try {
      if (!jwtToken.trim()) {
        toast.error('Please enter a JWT token');
        return;
      }

      const header = jwtDecode(jwtToken, { header: true });
      const payload = jwtDecode(jwtToken);

      setHeader(JSON.stringify(header, null, 2));
      setPayload(JSON.stringify(payload, null, 2));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to decode JWT token');
      }
    }
  };

  const handleCopyHeader = () => {
    void navigator.clipboard.writeText(header);
    toast.success('Header copied to clipboard', { position: 'top-center' });
  };

  const handleCopyPayload = () => {
    void navigator.clipboard.writeText(payload);
    toast.success('Payload copied to clipboard', { position: 'top-center' });
  };

  const handleClearAll = () => {
    setJwtToken('');
    setHeader('');
    setPayload('');
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold">JWT Decoder</h1>
        <p className="text-gray-500">Decode a JWT token and display the header and payload.</p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="jwt-input">JWT Token</Label>
          <input 
            type="text" 
            id="jwt-input" 
            value={jwtToken} 
            onChange={handleJWTTokenChange} 
            className="block w-full h-10 border border-gray-300 rounded-md p-2"
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleDecodeJWT}>Decode</Button>
            <Button variant="destructive-min" onClick={handleClearAll}>Clear All</Button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="jwt-header">Header <span className="text-xs">(Read Only)</span></Label>
          <textarea 
            readOnly value={header} 
            id="jwt-header"
            className="block w-full h-40 border border-gray-300 rounded-md p-2"
          />
          <div>
            <Button variant="secondary" onClick={handleCopyHeader}>Copy Header</Button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="jwt-payload">Payload <span className="text-xs">(Read Only)</span></Label>
          <textarea 
            rows={20} 
            readOnly 
            value={payload} 
            id="jwt-payload"
            className="block w-full border border-gray-300 rounded-md p-2"
          />
          <div>
            <Button variant="secondary" onClick={handleCopyPayload}>Copy Payload</Button>
          </div>
        </div>
      </div>
    </div>
  );
}