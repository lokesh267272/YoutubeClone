import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { icon: 'home',          label: 'Home',          path: '/' },
  { icon: 'play_circle',   label: 'Shorts',        path: '/shorts' },
  { icon: 'subscriptions', label: 'Subscriptions', path: '/subscriptions' },
  { icon: 'account_circle',label: 'You',           path: '/you' },
];

export default function BottomNav() {
  const navigate = useNavigate();

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
    </nav>
  );
}
