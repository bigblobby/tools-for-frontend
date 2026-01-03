import axios, { type AxiosRequestConfig } from "axios";

export const useApi = () => {
  return {
    get: async (url: string) => {
      const response = await axios.get(url);
      return response.data;
    },
    post: async (url: string, data: unknown, config?: AxiosRequestConfig) => {
      const response = await axios.post(url, data, config);
      return response.data;
    },
    put: async (url: string, data: unknown) => {
      const response = await axios.put(url, data);
      return response.data;
    },
    delete: async (url: string) => {
      const response = await axios.delete(url);
      return response.data;
    },
  }
}