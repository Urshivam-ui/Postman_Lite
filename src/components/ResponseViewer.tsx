import { useState } from 'react';
import { useApiStore } from '../store/useApiStore';
import { Copy, Check, Clock, Database, AlertCircle } from 'lucide-react';

export function ResponseViewer() {
  const { response, loading, error } = useApiStore();
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(
      typeof response.data === 'object'
        ? JSON.stringify(response.data, null, 2)
        : String(response.data)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 flex flex-col items-center justify-center gap-3 text-slate-400 min-h-[250px]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium">Sending Request...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-950/20 border border-rose-900/50 rounded-lg p-6 flex items-start gap-3 text-rose-300">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Request Failed</h4>
          <p className="text-xs font-mono">{error}</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-lg p-8 text-center text-slate-600 text-xs min-h-[200px] flex items-center justify-center">
        Enter a URL and click "Send" to get a response.
      </div>
    );
  }

  const isSuccess = response.status < 400;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden space-y-0">
      // Meta Header Stats Bar 
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
        // Left: Status & Tabs 
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                isSuccess
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {response.status} {response.statusText || (isSuccess ? 'OK' : 'Error')}
            </span>
          </div>

          // Sub Tabs 
          <div className="flex gap-2 border-l border-slate-800 pl-4">
            <button
              onClick={() => setActiveTab('body')}
              className={`text-xs font-semibold pb-0.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'body'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Body
            </button>
            <button
              onClick={() => setActiveTab('headers')}
              className={`text-xs font-semibold pb-0.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'headers'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Headers ({Object.keys(response.headers || {}).length})
            </button>
          </div>
        </div>

        // Right Stats & Copy 
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{response.time ?? 0} ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>{response.size ? (response.size / 1024).toFixed(2) : '0.00'} KB</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      // Tab Content 
      <div className="p-4">
        {activeTab === 'body' ? (
          <pre className="bg-slate-950 border border-slate-800 p-4 rounded-md text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
            <code>
              {typeof response.data === 'object'
                ? JSON.stringify(response.data, null, 2)
                : String(response.data)}
            </code>
          </pre>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-md overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-2">Header Key</th>
                  <th className="px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {Object.entries(response.headers || {}).map(([key, val]) => (
                  <tr key={key} className="hover:bg-slate-900/50">
                    <td className="px-4 py-2 font-semibold text-indigo-300">{key}</td>
                    <td className="px-4 py-2 text-slate-400 break-all">{String(val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default ResponseViewer;