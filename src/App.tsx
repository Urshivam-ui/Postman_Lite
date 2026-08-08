import { useState } from 'react';
import { History, Sparkles, Code2, Code, Bookmark, Trash2, Plus, Sliders } from 'lucide-react';
import { useApiStore } from './store/useApiStore';
import { KeyValueEditor } from './components/KeyValueEditor';
import { ResponseViewer } from './components/ResponseViewer';
import { CodeModal } from './components/CodeModal';
import { EnvModal } from './components/EnvModal';
import { METHOD_COLORS } from './utils/methodColors';
import { buildFullUrl } from './utils/httpClient';
import { RequestBar } from './components/RequestBar';

const DEMO_PRESETS = [
  {
    name: 'GET Post Details',
    method: 'GET' as const,
    url: '{{baseUrl}}/posts/1',
    params: [{ id: '1', key: 'userId', value: '1', enabled: false }],
    headers: [{ id: '1', key: 'Accept', value: 'application/json', enabled: true }],
    body: '',
  },
  {
    name: 'GET Users List',
    method: 'GET' as const,
    url: 'https://reqres.in/api/users',
    params: [{ id: '1', key: 'page', value: '1', enabled: true }],
    headers: [{ id: '1', key: 'Accept', value: 'application/json', enabled: true }],
    body: '',
  },
  {
    name: 'POST Add Product',
    method: 'POST' as const,
    url: 'https://dummyjson.com/products/add',
    params: [],
    headers: [{ id: '1', key: 'Content-Type', value: 'application/json', enabled: true }],
    body: '{\n  "title": "Perfume Oil",\n  "price": 120,\n  "category": "fragrances"\n}',
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);

  const {
    activeRequest,
    setParams,
    setHeaders,
    setBody,
    history,
    collections,
    saveToCollection,
    deleteFromCollection,
    loadHistoryItem,
    setUrl,
    setMethod,
  } = useApiStore();

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(activeRequest.body);
      setBody(JSON.stringify(parsed, null, 2));
    } catch {}
  };

  const handleLoadPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    setMethod(preset.method);
    setUrl(preset.url);
    setParams(preset.params);
    setHeaders(preset.headers);
    setBody(preset.body);
  };

  const handleSaveCollection = () => {
    const name = prompt('Enter a name for this saved request:', 'My API Request');
    if (name) {
      saveToCollection(name);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      // Top Header 
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Code2 className="w-6 h-6 text-indigo-400" />
          <h1 className="font-bold text-lg tracking-tight text-slate-100">
            Postman Lite
          </h1>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
            v1.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          // Environment Variables Button 
          <button
            onClick={() => setIsEnvModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md border border-slate-700 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Variables</span>
          </button>

          // Code Snippet Button 
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium rounded-md border border-indigo-500/30 transition-colors cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>

          // GitHub Button 
          <a
            href="https://github.com/Urshivam-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md border border-slate-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current text-slate-300" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      // Main Layout 
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        // Sidebar 
        <aside className="w-full md:w-80 border-r border-slate-800 bg-slate-900/30 p-4 flex flex-col gap-6 overflow-y-auto">
          // Saved Collections
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <span className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-400" />
                Saved ({collections.length})
              </span>
              <button
                onClick={handleSaveCollection}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Save Current
              </button>
            </div>

            {collections.length === 0 ? (
              <div className="text-center py-4 text-slate-600 text-xs border border-dashed border-slate-800/80 rounded-md">
                No saved requests.
              </div>
            ) : (
              <div className="space-y-1.5">
                {collections.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between p-2 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all"
                  >
                    <button
                      onClick={() => {
                        setMethod(item.method);
                        setUrl(item.url);
                        setParams(item.params);
                        setHeaders(item.headers);
                        setBody(item.body);
                      }}
                      className="flex-1 text-left truncate cursor-pointer mr-2"
                    >
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        {item.method} - {item.url}
                      </div>
                    </button>
                    <button
                      onClick={() => deleteFromCollection(item.id)}
                      className="text-slate-600 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          // Demo Presets 
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Demo Presets
            </div>
            <div className="space-y-1.5">
              {DEMO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadPreset(preset)}
                  className="w-full text-left p-2 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group transition-all cursor-pointer"
                >
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white truncate">
                    {preset.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      METHOD_COLORS[preset.method].text
                    } ${METHOD_COLORS[preset.method].bg}`}
                  >
                    {preset.method}
                  </span>
                </button>
              ))}
            </div>
          </div>

          // History 
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <span className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                History ({history.length})
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 text-slate-600 text-xs border border-dashed border-slate-800/80 rounded-md">
                No recent requests.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 md:max-h-none overflow-y-auto">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="w-full text-left p-2.5 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 flex flex-col gap-1 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          METHOD_COLORS[item.request.method as keyof typeof METHOD_COLORS]?.text || ''
                        } ${
                          METHOD_COLORS[item.request.method as keyof typeof METHOD_COLORS]?.bg || ''
                        }`}
                      >
                        {item.request.method}
                      </span>
                      {item.responseStatus && (
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            item.responseStatus < 400
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {item.responseStatus}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-300 font-mono truncate">
                      {buildFullUrl(item.request.url, item.request.params)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        // Main Work Area 
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
          <RequestBar />

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
            <div className="flex border-b border-slate-800 gap-4">
              <button
                onClick={() => setActiveTab('params')}
                className={`pb-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'params'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Params ({activeRequest.params.length})
              </button>
              <button
                onClick={() => setActiveTab('headers')}
                className={`pb-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'headers'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Headers ({activeRequest.headers.length})
              </button>
              {['POST', 'PUT', 'PATCH'].includes(activeRequest.method) && (
                <button
                  onClick={() => setActiveTab('body')}
                  className={`pb-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'body'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Body (JSON)
                </button>
              )}
            </div>

            {activeTab === 'params' && (
              <KeyValueEditor
                title="URL Query Parameters"
                items={activeRequest.params}
                onChange={setParams}
              />
            )}

            {activeTab === 'headers' && (
              <KeyValueEditor
                title="HTTP Request Headers"
                items={activeRequest.headers}
                onChange={setHeaders}
              />
            )}

            {activeTab === 'body' &&
              ['POST', 'PUT', 'PATCH'].includes(activeRequest.method) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      JSON Payload
                    </span>
                    <button
                      onClick={handleFormatJson}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                    >
                      Format JSON
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={activeRequest.body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{\n  "key": "value"\n}'
                    className="w-full bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs p-3 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
          </div>

          <ResponseViewer />
        </main>
      </div>

      // Modals Render
      <CodeModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />
      <EnvModal isOpen={isEnvModalOpen} onClose={() => setIsEnvModalOpen(false)} />
    </div>
  );
}

export default App;