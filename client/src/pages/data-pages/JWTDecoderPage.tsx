import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label.tsx';
import SEO from '@/components/SEO';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';

export default function JWTDecoderPage() {
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
    toast.success('Header copied to clipboard');
  };

  const handleCopyPayload = () => {
    void navigator.clipboard.writeText(payload);
    toast.success('Payload copied to clipboard');
  };

  const handleClearAll = () => {
    setJwtToken('');
    setHeader('');
    setPayload('');
  };

  return (
    <>
      <SEO
        title="JWT Decoder - Decode JWT Tokens - Tools For Frontend"
        description="Decode JWT (JSON Web Token) tokens and view the header and payload data. Free online JWT decoder tool for developers."
        keywords="jwt decoder, jwt token decoder, decode jwt, json web token decoder, jwt header, jwt payload"
        ogTitle="JWT Decoder - Tools For Frontend"
        ogDescription="Decode JWT tokens and view the header and payload data."
        canonicalUrl="https://toolsforfrontend.com/string/jwt-decoder"
      />
      <div className="flex flex-col gap-10 max-w-8xl">
        <div>
          <h1 className="text-2xl font-bold">JWT Decoder</h1>
          <p className="text-muted-foreground">Decode a JWT token and display the header and payload data.</p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor="jwt-input">JWT Token</Label>
            <Input
              type="text"
              id="jwt-input"
              value={jwtToken}
              onChange={handleJWTTokenChange}
              className="h-10 font-mono"
            />
            <div className="flex gap-3">
              <Button onClick={handleDecodeJWT}>Decode</Button>
              <Button variant="destructive-min" onClick={handleClearAll}>Clear All</Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="jwt-header">Header <span className="text-xs">(Read Only)</span></Label>
            <Textarea
              readOnly
              value={header}
              id="jwt-header"
              className="h-40 font-mono"
            />
            <div>
              <Button onClick={handleCopyHeader}>Copy Header</Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="jwt-payload">Payload <span className="text-xs">(Read Only)</span></Label>
            <Textarea
              rows={20}
              readOnly
              value={payload}
              id="jwt-payload"
              className="h-40 font-mono"
            />
            <div>
              <Button onClick={handleCopyPayload}>Copy Payload</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}