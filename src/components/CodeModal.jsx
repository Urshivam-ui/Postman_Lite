import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { useApiStore } from '../store/useApiStore';
import { generateCode } from '../utils/generateCode';
export function CodeModal({ isOpen, onClose }) {
    const [lang, setLang] = useState('curl');
    const [copied, setCopied] = useState(false);
    const { activeRequest } = useApiStore();
    if (!isOpen)
        return null;
    const code = generateCode(activeRequest.method, activeRequest.url, activeRequest.params, activeRequest.headers, activeRequest.body, lang);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h3 className="font-bold text-slate-100 text-sm">Code Snippet</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        // Language Tabs & Copy Button 
        <div className="flex items-center justify-between px-5 py-3 bg-slate-950/50 border-b border-slate-800">
          <div className="flex gap-2">
            {['curl', 'javascript', 'python'].map((item) => (<button key={item} onClick={() => setLang(item)} className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${lang === item
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>
                {item === 'javascript' ? 'JS (Fetch)' : item}
              </button>))}
          </div>

          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md transition-all cursor-pointer">
            {copied ? (<>
                <Check className="w-3.5 h-3.5 text-emerald-400"/>
                <span className="text-emerald-400">Copied!</span>
              </>) : (<>
                <Copy className="w-3.5 h-3.5"/>
                <span>Copy</span>
              </>)}
          </button>
        </div>

        //Code View 
        <div className="p-5">
          <pre className="bg-slate-950 border border-slate-800 p-4 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto max-h-80">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>);
}
export default CodeModal;