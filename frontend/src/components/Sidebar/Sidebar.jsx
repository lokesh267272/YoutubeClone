import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

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

function NavLink({ icon, label, path, active, filled }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={`
        w-full flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all duration-150 text-left
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
      <span className="truncate">{label}</span>
    </button>
  );
}

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" />
      )}

      <aside
        className={`
          fixed left-0 top-14 h-[calc(100vh-56px)] w-60
          bg-surface-container-lowest z-40
          flex flex-col pt-3 pb-6 px-3
          overflow-y-auto custom-scrollbar
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
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
            />
          ))}
        </nav>

        <hr className="border-surface-variant my-3 mx-0" />

        {/* Explore section */}
        <div>
          <h3 className="text-title-sm font-title-sm text-on-surface px-3 mb-1">
            Explore
          </h3>
          <nav className="flex flex-col gap-0.5">
            {EXPLORE_LINKS.map((link) => (
              <NavLink
                key={link.path}
                {...link}
                active={false}
              />
            ))}
          </nav>
        </div>

        {/* Auth-only section */}
        {user && (
          <>
            <hr className="border-surface-variant my-3 mx-0" />
            <div>
              <h3 className="text-title-sm font-title-sm text-on-surface px-3 mb-1">
                Your content
              </h3>
              <nav className="flex flex-col gap-0.5">
                <button
                  onClick={() => navigate(`/channel/${user.channelId || 'my'}`)}
                  className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all duration-150 text-left text-on-surface hover:bg-surface-variant text-body-md font-body-md"
                >
                  <span className="material-symbols-outlined flex-shrink-0">manage_accounts</span>
                  <span className="truncate">Your channel</span>
                </button>
                <button
                  onClick={() => navigate('/upload')}
                  className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all duration-150 text-left text-on-surface hover:bg-surface-variant text-body-md font-body-md"
                >
                  <span className="material-symbols-outlined flex-shrink-0">upload</span>
                  <span className="truncate">Upload video</span>
                </button>
              </nav>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 px-3">
          <p className="text-body-sm text-secondary leading-relaxed">
            © 2026 YouTube Clone
          </p>
        </div>
      </aside>
    </>
  );
}
