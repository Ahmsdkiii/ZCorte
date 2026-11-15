export class ApiError extends Error {
  public readonly status: number;
  public readonly endpoint: string;

  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

export interface HttpRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 8000;

export function getApiBaseUrl(): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  return baseUrl && baseUrl.length > 0 ? baseUrl.replace(/\/+$/, "") : null;
}

export function isApiConfigured(): boolean {
  return getApiBaseUrl() !== null;
}

export async function apiRequest<TResponse>(
  endpoint: string,
  options: HttpRequestOptions = {}
): Promise<TResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not configured.", 503, endpoint);
  }

  const { body, timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...restOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${normalizedEndpoint}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed with status ${response.status}`,
        response.status,
        normalizedEndpoint
      );
    }

    return (await response.json()) as TResponse;
  } finally {
    clearTimeout(timeoutId);
  }
}
