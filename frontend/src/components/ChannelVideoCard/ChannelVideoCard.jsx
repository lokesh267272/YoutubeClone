import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatViews, formatDate } from "../../utils/formatters.js";

export default function ChannelVideoCard({ video, isOwner, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="group cursor-pointer" onClick={() => navigate(`/watch/${video._id}`)}>
      <div className="relative w-full aspect-video bg-surface-container-low rounded-xl overflow-hidden mb-3">
        {imgErr ? (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
            <span className="material-symbols-outlined text-secondary text-[40px]">play_circle</span>
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
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-medium px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
        {isOwner && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(video); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-full text-sm font-medium text-gray-900 hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(video._id); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/90 rounded-full text-sm font-medium text-white hover:bg-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start gap-1">
        <div className="flex-1 min-w-0">
          <h3 className="text-body-md font-medium text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-1">
            {video.title}
          </h3>
          <p className="text-body-sm text-secondary">
            {formatViews(video.views)} • {formatDate(video.uploadDate)}
          </p>
        </div>

        <div className="relative flex-shrink-0 mt-0.5" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(p => !p); }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-variant rounded-full transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">more_vert</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-48 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-lg z-20 overflow-hidden">
              <button
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-body-md text-on-surface hover:bg-surface-variant transition-colors text-left"
              >
                <span className="material-symbols-outlined text-[18px]">watch_later</span>
                Save to Watch later
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-body-md text-on-surface hover:bg-surface-variant transition-colors text-left"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                Share
              </button>
              {isOwner && (
                <>
                  <div className="border-t border-surface-variant" />
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(video); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-body-md text-on-surface hover:bg-surface-variant transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit video
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(video._id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-body-md text-error hover:bg-error-container/30 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete video
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
