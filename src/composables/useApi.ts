import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface UseApiOptions {
  method?: HttpMethod;
  body?: Record<string, any> | FormData;
  headers?: HeadersInit;
  queryParams?: Record<string, string | number | boolean>;
}

/** Sirve para hacer llamadas a la API no es necesario pasar Body como JSON.stringify */
export const useApi = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const apiFetch = async <TResponse = unknown>(
    endpoint: string,
    options: UseApiOptions = {}
  ): Promise<TResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const { method = "GET", body, headers = {}, queryParams } = options;

      let url = API_URL + endpoint;

      if (queryParams) {
        const query = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          query.append(key, String(value));
        });
        url += `?${query.toString()}`;
      }

      const fetchOptions: RequestInit = {
        method,
        headers:
          body instanceof FormData
            ? headers
            : { "Content-Type": "application/json", ...headers },
        body: body
          ? body instanceof FormData
            ? body
            : JSON.stringify(body)
          : undefined,
        credentials: "include",
      };

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorBody = await response.text();
        if (response.status === 401) {
          useAuthStore().logout();
        }
        throw new Error(
          `Error ${response.status}: ${response.statusText}\n${errorBody}`
        );
      }

      // Detecta el tipo de respuesta
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        return (await response.json()) as TResponse;
      } else if (
        contentType.includes("application/octet-stream") ||
        contentType.includes("application/pdf") ||
        contentType.includes("application/vnd") // excel, word, etc.
      ) {
        return (await response.blob()) as TResponse;
      } else {
        // fallback a texto (por ejemplo res.send("ok"))
        return (await response.text()) as TResponse;
      }
    } catch (err: any) {
      error.value = err.message || "Error desconocido";
      return null as TResponse;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, apiFetch };
};
