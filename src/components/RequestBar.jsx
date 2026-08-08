import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useApiStore } from '../store/useApiStore';
import { METHOD_COLORS } from '../utils/methodColors';
import { sendApiRequest } from '../utils/httpClient';
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
export const RequestBar = () => {
    const { activeRequest, setMethod, setUrl, isLoading, setIsLoading, setActiveResponse, addToHistory, } = useApiStore();
    const handleSend = async () => {
        if (!activeRequest.url.trim())
            return;
        setIsLoading(true);
        const response = await sendApiRequest(activeRequest);
        setActiveResponse(response);
        setIsLoading(false);
        // Save to history log
        addToHistory({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            request: { ...activeRequest },
            responseStatus: response.status,
        });
    };
    return (<div className="flex flex-col sm:flex-row gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800 shadow-md">
      // HTTP Method Selector 
      <select value={activeRequest.method} onChange={(e) => setMethod(e.target.value)} className={`px-3 py-2 text-sm font-bold rounded-md bg-slate-800 border cursor-pointer focus:outline-none transition-colors ${METHOD_COLORS[activeRequest.method].text} ${METHOD_COLORS[activeRequest.method].border}`}>
        {HTTP_METHODS.map((method) => (<option key={method} value={method} className="bg-slate-900 text-slate-200">
            {method}
          </option>))}
      </select>

      // URL Input 
      <input type="text" value={activeRequest.url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="https://api.example.com/v1/resource" className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono"/>

      // Send Button 
      <button onClick={handleSend} disabled={isLoading || !activeRequest.url.trim()} className="flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
        {isLoading ? (<>
            <Loader2 className="w-4 h-4 animate-spin"/>
            Sending...
          </>) : (<>
            <Send className="w-4 h-4"/>
            Send
          </>)}
      </button>
    </div>);
};
export default RequestBar;