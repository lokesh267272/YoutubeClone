import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import FilterBar from '../components/FilterBar/FilterBar.jsx';
import VideoCard from '../components/VideoCard/VideoCard.jsx';
import { mockVideos } from '../data/mockData.js';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Close sidebar on mobile by default
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) setSidebarOpen(false);
  }, []);

  // Close sidebar on mobile when resizing down
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) setSidebarOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredVideos = useMemo(() => {
    let result = mockVideos;

    if (selectedCategory !== 'All') {
      result = result.filter(v => v.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        v =>
          v.title.toLowerCase().includes(q) ||
          v.channelName.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q),
      );
    }

    return result;
  }, [searchQuery, selectedCategory]);

  function handleSearch(query) {
    setSearchQuery(query);
    // When searching, reset category filter to All
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
            ${sidebarOpen ? 'md:ml-60' : 'md:ml-0'}
          `}
        >
          {/* Category filter bar */}
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Video grid */}
          <div className="p-gutter md:p-lg">
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-gutter gap-y-xl">
                {filteredVideos.map(video => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              /* Empty state */
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
    </div>
  );
}
