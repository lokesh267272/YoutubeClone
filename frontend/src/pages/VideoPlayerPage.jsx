import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header/Header.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import CommentSection from '../components/CommentSection/CommentSection.jsx';
import RecommendedVideoCard from '../components/RecommendedVideoCard/RecommendedVideoCard.jsx';
import BottomNav from '../components/BottomNav/BottomNav.jsx';
import VideoActions from '../components/VideoActions/VideoActions.jsx';
import VideoDescription from '../components/VideoDescription/VideoDescription.jsx';
import { CATEGORIES } from '../data/categories.js';
import api from '../api/axios.js';

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function VideoPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [recFilter, setRecFilter] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setVideo(null);

    Promise.all([
      api.get(`/videos/${id}`, { signal: controller.signal }),
      api.get('/videos', { signal: controller.signal }),
    ])
      .then(([videoRes, allRes]) => {
        const v = videoRes.data;
        setVideo(v);
        setAllVideos(allRes.data);
        setLikeCount(v.likes.length);
        if (user) {
          setLiked(v.likes.map(String).includes(String(user._id)));
          setDisliked(v.dislikes.map(String).includes(String(user._id)));
        }
      })
      .catch(err => { if (err.code !== 'ERR_CANCELED') setVideo(null); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  async function handleLike() {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await api.put(`/videos/${id}/like`);
      setLikeCount(data.likes.length);
      setLiked(data.likes.map(String).includes(String(user._id)));
      setDisliked(data.dislikes.map(String).includes(String(user._id)));
    } catch { /* ignore */ }
  }

  async function handleDislike() {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await api.put(`/videos/${id}/dislike`);
      setLikeCount(data.likes.length);
      setLiked(data.likes.map(String).includes(String(user._id)));
      setDisliked(data.dislikes.map(String).includes(String(user._id)));
    } catch { /* ignore */ }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header onToggleSidebar={() => {}} onSearch={() => {}} />
        <div className="flex items-center justify-center flex-1">
          <span className="w-10 h-10 border-4 border-surface-variant border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header onToggleSidebar={() => {}} onSearch={() => {}} />
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <span className="material-symbols-outlined text-secondary text-[64px]">video_library</span>
          <h2 className="text-headline-md font-headline-md text-on-surface">Video not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-on-surface text-surface-container-lowest rounded-full text-body-md font-medium hover:opacity-80 transition-opacity"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  const recommendations = allVideos.filter(v => v._id !== id);
  const filteredRecs = recFilter === 'All'
    ? recommendations
    : recommendations.filter(v => v.category === recFilter);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onToggleSidebar={() => setSidebarOpen(p => !p)}
        onSearch={q => { if (q) navigate(`/?search=${q}`); }}
      />

      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-60' : 'md:ml-0'}`}>
          <div className="max-w-[1800px] mx-auto w-full flex flex-col lg:flex-row gap-6 p-4 lg:p-6 pb-24 lg:pb-8">

            {/* ── Left: Video + Info ── */}
            <div className="flex-1 min-w-0">

              {/* Player */}
              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
                <video
                  className="w-full h-full"
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  controls
                  autoPlay
                  controlsList="nodownload"
                  preload="auto"
                />
              </div>

              {/* Title */}
              <h1 className="mt-4 text-headline-md font-headline-md text-on-surface leading-snug">
                {video.title}
              </h1>

              {/* Channel row + actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => navigate(`/channel/${video.channelId}`)}
                    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold flex-shrink-0 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: video.channelAvatarBg || '#4d96ff' }}
                  >
                    {video.channelProfileUrl ? (
                      <img src={video.channelProfileUrl} alt={video.channelName} className="w-full h-full object-cover" />
                    ) : (
                      video.channelInitial
                    )}
                  </button>

                  <button onClick={() => navigate(`/channel/${video.channelId}`)} className="text-left">
                    <div className="text-title-sm font-title-sm text-on-surface flex items-center gap-1">
                      {video.channelName}
                      <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                    </div>
                    <div className="text-body-sm text-secondary">
                      {formatCount(Math.floor((video.views || 1000) * 0.008))} subscribers
                    </div>
                  </button>

                  <button
                    onClick={() => setSubscribed(p => !p)}
                    className={`px-5 py-2 rounded-full text-label-md font-label-md transition-all duration-200 ml-1 ${subscribed ? 'bg-surface-container border border-surface-variant text-on-surface hover:bg-surface-container-high' : 'bg-on-surface text-surface-container-lowest hover:opacity-85'}`}
                  >
                    {subscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>

                <VideoActions
                  liked={liked}
                  disliked={disliked}
                  likeCount={likeCount}
                  shareCopied={shareCopied}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onShare={handleShare}
                />
              </div>

              <VideoDescription video={video} />
              <CommentSection videoId={video._id} />
            </div>

            {/* ── Right: Recommendations ── */}
            <aside className="w-full lg:w-[400px] flex-shrink-0">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setRecFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-label-md font-label-md whitespace-nowrap flex-shrink-0 transition-colors ${recFilter === cat ? 'bg-on-surface text-surface-container-lowest' : 'bg-surface-container-low border border-surface-variant text-on-surface hover:bg-surface-variant'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {(filteredRecs.length > 0 ? filteredRecs : recommendations).map(v => (
                  <RecommendedVideoCard key={v._id} video={v} />
                ))}
              </div>
            </aside>

          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
