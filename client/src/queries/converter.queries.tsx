import { useApi } from "@/hooks/use-api";
import { useMutation } from "@tanstack/react-query";

export const useConverterQueries = () => {
  const api = useApi();

  const jsonToXml = useMutation({
    mutationFn: (json: unknown) => api.post('/api/converter/json-to-xml', json),
  });

  return {
    jsonToXml,
  }
}