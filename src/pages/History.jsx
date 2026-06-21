import React, { useEffect, useState } from 'react';
import { getHistory } from '../storage/localStore';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES } from '../utils/constants';

export default function History({ onGoHome }) {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('all');

  useEffect(() => {
    const data = getHistory();
    setHistory(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = history;
    if (search) {
      result = result.filter(h => h.category.toLowerCase().includes(search.toLowerCase()));
    }
    if (filterDiff !== 'all') {
      result = result.filter(h => h.difficulty.toLowerCase() === filterDiff.toLowerCase());
    }
    setFiltered(result);
  }, [search, filterDiff, history]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800 transition-all duration-300 transform animate-in fade-in zoom-in-95 h-[80vh] flex flex-col">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <button 
            onClick={onGoHome}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Quiz History
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by category..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              value={filterDiff}
              onChange={(e) => setFilterDiff(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              {DIFFICULTIES.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
              No history found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Category</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Difficulty</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Score</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-800 dark:text-slate-200">
                      {item.category}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 capitalize">
                      {item.difficulty}
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-800 dark:text-slate-200 text-right">
                      {item.score} / {item.total}
                    </td>
                    <td className="p-4 text-sm font-medium text-right text-emerald-600 dark:text-emerald-400">
                      {item.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
