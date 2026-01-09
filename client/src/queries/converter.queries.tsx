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

  const jsonToCsv = useMutation({
    mutationFn: (json: unknown) => api.post('/api/converter/json-to-csv', json),
  });

  const csvToJson = useMutation({
    mutationFn: (csv: string) => {
      return api.post('/api/converter/csv-to-json', csv, {
        headers: {
          'Content-Type': 'text/csv',
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

  const createIco = useMutation({
    mutationFn: async (formData: FormData) => {
      return await api.post('/api/image/create-ico', formData, {
        responseType: 'blob',
      });
    }
  });

  return {
    jsonToXml,
    XmlToJson,
    jsonToCsv,
    csvToJson,
    optimiseImages,
    createIco
  };
};