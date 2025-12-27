import { useApi } from "@/hooks/use-api";
import { useMutation } from "@tanstack/react-query";

export const useConverterQueries = () => {
  const api = useApi();

  function jsonToXml() {
    return useMutation({
      mutationFn: (json: any) => api.post('/api/converter/json-to-xml', json),
    });
  }

  return {
    jsonToXml,
  }
}