import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import FilterBar from '../components/FilterBar/FilterBar.jsx';
import VideoCard from '../components/VideoCard/VideoCard.jsx';
import BottomNav from '../components/BottomNav/BottomNav.jsx';
import { useSidebar } from '../context/SidebarContext.jsx';
import api from '../api/axios.js';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the home feed again whenever the filters change.
    setLoading(true);
    // Build the API query from the active search and category filters.
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory !== 'All') params.category = selectedCategory;
    api.get('/videos', { params })
      .then(({ data }) => setVideos(data))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedCategory]);

  function handleSearch(query) {
    // Searching resets the category so the results stay predictable.
    setSearchQuery(query);
    if (query) setSelectedCategory('All');
  }

  function handleCategoryChange(cat) {
    setSelectedCategory(cat);
    setSearchQuery('');
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">

      {/* ── Fixed Header ── */}
      <Header
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onSearch={handleSearch}
      />

      <div className="flex flex-1 relative">

        {/* ── Sidebar ── */}
        <Sidebar isOpen={sidebarOpen} />

        {/* ── Main content ── */}
        <main
          className={`
            flex-1 min-w-0 transition-all duration-300
            ${sidebarOpen ? 'md:ml-0 lg:ml-60' : 'md:ml-16 lg:ml-0'}
          `}
        >
          {/* Category filter bar */}
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Show loading placeholders until the feed is ready. */}
          <div className="p-gutter md:p-lg pb-20 lg:pb-gutter">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-gutter gap-y-xl">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3 animate-pulse">
                    <div className="w-full aspect-video bg-surface-container rounded-xl" />
                    <div className="flex gap-2">
                      <div className="w-9 h-9 rounded-full bg-surface-container flex-shrink-0" />
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="h-4 bg-surface-container rounded w-full" />
                        <div className="h-3 bg-surface-container rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-gutter gap-y-xl">
                {/* Render each video card from the fetched feed data. */}
                {videos.map(video => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="material-symbols-outlined text-secondary text-[64px] mb-4">
                  search_off
                </span>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-2">
                  No results found
                </h2>
                <p className="text-body-md text-secondary max-w-sm">
                  {searchQuery
                    ? `No videos match "${searchQuery}". Try a different search term.`
                    : `No videos in the "${selectedCategory}" category yet.`
                  }
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="mt-6 px-5 py-2 bg-on-surface text-surface-container-lowest rounded-full text-body-md font-medium hover:opacity-80 transition-opacity"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
