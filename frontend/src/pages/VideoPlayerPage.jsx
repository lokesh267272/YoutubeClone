import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header/Header.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import CommentSection from '../components/CommentSection/CommentSection.jsx';
import { mockVideos, formatViews, formatDate } from '../data/mockData.js';

/* ─────────────────────────── helpers ─────────────────────────── */
function formatLikes(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/* ─────────────────────── RecommendedVideoCard ─────────────────── */
function RecommendedVideoCard({ video }) {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="flex gap-2 group cursor-pointer"
      onClick={() => { navigate(`/watch/${video._id}`); window.scrollTo(0, 0); }}
    >
      {/* Thumbnail */}
      <div className="w-[168px] h-[94px] flex-shrink-0 rounded-lg overflow-hidden relative border border-surface-variant bg-surface-container-low">
        {imgErr ? (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
            <span className="material-symbols-outlined text-secondary text-[32px]">play_circle</span>
          </div>
        ) : (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}
        {video.duration && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0 pr-1">
        <h3 className="text-body-md font-medium text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <span className="text-body-sm text-secondary mt-1 truncate">{video.channelName}</span>
        <div className="text-body-sm text-secondary flex items-center gap-1">
          <span>{formatViews(video.views)}</span>
          <span>•</span>
          <span>{formatDate(video.uploadDate)}</span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── BottomNav (mobile) ──────────────────── */
function BottomNav() {
  const navigate = useNavigate();
  const items = [
    { icon: 'home', label: 'Home', path: '/' },
    { icon: 'play_circle', label: 'Shorts', path: '/shorts' },
    { icon: 'subscriptions', label: 'Subscriptions', path: '/subscriptions' },
    { icon: 'account_circle', label: 'You', path: '/you' },
  ];

  return (
    <nav className="fixed bottom-0 w-full lg:hidden flex justify-around items-center h-14 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-variant z-50">
      {items.map(item => (
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

/* ───────────────────────── VideoPlayerPage ────────────────────── */
export default function VideoPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const video = mockVideos.find(v => v._id === id);

  /* ── like / dislike ── */
  const baseLikes = Math.max(Math.floor((video?.views || 10000) * 0.06), 500);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(baseLikes);

  /* ── subscribe ── */
  const [subscribed, setSubscribed] = useState(false);

  /* ── description expand ── */
  const [descExpanded, setDescExpanded] = useState(false);

  /* ── recommendations filter ── */
  const [recFilter, setRecFilter] = useState('All');

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

  const recommendations = mockVideos.filter(v => v._id !== id);
  const filteredRecs = recFilter === 'All'
    ? recommendations
    : recommendations.filter(v => v.channelName === video.channelName || v.category === video.category);

  function handleLike() {
    if (!user) { navigate('/login'); return; }
    if (liked) { setLiked(false); setLikeCount(c => c - 1); }
    else {
      setLiked(true); setLikeCount(c => c + 1);
      if (disliked) setDisliked(false);
    }
  }

  function handleDislike() {
    if (!user) { navigate('/login'); return; }
    if (disliked) { setDisliked(false); }
    else {
      setDisliked(true);
      if (liked) { setLiked(false); setLikeCount(c => c - 1); }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <Header
        onToggleSidebar={() => setSidebarOpen(p => !p)}
        onSearch={q => { setSearchQuery(q); if (q) navigate(`/?search=${q}`); }}
      />

      {/* ── Body ── */}
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} />

      {/* ── Main ── */}
      <main className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-60' : 'md:ml-0'}`}>
      <div className="max-w-[1800px] mx-auto w-full flex flex-col lg:flex-row gap-6 p-4 lg:p-6 pb-20 lg:pb-8">

        {/* ══════ LEFT: Primary content ══════ */}
        <div className="flex-1 min-w-0">

          {/* Video Player */}
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
            <video
              className="w-full h-full"
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              controls
              controlsList="nodownload"
              preload="metadata"
            />
          </div>

          {/* Title */}
          <div className="mt-4">
            <h1 className="text-headline-md font-headline-md text-on-surface leading-snug">
              {video.title}
            </h1>
          </div>

          {/* Channel row + Action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">

            {/* Channel info + Subscribe */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Avatar */}
              <button
                onClick={() => navigate(`/channel/${video.channelId}`)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: video.channelAvatarBg || '#4d96ff' }}
              >
                {video.channelInitial}
              </button>

              {/* Name + subs */}
              <button
                onClick={() => navigate(`/channel/${video.channelId}`)}
                className="text-left"
              >
                <div className="text-title-sm font-title-sm text-on-surface flex items-center gap-1">
                  {video.channelName}
                  <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                </div>
                <div className="text-body-sm text-secondary">
                  {formatLikes(Math.floor((video.views || 1000) * 0.008))} subscribers
                </div>
              </button>

              {/* Subscribe button */}
              <button
                onClick={() => setSubscribed(p => !p)}
                className={`
                  px-5 py-2 rounded-full text-label-md font-label-md transition-all duration-200 ml-1
                  ${subscribed
                    ? 'bg-surface-container border border-surface-variant text-on-surface hover:bg-surface-container-high'
                    : 'bg-on-surface text-surface-container-lowest hover:opacity-85'
                  }
                `}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Action pill buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 flex-shrink-0">

              {/* Like / Dislike combined pill */}
              <div className="flex items-center bg-surface-container-low rounded-full h-9 border border-surface-variant flex-shrink-0">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 h-full hover:bg-surface-variant rounded-l-full transition-colors border-r border-surface-variant"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={liked ? { fontVariationSettings: '"FILL" 1', color: '#bc0100' } : {}}
                  >
                    thumb_up
                  </span>
                  <span className="text-label-md font-label-md text-on-surface">
                    {formatLikes(likeCount)}
                  </span>
                </button>
                <button
                  onClick={handleDislike}
                  className="flex items-center px-4 h-full hover:bg-surface-variant rounded-r-full transition-colors"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={disliked ? { fontVariationSettings: '"FILL" 1', color: '#bc0100' } : {}}
                  >
                    thumb_down
                  </span>
                </button>
              </div>

              {/* Share */}
              <button className="flex items-center gap-2 px-4 h-9 bg-surface-container-low hover:bg-surface-variant rounded-full transition-colors border border-surface-variant whitespace-nowrap flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">share</span>
                <span className="text-label-md font-label-md">Share</span>
              </button>

              {/* Download (desktop) */}
              <button className="hidden md:flex items-center gap-2 px-4 h-9 bg-surface-container-low hover:bg-surface-variant rounded-full transition-colors border border-surface-variant whitespace-nowrap flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span className="text-label-md font-label-md">Download</span>
              </button>

              {/* More */}
              <button className="flex items-center px-3 h-9 bg-surface-container-low hover:bg-surface-variant rounded-full transition-colors border border-surface-variant flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
              </button>
            </div>
          </div>

          {/* Description box */}
          <div
            className="mt-4 p-4 bg-surface-container-low rounded-xl border border-surface-variant hover:bg-surface-variant/50 transition-colors cursor-pointer"
            onClick={() => setDescExpanded(p => !p)}
          >
            {/* Meta row */}
            <div className="flex gap-2 text-title-sm font-title-sm text-on-surface mb-2 flex-wrap">
              <span>{formatViews(video.views)}</span>
              <span>•</span>
              <span>{formatDate(video.uploadDate)}</span>
              <span className="ml-2 text-body-md text-secondary text-label-md font-label-md bg-surface-container px-2 py-0.5 rounded-full">
                {video.category}
              </span>
            </div>

            {/* Description text */}
            <p className={`text-body-md text-on-surface whitespace-pre-wrap ${!descExpanded ? 'line-clamp-3' : ''}`}>
              {video.description}
              {descExpanded && (
                <>
                  {'\n\n'}
                  <span className="text-secondary">
                    Watch more videos on our channel and don't forget to like and subscribe!
                    Hit the notification bell so you never miss an upload.{'\n\n'}
                    Tags: #{video.category.replace(/\s+/g, '')} #programming #tutorial #youtube
                  </span>
                </>
              )}
            </p>

            <div className="mt-2 text-label-md font-label-md text-on-surface font-semibold">
              {descExpanded ? 'Show less' : 'Show more'}
            </div>
          </div>

          {/* Comments */}
          <CommentSection videoId={video._id} />
        </div>

        {/* ══════ RIGHT: Recommendations ══════ */}
        <aside className="w-full lg:w-[400px] flex-shrink-0">

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
            {['All', `From ${video.channelName}`, video.category].map(chip => (
              <button
                key={chip}
                onClick={() => setRecFilter(chip === `From ${video.channelName}` || chip === video.category ? chip : 'All')}
                className={`
                  px-3 py-1.5 rounded-lg text-label-md font-label-md whitespace-nowrap flex-shrink-0 transition-colors
                  ${chip === 'All' && recFilter === 'All'
                    ? 'bg-on-surface text-surface-container-lowest'
                    : chip !== 'All' && recFilter !== 'All'
                    ? 'bg-on-surface text-surface-container-lowest'
                    : 'bg-surface-container-low border border-surface-variant text-on-surface hover:bg-surface-variant'
                  }
                `}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Recommended video list */}
          <div className="flex flex-col gap-3">
            {(filteredRecs.length > 0 ? filteredRecs : recommendations).map(v => (
              <RecommendedVideoCard key={v._id} video={v} />
            ))}
          </div>
        </aside>
      </div>
      </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <BottomNav />
    </div>
  );
}
