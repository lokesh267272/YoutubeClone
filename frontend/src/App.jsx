import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import VideoPlayerPage from './pages/VideoPlayerPage.jsx';
import ChannelPage from './pages/ChannelPage.jsx';
import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import BottomNav from './components/BottomNav/BottomNav.jsx';
import { useSidebar } from './context/SidebarContext.jsx';

function ComingSoonPage() {
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      <Header
        onToggleSidebar={() => setSidebarOpen(p => !p)}
        onSearch={q => { if (q) navigate(`/?search=${q}`); }}
      />

      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`flex-1 min-w-0 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center px-4 pb-20 lg:pb-0 ${sidebarOpen ? 'md:ml-0 lg:ml-60' : 'md:ml-16 lg:ml-0'}`}>
          <span className="material-symbols-outlined text-secondary text-[64px]">construction</span>
          <h2 className="text-headline-md font-headline-md text-on-surface">Coming Soon</h2>
          <p className="text-body-md text-secondary max-w-sm">
            This feature is not available yet. Check back later!
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 px-6 py-2.5 bg-on-surface text-surface-container-lowest rounded-full text-body-md font-medium hover:opacity-80 transition-opacity"
          >
            Go to Homepage
          </button>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/watch/:id" element={<VideoPlayerPage />} />
      <Route path="/channel/:id" element={<ChannelPage />} />
      <Route path="*" element={<ComingSoonPage />} />
    </Routes>
  );
}
