import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Header from "../components/Header/Header.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import { CATEGORIES } from "../data/categories.js";
import { formatViews, formatDate } from "../data/mockData.js";
import api from "../api/axios.js";

const TABS = ["Home", "Videos", "Shorts", "Live", "Playlists", "Posts", "Store"];

function formatSubscribers(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/* ─────────────────────────── ChannelVideoCard ─────────────────────── */
function ChannelVideoCard({ video, isOwner, onEdit, onDelete }) {
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

/* ────────────────────────── VideoModal ────────────────────────── */
function VideoModal({ mode, video, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    video
      ? { title: video.title, description: video.description, thumbnailUrl: video.thumbnailUrl, videoUrl: video.videoUrl, category: video.category }
      : { title: "", description: "", thumbnailUrl: "", videoUrl: "", category: CATEGORIES[1] },
  );
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.videoUrl.trim()) e.videoUrl = "Video URL is required";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  }

  function field(label, key, opts = {}) {
    const El = opts.textarea ? "textarea" : "input";
    return (
      <div>
        <label className="text-body-md font-medium text-on-surface block mb-1.5">
          {label}{opts.required && " *"}
        </label>
        <El
          type={opts.type || "text"}
          value={form[key]}
          onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
          placeholder={opts.placeholder || ""}
          maxLength={opts.maxLength}
          rows={opts.rows}
          className={`w-full px-4 py-2.5 rounded-lg text-body-md text-on-surface bg-surface-container border outline-none transition-colors placeholder:text-secondary resize-none ${errors[key] ? "border-error" : "border-surface-variant focus:border-on-surface"}`}
        />
        {errors[key] && <p className="text-error text-body-sm mt-1">{errors[key]}</p>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-variant sticky top-0 bg-surface-container-lowest">
          <h2 className="text-title-lg font-title-lg text-on-surface">
            {mode === "upload" ? "Upload Video" : "Edit Video"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {field("Title", "title", { required: true, placeholder: "Enter video title", maxLength: 100 })}
          {field("Description", "description", { textarea: true, rows: 3, placeholder: "Describe your video..." })}
          {field("Thumbnail URL", "thumbnailUrl", { placeholder: "https://..." })}
          {field("Video URL", "videoUrl", { required: true, placeholder: "https://..." })}

          <div>
            <label className="text-body-md font-medium text-on-surface block mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg text-body-md text-on-surface bg-surface-container border border-surface-variant outline-none focus:border-on-surface transition-colors"
            >
              {CATEGORIES.filter(c => c !== "All").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 hover:bg-surface-variant rounded-full text-body-md font-medium text-on-surface transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-on-surface text-surface-container-lowest rounded-full text-body-md font-medium hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-surface-container-lowest/40 border-t-surface-container-lowest rounded-full animate-spin" />}
              {mode === "upload" ? "Upload" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────── ChannelPage ───────────────────────── */
export default function ChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");
  const [sortBy, setSortBy] = useState("Latest");
  const [subscribed, setSubscribed] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [videoModal, setVideoModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/channels/${id}`)
      .then(({ data }) => {
        setChannel(data);
        setVideos(data.videos || []);
      })
      .catch(() => setChannel(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = !!(user && channel && String(channel.owner) === String(user._id));

  const sortedVideos = useMemo(() => {
    const v = [...videos];
    if (sortBy === "Latest") return v.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    if (sortBy === "Popular") return v.sort((a, b) => b.views - a.views);
    if (sortBy === "Oldest") return v.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
    return v;
  }, [videos, sortBy]);

  async function handleDeleteVideo(videoId) {
    if (!window.confirm("Delete this video?")) return;
    try {
      await api.delete(`/videos/${videoId}`);
      setVideos(prev => prev.filter(v => v._id !== videoId));
    } catch { /* ignore */ }
  }

  async function handleSaveVideo(form) {
    setSaving(true);
    try {
      if (videoModal.mode === "upload") {
        const { data } = await api.post("/videos", {
          ...form,
          channelId: id,
          channelName: channel.channelName,
          channelAvatarBg: channel.avatarBg,
          channelInitial: channel.initial,
          channelProfileUrl: channel.profileUrl || '',
        });
        setVideos(prev => [data, ...prev]);
      } else {
        const { data } = await api.put(`/videos/${videoModal.video._id}`, form);
        setVideos(prev => prev.map(v => v._id === videoModal.video._id ? data : v));
      }
      setVideoModal(null);
    } catch { /* ignore */ }
    finally { setSaving(false); }
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

  if (!channel) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header onToggleSidebar={() => {}} onSearch={() => {}} />
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <span className="material-symbols-outlined text-secondary text-[64px]">person_off</span>
          <h2 className="text-headline-md font-headline-md text-on-surface">Channel not found</h2>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-on-surface text-surface-container-lowest rounded-full text-body-md font-medium hover:opacity-80 transition-opacity">
            Go home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onToggleSidebar={() => setSidebarOpen(p => !p)}
        onSearch={(q) => { if (q) navigate(`/?search=${q}`); }}
      />

      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-0"}`}>

          {/* ── Channel Banner ── */}
          <div className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4">
            <div className="w-full h-28 sm:h-40 md:h-52 lg:h-[216px] bg-surface-container overflow-hidden rounded-xl">
              <img
                src={channel.bannerUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
          </div>

          {/* ── Channel Info Block ── */}
          <div className="px-4 md:px-8 lg:px-10 border-b border-surface-variant">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end pt-3 pb-4">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-[128px] lg:h-[128px] rounded-full overflow-hidden flex items-center justify-center text-white font-bold flex-shrink-0 -mt-12 sm:-mt-14 lg:-mt-20 border-[3px] border-background shadow-lg text-3xl sm:text-4xl lg:text-5xl"
                style={{ backgroundColor: channel.avatarBg }}
              >
                {channel.profileUrl ? (
                  <img src={channel.profileUrl} alt={channel.channelName} className="w-full h-full object-cover" />
                ) : (
                  channel.initial
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-on-surface leading-tight mb-1">
                  {channel.channelName}
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 text-body-sm text-secondary mb-2">
                  <span>{channel.handle}</span>
                  <span>•</span>
                  <span>{formatSubscribers(channel.subscribers + (subscribed ? 1 : 0))} subscribers</span>
                  <span>•</span>
                  <span>{videos.length.toLocaleString()} videos</span>
                </div>

                <div>
                  <p className={`text-body-sm text-secondary max-w-2xl whitespace-pre-wrap ${!descExpanded ? "line-clamp-2" : ""}`}>
                    {channel.description}
                  </p>
                  {channel.description && channel.description.length > 100 && (
                    <button
                      onClick={() => setDescExpanded(p => !p)}
                      className="text-body-sm font-medium text-on-surface hover:underline mt-0.5"
                    >
                      {descExpanded ? "Show less" : "...more"}
                    </button>
                  )}
                </div>

                {channel.links && channel.links.length > 0 && (
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="material-symbols-outlined text-[15px] text-secondary">link</span>
                    {channel.links.slice(0, 1).map((link, i) => (
                      <span key={i} className="text-body-sm text-blue-400 hover:underline cursor-pointer">{link}</span>
                    ))}
                    {channel.links.length > 1 && (
                      <span className="text-body-sm text-secondary">and {channel.links.length - 1} more link{channel.links.length > 2 ? "s" : ""}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 pb-1">
                {isOwner ? (
                  <>
                    <button
                      onClick={() => setVideoModal({ mode: "upload" })}
                      className="flex items-center gap-2 px-4 py-2 bg-on-surface text-surface-container-lowest rounded-full text-label-md font-label-md hover:opacity-85 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[18px]">upload</span>
                      Upload video
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-surface-variant text-on-surface rounded-full text-label-md font-label-md hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      Customize
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSubscribed(p => !p)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-label-md font-label-md transition-all ${subscribed ? "bg-surface-container-low border border-surface-variant text-on-surface hover:bg-surface-variant" : "bg-on-surface text-surface-container-lowest hover:opacity-85"}`}
                    >
                      {subscribed && <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>notifications_active</span>}
                      <span>{subscribed ? "Subscribed" : "Subscribe"}</span>
                      {subscribed && <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>}
                    </button>
                    <button className="px-4 py-2 bg-surface-container-low border border-surface-variant text-on-surface rounded-full text-label-md font-label-md hover:bg-surface-variant transition-colors">
                      Community
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── Tab Bar ── */}
            <div className="flex items-center overflow-x-auto no-scrollbar -mb-px">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-label-md font-label-md whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? "border-on-surface text-on-surface" : "border-transparent text-secondary hover:text-on-surface hover:bg-surface-variant/40"}`}
                >
                  {tab}
                </button>
              ))}
              <button className="ml-auto p-3 hover:bg-surface-variant rounded-full flex-shrink-0 transition-colors mb-px">
                <span className="material-symbols-outlined text-[20px] text-secondary">search</span>
              </button>
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="px-4 md:px-8 lg:px-10 py-6">
            {activeTab === "Videos" ? (
              <>
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  {["Latest", "Popular", "Oldest"].map(s => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`px-4 py-1.5 rounded-full text-label-md font-label-md transition-colors ${sortBy === s ? "bg-on-surface text-surface-container-lowest" : "bg-surface-container-low border border-surface-variant text-on-surface hover:bg-surface-variant"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {sortedVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
                    {sortedVideos.map(video => (
                      <ChannelVideoCard
                        key={video._id}
                        video={video}
                        isOwner={isOwner}
                        onEdit={(v) => setVideoModal({ mode: "edit", video: v })}
                        onDelete={handleDeleteVideo}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <span className="material-symbols-outlined text-secondary text-[64px] mb-4">video_library</span>
                    <h3 className="text-headline-md font-headline-md text-on-surface mb-2">No videos yet</h3>
                    <p className="text-body-md text-secondary max-w-sm">
                      {isOwner ? "Upload your first video to get started!" : "This channel hasn't uploaded any videos yet."}
                    </p>
                    {isOwner && (
                      <button
                        onClick={() => setVideoModal({ mode: "upload" })}
                        className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-on-surface text-surface-container-lowest rounded-full text-body-md font-medium hover:opacity-85 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-[18px]">upload</span>
                        Upload video
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="material-symbols-outlined text-secondary text-[64px] mb-4">construction</span>
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2">{activeTab}</h3>
                <p className="text-body-md text-secondary max-w-sm">This section is coming soon.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {videoModal && (
        <VideoModal
          mode={videoModal.mode}
          video={videoModal.video}
          onClose={() => setVideoModal(null)}
          onSave={handleSaveVideo}
          saving={saving}
        />
      )}
    </div>
  );
}
