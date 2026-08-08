import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { KeyValuePair } from '../types/api';

interface Props {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  title: string;
}

export const KeyValueEditor: React.FC<Props> = ({ items, onChange, title }) => {
  const handleAdd = () => {
    onChange([
      ...items,
      { id: crypto.randomUUID(), key: '', value: '', enabled: true },
    ]);
  };

  const handleUpdate = (id: string, field: keyof KeyValuePair, val: any) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </h4>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Row
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-800 rounded-md text-slate-500 text-xs">
          No {title.toLowerCase()} added yet. Click "+ Add Row" above.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) => handleUpdate(item.id, 'enabled', e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded border-slate-700 bg-slate-900 cursor-pointer"
              />
              <input
                type="text"
                value={item.key}
                onChange={(e) => handleUpdate(item.id, 'key', e.target.value)}
                placeholder="Key"
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleUpdate(item.id, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={() => handleDelete(item.id)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default KeyValueEditor;