import { useState } from 'react';
import { formatViews, formatDate } from '../../utils/formatters.js';

export default function VideoDescription({ video }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="mt-4 p-4 bg-surface-container-low rounded-xl border border-surface-variant hover:bg-surface-variant/50 transition-colors cursor-pointer"
      onClick={() => setExpanded(p => !p)}
    >
      <div className="flex gap-2 text-title-sm font-title-sm text-on-surface mb-2 flex-wrap">
        <span>{formatViews(video.views)}</span>
        <span>•</span>
        <span>{formatDate(video.uploadDate)}</span>
        <span className="ml-2 text-body-md text-secondary text-label-md font-label-md bg-surface-container px-2 py-0.5 rounded-full">
          {video.category}
        </span>
      </div>

      <p className={`text-body-md text-on-surface whitespace-pre-wrap ${!expanded ? 'line-clamp-3' : ''}`}>
        {video.description}
        {expanded && (
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
        {expanded ? 'Show less' : 'Show more'}
      </div>
    </div>
  );
}
