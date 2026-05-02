import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import VideoPlayerPage from './pages/VideoPlayerPage.jsx';
import ChannelPage from './pages/ChannelPage.jsx';

function ComingSoonPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4">
      <span className="material-symbols-outlined text-secondary text-[64px]">construction</span>
      <h2 className="text-headline-md font-headline-md text-on-surface">Coming Soon</h2>
      <p className="text-body-md text-secondary max-w-sm">
        This feature is not available yet. Check back later!
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-2 px-6 py-2.5 bg-on-surface text-surface-container-lowest rounded-full text-body-md font-medium hover:opacity-80 transition-opacity"
      >
        Go home
      </button>
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
