import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_ITEMS = [
  { icon: 'home',          label: 'Home',          path: '/' },
  { icon: 'play_circle',   label: 'Shorts',        path: '/shorts' },
  { icon: 'subscriptions', label: 'Subscriptions', path: '/subscriptions' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  function handleYouClick() {
    if (!user) {
      navigate('/login');
    } else if (user.channelId) {
      navigate(`/channel/${user.channelId}`);
    } else {
      navigate('/you');
    }
  }

  const isYouActive = user?.channelId
    ? location.pathname === `/channel/${user.channelId}`
    : location.pathname === '/you';

  return (
    <nav className="fixed bottom-0 w-full lg:hidden flex justify-around items-center h-14 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-variant z-50">
      {NAV_ITEMS.map(item => (
        <button
          key={item.label}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center justify-center gap-0.5 text-secondary hover:text-on-surface transition-colors w-full h-full active:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}

      {/* You / Channel button */}
      <button
        onClick={handleYouClick}
        className={`flex flex-col items-center justify-center gap-0.5 w-full h-full active:bg-surface-container transition-colors ${isYouActive ? 'text-on-surface' : 'text-secondary hover:text-on-surface'}`}
      >
        {user ? (
          <div
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
            style={{ backgroundColor: user.avatarBg || '#4d96ff' }}
          >
            {user.username?.[0]?.toUpperCase()}
          </div>
        ) : (
          <span className="material-symbols-outlined text-[22px]">account_circle</span>
        )}
        <span className="text-[10px] font-medium">You</span>
      </button>
    </nav>
  );
}
