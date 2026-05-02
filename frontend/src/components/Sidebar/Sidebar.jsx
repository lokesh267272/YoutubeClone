import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import CreateChannelModal from '../CreateChannelModal.jsx';

const NAV_LINKS = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'subscriptions', label: 'Subscriptions', path: '/subscriptions' },
  { icon: 'video_library', label: 'Library', path: '/library' },
  { icon: 'history', label: 'History', path: '/history' },
  { icon: 'playlist_play', label: 'Playlists', path: '/playlists' },
  { icon: 'watch_later', label: 'Watch later', path: '/watch-later' },
  { icon: 'thumb_up', label: 'Liked videos', path: '/liked' },
];

const EXPLORE_LINKS = [
  { icon: 'local_fire_department', label: 'Trending', path: '/trending' },
  { icon: 'shopping_bag', label: 'Shopping', path: '/shopping' },
  { icon: 'music_note', label: 'Music', path: '/music' },
  { icon: 'movie', label: 'Movies', path: '/movies' },
  { icon: 'live_tv', label: 'Live', path: '/live' },
  { icon: 'sports_esports', label: 'Gaming', path: '/gaming' },
  { icon: 'newspaper', label: 'News', path: '/news' },
  { icon: 'sports', label: 'Sports', path: '/sports' },
  { icon: 'school', label: 'Courses', path: '/courses' },
];

function NavLink({ icon, label, path, active, filled, showLabel }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      title={label}
      className={`
        w-full flex items-center py-2.5 rounded-lg transition-all duration-150 text-left
        ${showLabel ? 'gap-4 px-3' : 'justify-center px-0'}
        ${active
          ? 'bg-surface-variant text-on-surface font-title-sm text-title-sm'
          : 'text-on-surface hover:bg-surface-variant text-body-md font-body-md'
        }
      `}
    >
      <span
        className="material-symbols-outlined flex-shrink-0"
        style={active && filled ? { fontVariationSettings: '"FILL" 1' } : {}}
      >
        {icon}
      </span>
      {showLabel && <span className="truncate">{label}</span>}
    </button>
  );
}

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createChannelOpen, setCreateChannelOpen] = useState(false);

  function goToChannel() {
    if (user?.channelId) {
      navigate(`/channel/${user.channelId}`);
    } else {
      setCreateChannelOpen(true);
    }
  }

  return (
    <>
      {/* Backdrop for mobile and tablet overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" />
      )}

      <aside
        className={`
          fixed left-0 top-14 h-[calc(100vh-56px)]
          bg-surface-container-lowest z-40
          flex flex-col pt-3 pb-6
          overflow-y-auto custom-scrollbar
          transition-all duration-300 ease-in-out
          ${isOpen
            ? 'translate-x-0 w-60 px-3'
            : '-translate-x-full w-60 md:translate-x-0 md:w-16 md:px-2 lg:-translate-x-full lg:w-60'
          }
        `}
      >
        {/* Main navigation */}
        <nav className="flex flex-col gap-0.5 w-full">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              {...link}
              active={location.pathname === link.path}
              filled
              showLabel={isOpen}
            />
          ))}
        </nav>

        {isOpen && <hr className="border-surface-variant my-3 mx-0" />}
        {!isOpen && <hr className="border-surface-variant my-3 mx-2 md:mx-1" />}

        {/* Explore section */}
        <div>
          {isOpen && (
            <h3 className="text-title-sm font-title-sm text-on-surface px-3 mb-1">
              Explore
            </h3>
          )}
          <nav className="flex flex-col gap-0.5">
            {EXPLORE_LINKS.map((link) => (
              <NavLink
                key={link.path}
                {...link}
                active={false}
                showLabel={isOpen}
              />
            ))}
          </nav>
        </div>

        {/* Auth-only section */}
        {user && (
          <>
            {isOpen && <hr className="border-surface-variant my-3 mx-0" />}
            {!isOpen && <hr className="border-surface-variant my-3 mx-2 md:mx-1" />}
            <div>
              {isOpen && (
                <h3 className="text-title-sm font-title-sm text-on-surface px-3 mb-1">
                  Your content
                </h3>
              )}
              <nav className="flex flex-col gap-0.5">
                <button
                  onClick={goToChannel}
                  title={user?.channelId ? 'Your channel' : 'Create channel'}
                  className={`w-full flex items-center py-2.5 rounded-lg transition-all duration-150 text-left text-on-surface hover:bg-surface-variant text-body-md font-body-md ${isOpen ? 'gap-4 px-3' : 'justify-center px-0'}`}
                >
                  <span className="material-symbols-outlined flex-shrink-0">
                    {user?.channelId ? 'manage_accounts' : 'add_circle'}
                  </span>
                  {isOpen && (
                    <span className="truncate">
                      {user?.channelId ? 'Your channel' : 'Create channel'}
                    </span>
                  )}
                </button>
                {user?.channelId && (
                  <button
                    onClick={() => navigate(`/channel/${user.channelId}`)}
                    title="Upload video"
                    className={`w-full flex items-center py-2.5 rounded-lg transition-all duration-150 text-left text-on-surface hover:bg-surface-variant text-body-md font-body-md ${isOpen ? 'gap-4 px-3' : 'justify-center px-0'}`}
                  >
                    <span className="material-symbols-outlined flex-shrink-0">upload</span>
                    {isOpen && <span className="truncate">Upload video</span>}
                  </button>
                )}
              </nav>
            </div>
          </>
        )}

        {/* Footer */}
        {isOpen && (
          <div className="mt-auto pt-4 px-3">
            <p className="text-body-sm text-secondary leading-relaxed">
              © 2026 YouTube Clone
            </p>
          </div>
        )}
      </aside>

      {createChannelOpen && (
        <CreateChannelModal onClose={() => setCreateChannelOpen(false)} />
      )}
    </>
  );
}
