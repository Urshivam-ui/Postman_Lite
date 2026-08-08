import type { ApiRequest, ApiResponse, KeyValuePair } from '../types/api';

// URL aur Params ko combine karne ke liye helper
export const buildFullUrl = (baseUrl: string, params: KeyValuePair[]): string => {
  if (!baseUrl) return '';
  try {
    const formattedUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
    const urlObj = new URL(formattedUrl);
    
    // Clear old search params and append enabled ones
    urlObj.search = '';
    params.forEach(({ key, value, enabled }) => {
      if (enabled && key.trim()) {
        urlObj.searchParams.append(key.trim(), value);
      }
    });
    return urlObj.toString();
  } catch {
    return baseUrl;
  }
};

export const sendApiRequest = async (request: ApiRequest): Promise<ApiResponse> => {
  const startTime = performance.now();
  const finalUrl = buildFullUrl(request.url, request.params);

  // Headers construct karo
  const headersObj: Record<string, string> = {};
  request.headers.forEach(({ key, value, enabled }) => {
    if (enabled && key.trim()) {
      headersObj[key.trim()] = value;
    }
  });

  try {
    const options: RequestInit = {
      method: request.method,
      headers: headersObj,
    };

    if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
      options.body = request.body;
    }

    const response = await fetch(finalUrl, options);
    const endTime = performance.now();

    const responseText = await response.text();
    const sizeBytes = new Blob([responseText]).size;

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = responseText;
    }

    const resHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      resHeaders[key] = val;
    });

    return {
      status: response.status,
      statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
      timeMs: Math.round(endTime - startTime),
      sizeBytes,
      headers: resHeaders,
      data: parsedData,
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      status: 0,
      statusText: 'Network / CORS Error',
      timeMs: Math.round(endTime - startTime),
      sizeBytes: 0,
      headers: {},
      data: null,
      error: err.message || 'Failed to fetch. CORS restrictions may apply.',
    };
  }
};
export default sendApiRequest;