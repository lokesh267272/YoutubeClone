function formatLikes(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function VideoActions({ liked, disliked, likeCount, shareCopied, onLike, onDislike, onShare }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 flex-shrink-0">

      {/* Like / Dislike pill */}
      <div className="flex items-center bg-surface-container-low rounded-full h-9 border border-surface-variant flex-shrink-0">
        <button
          onClick={onLike}
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
          onClick={onDislike}
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
      <button
        onClick={onShare}
        className="flex items-center gap-2 px-4 h-9 bg-surface-container-low hover:bg-surface-variant rounded-full transition-colors border border-surface-variant whitespace-nowrap flex-shrink-0"
      >
        <span className="material-symbols-outlined text-[20px]">
          {shareCopied ? 'check' : 'share'}
        </span>
        <span className="text-label-md font-label-md">
          {shareCopied ? 'Copied!' : 'Share'}
        </span>
      </button>

      {/* Download */}
      <button className="hidden md:flex items-center gap-2 px-4 h-9 bg-surface-container-low hover:bg-surface-variant rounded-full transition-colors border border-surface-variant whitespace-nowrap flex-shrink-0">
        <span className="material-symbols-outlined text-[20px]">download</span>
        <span className="text-label-md font-label-md">Download</span>
      </button>

      {/* More */}
      <button className="flex items-center px-3 h-9 bg-surface-container-low hover:bg-surface-variant rounded-full transition-colors border border-surface-variant flex-shrink-0">
        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
      </button>
    </div>
  );
}
