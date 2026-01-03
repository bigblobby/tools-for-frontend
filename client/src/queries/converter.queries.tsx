import { useApi } from '@/hooks/use-api';
import { useMutation } from '@tanstack/react-query';

export const useConverterQueries = () => {
  const api = useApi();

  const jsonToXml = useMutation({
    mutationFn: (json: unknown) => api.post('/api/converter/json-to-xml', json),
  });

  const XmlToJson = useMutation({
    mutationFn: (xml: string) => {
      return api.post('/api/converter/xml-to-json', xml, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    },
  });

  const optimiseImages = useMutation({
    mutationFn: async (formData: FormData) => {
      return await api.post('/api/image/optimise', formData, {
        responseType: 'blob',
      });
    }
  });

  return {
    jsonToXml,
    XmlToJson,
    optimiseImages,
  };
};