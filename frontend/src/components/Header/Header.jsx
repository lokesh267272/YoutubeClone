import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header({ onToggleSidebar, onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    onSearch(searchValue.trim());
  }

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val.trim());
  }

  function handleLogout() {
    logout();
    setDropdownOpen(false);
  }

  return (
    <header className="bg-surface-container-lowest sticky top-0 z-50 flex items-center justify-between w-full px-gutter h-14 border-b border-surface-variant">

      {/* ── LEFT: Hamburger + Logo ── */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-surface-variant rounded-full transition-colors active:scale-95 duration-100 flex items-center justify-center"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-on-surface">menu</span>
        </button>

        <a
          href="/"
          className="flex items-center gap-1 tracking-tighter no-underline"
          onClick={(e) => { e.preventDefault(); navigate('/'); onSearch(''); }}
        >
          <span
            className="material-symbols-outlined text-primary filled text-[28px]"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            play_circle
          </span>
          <span className="text-headline-md font-headline-md text-on-surface hidden sm:block">
            YouTube
          </span>
        </a>
      </div>

      {/* ── CENTER: Search bar (desktop) ── */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex flex-1 max-w-[600px] items-center gap-3 mx-8"
      >
        <div className="flex w-full">
          <div className="flex w-full items-center border border-surface-variant rounded-l-full bg-surface-container-lowest h-10 px-4 focus-within:border-secondary transition-colors">
            <span className="material-symbols-outlined text-secondary text-[20px] mr-2">search</span>
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search"
              className="w-full bg-transparent border-none focus:ring-0 text-on-surface text-body-md placeholder:text-secondary p-0 outline-none"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => { setSearchValue(''); onSearch(''); }}
                className="text-secondary hover:text-on-surface ml-1"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-surface-container px-5 rounded-r-full border border-l-0 border-surface-variant hover:bg-surface-variant transition-colors flex items-center justify-center h-10 flex-shrink-0"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-on-surface text-[20px]">search</span>
          </button>
        </div>

        <button
          type="button"
          className="bg-surface-container hover:bg-surface-variant rounded-full w-10 h-10 flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Voice search"
        >
          <span
            className="material-symbols-outlined text-on-surface"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            mic
          </span>
        </button>
      </form>

      {/* ── RIGHT: Actions + Auth ── */}
      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">

        {/* Mobile search icon */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="md:hidden p-2 hover:bg-surface-variant rounded-full transition-colors flex items-center justify-center"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-on-surface">search</span>
        </button>

        {/* Create video (desktop only) */}
        <button className="hidden md:flex p-2 hover:bg-surface-variant rounded-full transition-colors items-center justify-center">
          <span className="material-symbols-outlined text-on-surface">video_call</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-surface-variant rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface">notifications</span>
          <span className="absolute top-2 right-2 bg-primary w-2 h-2 rounded-full border-2 border-surface-container-lowest" />
        </button>

        {/* Auth: Sign In button or User avatar */}
        {user ? (
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 border-2 border-surface-container-high"
              style={{ backgroundColor: user.avatarBg || '#4d96ff' }}
              aria-label="User menu"
            >
              {user.username?.[0]?.toUpperCase() || 'U'}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-10 w-48 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-surface-variant">
                  <p className="text-title-sm font-title-sm text-on-surface truncate">{user.username}</p>
                  <p className="text-body-sm text-secondary truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => navigate(`/channel/${user.channelId || 'my'}`)}
                  className="w-full text-left px-4 py-3 text-body-md text-on-surface hover:bg-surface-variant flex items-center gap-3 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                  Your channel
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-body-md text-on-surface hover:bg-surface-variant flex items-center gap-3 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="ml-1 flex items-center gap-2 border border-outline rounded-full px-3 h-9 text-primary text-body-md font-medium hover:bg-primary-fixed/30 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">account_circle</span>
            <span className="hidden sm:block">Sign in</span>
          </button>
        )}
      </div>

      {/* ── Mobile search overlay ── */}
      {mobileSearchOpen && (
        <div className="absolute inset-0 bg-surface-container-lowest z-50 flex items-center px-2 h-14">
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="p-2 hover:bg-surface-variant rounded-full mr-1"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center">
            <div className="flex flex-1 items-center border border-surface-variant rounded-l-full h-10 px-3 focus-within:border-secondary bg-surface-container-lowest">
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search"
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface text-body-md placeholder:text-secondary p-0 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-surface-container px-4 rounded-r-full border border-l-0 border-surface-variant h-10 flex items-center"
            >
              <span className="material-symbols-outlined text-on-surface text-[20px]">search</span>
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
