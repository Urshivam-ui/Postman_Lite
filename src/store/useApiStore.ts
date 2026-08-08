import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KeyValue {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface SavedCollectionItem {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  params: KeyValue[];
  headers: KeyValue[];
  body: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  request: any;
  responseStatus: number;
}

export interface ActiveRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  params: KeyValue[];
  headers: KeyValue[];
  body: string;
}

interface ApiStore {
  activeRequest: ActiveRequest;
  history: HistoryItem[];
  collections: SavedCollectionItem[];
  
  // Response & Loading States
  activeResponse: any;
  response: any;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  
  // Environment State
  environments: Record<string, string>;
  setEnvironmentVar: (key: string, value: string) => void;
  deleteEnvironmentVar: (key: string) => void;

  // Request Form Actions
  setMethod: (method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') => void;
  setUrl: (url: string) => void;
  setParams: (params: KeyValue[]) => void;
  setHeaders: (headers: KeyValue[]) => void;
  setBody: (body: string) => void;
  
  // Dispatch Actions
  setActiveResponse: (response: any) => void;
  setResponse: (response: any) => void;
  setIsLoading: (loading: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Log & Collection Actions
  addToHistory: (item: HistoryItem) => void;
  loadHistoryItem: (item: any) => void;
  saveToCollection: (name: string) => void;
  deleteFromCollection: (id: string) => void;
}

export const useApiStore = create<ApiStore>()(
  persist(
    (set, get) => ({
      activeRequest: {
        // Strictly typed string ID to fix red line error
        id: String(Date.now()),
        method: 'GET',
        url: '{{baseUrl}}/posts/1',
        params: [],
        headers: [{ id: '1', key: 'Accept', value: 'application/json', enabled: true }],
        body: '',
      },
      history: [],
      collections: [],
      
      activeResponse: null,
      response: null,
      isLoading: false,
      loading: false,
      error: null,

      environments: {
        baseUrl: 'https://jsonplaceholder.typicode.com',
      },

      setEnvironmentVar: (key, value) =>
        set((state) => ({
          environments: { ...state.environments, [key]: value },
        })),

      deleteEnvironmentVar: (key) =>
        set((state) => {
          const newEnvs = { ...state.environments };
          delete newEnvs[key];
          return { environments: newEnvs };
        }),

      setMethod: (method) =>
        set((state) => ({ activeRequest: { ...state.activeRequest, method } })),
      setUrl: (url) =>
        set((state) => ({ activeRequest: { ...state.activeRequest, url } })),
      setParams: (params) =>
        set((state) => ({ activeRequest: { ...state.activeRequest, params } })),
      setHeaders: (headers) =>
        set((state) => ({ activeRequest: { ...state.activeRequest, headers } })),
      setBody: (body) =>
        set((state) => ({ activeRequest: { ...state.activeRequest, body } })),

      setActiveResponse: (activeResponse) => set({ activeResponse, response: activeResponse }),
      setResponse: (response) => set({ response, activeResponse: response }),
      setIsLoading: (isLoading) => set({ isLoading, loading: isLoading }),
      setLoading: (loading) => set({ loading, isLoading: loading }),
      setError: (error) => set({ error }),

      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history],
        })),

      loadHistoryItem: (item) =>
        set({ activeRequest: item.request }),

      saveToCollection: (name) => {
        const { collections } = get();
        const newItem: SavedCollectionItem = {
          id: String(Date.now()),
          name: name.trim() || 'Untitled Request',
          method: 'GET',
          url: '',
          params: [],
          headers: [],
          body: ''
        };
        set({ collections: [newItem, ...collections] });
      },

      deleteFromCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((item) => item.id !== id),
        }));
      },
    }),
    {
      name: 'postman-lite-storage',
    }
  )
);
export default useApiStore;