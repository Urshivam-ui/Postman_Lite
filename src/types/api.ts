// 1. HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// 2. Dynamic Key-Value Pairs (Params aur Headers ke liye)
export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

// 3. Main Request Structure
export interface ApiRequest {
  id: string;
  name?: string;
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: string;
}

// 4. Server Response Structure
export interface ApiResponse {
  status: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number;
  headers: Record<string, string>;
  data: any;
  error?: string;
}

// 5. History Log Item
export interface HistoryItem {
  id: string;
  timestamp: number;
  request: ApiRequest;
  responseStatus?: number;
}