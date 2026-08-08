import { useState } from 'react';
import { X, Plus, Trash2, Sliders } from 'lucide-react';
import { useApiStore } from '../store/useApiStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function EnvModal({ isOpen, onClose }: Props) {
  const { environments, setEnvironmentVar, deleteEnvironmentVar } = useApiStore();
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newKey.trim()) {
      setEnvironmentVar(newKey.trim(), newValue.trim());
      setNewKey('');
      setNewValue('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-sm">Environment Variables</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          // Add New Variable Inputs 
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Variable (e.g. baseUrl)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-md focus:outline-none focus:border-indigo-500 font-mono"
            />
            <input
              type="text"
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-md focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          // Variables Table 
          <div className="bg-slate-950 border border-slate-800 rounded-md overflow-hidden max-h-60 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2">Variable Name</th>
                  <th className="px-3 py-2">Value</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {Object.entries(environments).map(([key, value]) => (
                  <tr key={key} className="hover:bg-slate-900/50">
                    <td className="px-3 py-2 font-semibold text-indigo-400">{`{{${key}}}`}</td>
                    <td className="px-3 py-2 text-slate-400 truncate max-w-[150px]">{value}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => deleteEnvironmentVar(key)}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EnvModal;