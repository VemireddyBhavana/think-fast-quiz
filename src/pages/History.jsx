import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/analyticsService';
import { ArrowLeft, Search, Filter, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getHistory();
      setHistory(data);
      setFilteredHistory(data);
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    let result = history;
    if (searchTerm) {
      result = result.filter(item => 
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory) {
      result = result.filter(item => item.category === filterCategory);
    }
    setFilteredHistory(result);
  }, [searchTerm, filterCategory, history]);

  const categories = [...new Set(history.map(item => item.category))];

  return (
    <div className="min-h-screen py-12 px-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Quiz History</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Search & Filter Bar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search category or difficulty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* History List */}
        <div className="p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <HistoryIcon size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No quiz history found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item, idx) => (
                <div key={item._id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-slate-50 dark:bg-slate-800/30 transition-colors group">
                  
                  <div className="mb-4 sm:mb-0">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.category}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="capitalize px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md font-medium text-slate-700 dark:text-slate-300">
                        {item.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:text-right">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Score</p>
                      <p className="text-2xl font-black text-slate-800 dark:text-white">{item.score}<span className="text-sm text-slate-400 font-medium">/{item.totalQuestions}</span></p>
                    </div>
                    <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Accuracy</p>
                      <p className={`text-2xl font-black ${item.percentage >= 80 ? 'text-emerald-500' : item.percentage >= 50 ? 'text-blue-500' : 'text-rose-500'}`}>
                        {item.percentage}%
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Ensure lucide icon is available
import { History as HistoryIcon } from 'lucide-react';
