import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, ArrowLeft, RefreshCw, Smartphone, Clock, ExternalLink } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Page } from '../App';

interface NewsUpdatesProps {
  setCurrentPage: (page: Page) => void;
  accessToken: string;
}

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  image: string;
}

const sources = [
  { id: 'all', name: 'All Sources', icon: '🌐' },
  { id: 'new-vision', name: 'New Vision', icon: '📰' },
  { id: 'monitor', name: 'Daily Monitor', icon: '📋' },
  { id: 'nation', name: 'Daily Nation', icon: '📃' },
  { id: 'social', name: 'Social Media', icon: '📱' }
];

export function NewsUpdates({ setCurrentPage, accessToken }: NewsUpdatesProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState('all');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9cb37aa1/news?source=${selectedSource}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, selectedSource]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchNews();
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchNews]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white sticky top-0 z-50 shadow-lg">
        <nav className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
            >
              <ArrowLeft className="size-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <Smartphone className="size-6" />
              <span className="text-xl md:text-2xl">Live News Updates</span>
            </div>
            <button
              onClick={() => fetchNews()}
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
            >
              <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Source Filter - Horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sources.map((source) => (
              <motion.button
                key={source.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSource(source.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedSource === source.id
                    ? 'bg-white text-blue-900'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <span>{source.icon}</span>
                <span className="text-sm">{source.name}</span>
              </motion.button>
            ))}
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-6">
        {/* Status Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="size-5" />
            <span className="text-sm">Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-blue-900 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Auto-refresh (60s)</span>
          </label>
        </div>

        {/* News Grid */}
        {loading && articles.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="size-12 text-blue-900 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading latest news...</p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="size-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No news articles available</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {article.image && (
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-blue-900 text-white px-3 py-1 rounded-full text-xs">
                        {article.source}
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Clock className="size-3" />
                      {formatTimeAgo(article.publishedAt)}
                    </div>
                    <h3 className="text-lg mb-2 text-gray-800 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-900 hover:text-blue-700 transition-colors"
                    >
                      <span className="text-sm">Read more</span>
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Mobile optimized message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center"
        >
          <Smartphone className="size-12 text-blue-900 mx-auto mb-3" />
          <h3 className="text-xl mb-2 text-gray-800">Mobile Optimized</h3>
          <p className="text-gray-600">
            Stay updated on the go! This page is fully responsive and updates automatically every minute.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
