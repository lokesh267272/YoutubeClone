import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const AVATAR_COLORS = [
  '#4d96ff', '#ff6b6b', '#6bcb77', '#ffd93d',
  '#c77dff', '#00b4d8', '#ff9a3c', '#f72585',
];

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6);
}

function isValidUrl(str) {
  try { return Boolean(new URL(str)); } catch { return false; }
}

export default function CreateChannelModal({ onClose }) {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.username || '');
  const [handle, setHandle] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [profileImgError, setProfileImgError] = useState(false);
  const [avatarColor, setAvatarColor] = useState(user?.avatarBg || AVATAR_COLORS[0]);
  const [handleEdited, setHandleEdited] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!handleEdited && name.trim()) {
      setHandle(`@${slugify(name.trim())}-${randomSuffix()}`);
    }
  }, [name, handleEdited]);

  function handleNameChange(e) {
    setName(e.target.value);
    setError('');
  }

  function handleHandleChange(e) {
    setHandleEdited(true);
    let val = e.target.value;
    if (!val.startsWith('@')) val = '@' + val.replace(/^@+/, '');
    setHandle(val);
    setError('');
  }

  function handleProfileUrlChange(e) {
    setProfileUrl(e.target.value);
    setProfileImgError(false);
  }

  const showProfileImg = profileUrl.trim() && isValidUrl(profileUrl.trim()) && !profileImgError;

  async function handleCreate() {
    const trimmedName = name.trim();
    const trimmedHandle = handle.trim();

    if (!trimmedName) { setError('Channel name is required.'); return; }
    if (trimmedName.length > 100) { setError('Name must be under 100 characters.'); return; }
    if (!trimmedHandle || trimmedHandle === '@') { setError('Handle is required.'); return; }

    setSaving(true);
    try {
      const { data: channel } = await api.post('/channels', {
        channelName: trimmedName,
        handle: trimmedHandle,
        avatarBg: avatarColor,
        initial: trimmedName[0].toUpperCase(),
        description: '',
        links: [],
        bannerUrl: bannerUrl.trim(),
        profileUrl: showProfileImg ? profileUrl.trim() : '',
      });
      updateUser({ channelId: channel._id });
      onClose();
      navigate(`/channel/${channel._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const initial = name.trim() ? name.trim()[0].toUpperCase() : '?';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-surface-variant">
          <h2 className="text-title-lg font-title-lg text-on-surface">How you'll appear</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-variant rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col items-center gap-6">

          {/* Avatar preview + color picker */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md transition-colors duration-200 overflow-hidden"
              style={{ backgroundColor: avatarColor }}
            >
              {showProfileImg ? (
                <img
                  src={profileUrl.trim()}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={() => setProfileImgError(true)}
                />
              ) : initial}
            </div>

            <div className="flex items-center gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setAvatarColor(color)}
                  className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: avatarColor === color ? 'white' : 'transparent',
                    outline: avatarColor === color ? `2px solid ${color}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-body-sm text-secondary">Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                maxLength={100}
                className="w-full border border-surface-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface bg-surface-container focus:outline-none focus:border-secondary transition-colors"
                placeholder="Your channel name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-body-sm text-secondary">Handle</label>
              <input
                type="text"
                value={handle}
                onChange={handleHandleChange}
                className="w-full border border-surface-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface bg-surface-container focus:outline-none focus:border-secondary transition-colors"
                placeholder="@yourhandle"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-body-sm text-secondary">
                Profile picture URL <span className="text-on-surface-variant">(optional)</span>
              </label>
              <input
                type="text"
                value={profileUrl}
                onChange={handleProfileUrlChange}
                className="w-full border border-surface-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface bg-surface-container focus:outline-none focus:border-secondary transition-colors"
                placeholder="https://example.com/avatar.jpg"
              />
              {profileUrl.trim() && !isValidUrl(profileUrl.trim()) && (
                <p className="text-body-sm text-secondary mt-0.5">Not a valid URL — your initial will be used instead.</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-body-sm text-secondary">Banner image URL <span className="text-on-surface-variant">(optional)</span></label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full border border-surface-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface bg-surface-container focus:outline-none focus:border-secondary transition-colors"
                placeholder="https://example.com/banner.jpg"
              />
              {bannerUrl.trim() && (
                <img
                  src={bannerUrl.trim()}
                  alt="Banner preview"
                  className="mt-1 w-full h-20 object-cover rounded-lg border border-surface-variant"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  onLoad={(e) => { e.currentTarget.style.display = ''; }}
                />
              )}
            </div>

            {error && <p className="text-body-sm text-error">{error}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-body-md text-on-surface hover:bg-surface-variant transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || saving}
            className="px-5 py-2 rounded-full text-body-md font-medium bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <span className="w-4 h-4 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />}
            Create channel
          </button>
        </div>
      </div>
    </div>
  );
}
