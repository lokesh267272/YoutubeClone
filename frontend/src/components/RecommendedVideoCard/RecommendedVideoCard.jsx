import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatViews, formatDate } from '../../data/mockData.js';

export default function RecommendedVideoCard({ video }) {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="flex gap-2 group cursor-pointer"
      onClick={() => { navigate(`/watch/${video._id}`); window.scrollTo(0, 0); }}
    >
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
