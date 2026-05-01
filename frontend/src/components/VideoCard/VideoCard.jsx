import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatViews, formatDate } from '../../data/mockData.js';

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleCardClick() {
    navigate(`/watch/${video._id}`);
  }

  function handleChannelClick(e) {
    e.stopPropagation();
    navigate(`/channel/${video.channelId}`);
  }

  function handleMenuClick(e) {
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  }

  return (
    <article
      className="flex flex-col gap-sm group cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* ── Thumbnail ── */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-surface-variant bg-surface-container-low">
        {imgError ? (
          /* Fallback thumbnail */
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
            <span className="material-symbols-outlined text-secondary text-[48px]">
              play_circle
            </span>
          </div>
        ) : (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}

        {/* Duration badge */}
        {video.duration && (
          <span className="absolute bottom-1 right-1 bg-on-surface text-surface-container-lowest text-label-md font-label-md px-1.5 py-0.5 rounded-sm opacity-90 leading-none">
            {video.duration}
          </span>
        )}

        {/* Live badge */}
        {video.category === 'Live' && (
          <span className="absolute top-1 left-1 bg-primary text-on-primary text-label-md font-label-md px-2 py-0.5 rounded-sm uppercase tracking-wider">
            LIVE
          </span>
        )}
      </div>

      {/* ── Info row ── */}
      <div className="flex gap-sm">
        {/* Channel avatar */}
        <button
          onClick={handleChannelClick}
          className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 mt-1 border border-surface-container flex items-center justify-center"
          style={{ backgroundColor: video.channelAvatarBg || '#e4e2e2' }}
          aria-label={`Visit ${video.channelName} channel`}
        >
          {video.channelAvatar ? (
            <img
              src={video.channelAvatar}
              alt={video.channelName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-title-sm font-title-sm">
              {video.channelInitial || video.channelName?.[0]?.toUpperCase()}
            </span>
          )}
        </button>

        {/* Text info */}
        <div className="flex flex-col flex-1 min-w-0 pr-1">
          <h3 className="text-title-sm font-title-sm text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <div className="flex flex-col mt-base text-body-sm font-body-sm text-secondary">
            <button
              onClick={handleChannelClick}
              className="hover:text-on-surface transition-colors text-left truncate"
            >
              {video.channelName}
            </button>
            <span>
              {formatViews(video.views)} • {formatDate(video.uploadDate)}
            </span>
          </div>
        </div>

        {/* 3-dot menu */}
        <div className="relative flex-shrink-0 self-start mt-1">
          <button
            onClick={handleMenuClick}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-variant rounded-full transition-all"
            aria-label="More options"
          >
            <span className="material-symbols-outlined text-on-surface text-[20px]">
              more_vert
            </span>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-7 w-48 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-lg z-10 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {[
                { icon: 'playlist_add', label: 'Save to Watch later' },
                { icon: 'playlist_add_check', label: 'Save to playlist' },
                { icon: 'download', label: 'Download' },
                { icon: 'share', label: 'Share' },
                { icon: 'do_not_disturb_on', label: 'Not interested' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-body-md text-on-surface hover:bg-surface-variant transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
