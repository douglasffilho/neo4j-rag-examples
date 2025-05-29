import axios, { AxiosInstance, AxiosResponse } from 'axios';

export async function createBearerAuthorizationInstance(
  baseURL: string,
  bearerToken: string
): Promise<AxiosInstance> {
  const instance = axios.create({ baseURL, validateStatus: () => true });

  instance.interceptors.request.use((config) => {
    config.headers.setContentType('application/json');
    config.headers.setAuthorization(`Bearer ${bearerToken}`);
    return config;
  });

  return instance;
}

export function coalesceResponse(data: AxiosResponse) {
  if (data?.data?.error) {
    return {
      error: data.data.error,
      status: data.status ?? 500
    };
  }
  return {
    data: data?.data,
    status: data?.status ?? 200
  };
}
