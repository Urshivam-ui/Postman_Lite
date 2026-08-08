import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useApiStore = create()(persist((set, get) => ({
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
    setEnvironmentVar: (key, value) => set((state) => ({
        environments: { ...state.environments, [key]: value },
    })),
    deleteEnvironmentVar: (key) => set((state) => {
        const newEnvs = { ...state.environments };
        delete newEnvs[key];
        return { environments: newEnvs };
    }),
    setMethod: (method) => set((state) => ({ activeRequest: { ...state.activeRequest, method } })),
    setUrl: (url) => set((state) => ({ activeRequest: { ...state.activeRequest, url } })),
    setParams: (params) => set((state) => ({ activeRequest: { ...state.activeRequest, params } })),
    setHeaders: (headers) => set((state) => ({ activeRequest: { ...state.activeRequest, headers } })),
    setBody: (body) => set((state) => ({ activeRequest: { ...state.activeRequest, body } })),
    setActiveResponse: (activeResponse) => set({ activeResponse, response: activeResponse }),
    setResponse: (response) => set({ response, activeResponse: response }),
    setIsLoading: (isLoading) => set({ isLoading, loading: isLoading }),
    setLoading: (loading) => set({ loading, isLoading: loading }),
    setError: (error) => set({ error }),
    addToHistory: (item) => set((state) => ({
        history: [item, ...state.history],
    })),
    loadHistoryItem: (item) => set({ activeRequest: item.request }),
    saveToCollection: (name) => {
        const { collections } = get();
        const newItem = {
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
}), {
    name: 'postman-lite-storage',
}));
export default useApiStore;