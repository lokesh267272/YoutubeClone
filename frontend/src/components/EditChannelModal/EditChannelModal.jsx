import { useState } from 'react';
import api from '../../api/axios.js';

const AVATAR_COLORS = [
  '#4d96ff', '#ff6b6b', '#6bcb77', '#ffd93d',
  '#c77dff', '#00b4d8', '#ff9a3c', '#f72585',
];

const inputBase = "w-full px-4 py-3 rounded-xl text-body-md text-on-surface bg-surface-container border outline-none transition-all placeholder:text-secondary/60 border-surface-variant focus:border-primary focus:bg-surface-container-low";

export default function EditChannelModal({ channel, onClose, onSave }) {
  const [form, setForm] = useState({
    channelName: channel.channelName || '',
    handle: channel.handle || '',
    description: channel.description || '',
    bannerUrl: channel.bannerUrl || '',
    profileUrl: channel.profileUrl || '',
    avatarBg: channel.avatarBg || AVATAR_COLORS[0],
    links: channel.links?.length ? [...channel.links] : [''],
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  function set(key, val) {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  }

  function setLink(i, val) {
    const next = [...form.links];
    next[i] = val;
    setForm(p => ({ ...p, links: next }));
  }

  function addLink() {
    if (form.links.length >= 5) return;
    setForm(p => ({ ...p, links: [...p.links, ''] }));
  }

  function removeLink(i) {
    setForm(p => ({ ...p, links: p.links.filter((_, idx) => idx !== i) }));
  }

  function validate() {
    const e = {};
    if (!form.channelName.trim()) e.channelName = 'Channel name is required';
    if (!form.handle.trim() || form.handle.trim() === '@') e.handle = 'Handle is required';
    return e;
  }

  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        links: form.links.map(l => l.trim()).filter(Boolean),
      };
      const { data } = await api.put(`/channels/${channel._id}`, payload);
      onSave(data);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.';
      setErrors({ server: msg });
    } finally {
      setSaving(false);
    }
  }

  const initial = form.channelName.trim() ? form.channelName.trim()[0].toUpperCase() : '?';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-variant">
          <h2 className="text-title-lg font-title-lg text-on-surface">Edit channel</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
            <span className="material-symbols-outlined text-secondary">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md transition-colors duration-200 overflow-hidden"
              style={{ backgroundColor: form.avatarBg }}
            >
              {form.profileUrl ? (
                <img src={form.profileUrl} alt="" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none'; }} />
              ) : initial}
            </div>
            <div className="flex items-center gap-2">
              {AVATAR_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => set('avatarBg', color)}
                  className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: form.avatarBg === color ? 'white' : 'transparent',
                    outline: form.avatarBg === color ? `2px solid ${color}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Channel name */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-body-md font-medium text-on-surface">Channel name <span className="text-error">*</span></label>
              <span className={`text-body-sm tabular-nums ${form.channelName.length > 90 ? 'text-error' : 'text-secondary'}`}>{form.channelName.length}/100</span>
            </div>
            <input
              type="text"
              value={form.channelName}
              onChange={e => set('channelName', e.target.value)}
              placeholder="Your channel name"
              maxLength={100}
              className={`${inputBase} ${errors.channelName ? '!border-error !bg-error/5' : ''}`}
            />
            {errors.channelName && (
              <p className="text-error text-body-sm mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.channelName}
              </p>
            )}
          </div>

          {/* Handle */}
          <div>
            <label className="text-body-md font-medium text-on-surface block mb-2">Handle <span className="text-error">*</span></label>
            <input
              type="text"
              value={form.handle}
              onChange={e => {
                let val = e.target.value;
                if (!val.startsWith('@')) val = '@' + val.replace(/^@+/, '');
                set('handle', val);
              }}
              placeholder="@yourhandle"
              className={`${inputBase} ${errors.handle ? '!border-error !bg-error/5' : ''}`}
            />
            {errors.handle && (
              <p className="text-error text-body-sm mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.handle}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-body-md font-medium text-on-surface">Description</label>
              <span className="text-body-sm tabular-nums text-secondary">{form.description.length}/500</span>
            </div>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Tell viewers about your channel..."
              rows={3}
              maxLength={500}
              className={`${inputBase} resize-none`}
            />
          </div>

          {/* Profile picture URL */}
          <div>
            <label className="text-body-md font-medium text-on-surface block mb-2">Profile picture URL</label>
            <input
              type="text"
              value={form.profileUrl}
              onChange={e => set('profileUrl', e.target.value)}
              placeholder="https://..."
              className={inputBase}
            />
          </div>

          {/* Banner URL */}
          <div>
            <label className="text-body-md font-medium text-on-surface block mb-2">Banner URL</label>
            <input
              type="text"
              value={form.bannerUrl}
              onChange={e => { set('bannerUrl', e.target.value); setBannerError(false); }}
              placeholder="https://..."
              className={inputBase}
            />
            {form.bannerUrl && !bannerError && (
              <img
                src={form.bannerUrl}
                alt="Banner preview"
                className="mt-2 w-full h-20 object-cover rounded-xl border border-surface-variant"
                onError={() => setBannerError(true)}
              />
            )}
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-body-md font-medium text-on-surface">Links</label>
              {form.links.length < 5 && (
                <button onClick={addLink} className="text-body-sm text-primary hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Add link
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {form.links.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link}
                    onChange={e => setLink(i, e.target.value)}
                    placeholder="https://..."
                    className={`${inputBase} flex-1`}
                  />
                  <button
                    onClick={() => removeLink(i)}
                    className="p-2 hover:bg-surface-variant rounded-full transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {errors.server && (
            <p className="text-error text-body-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {errors.server}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-surface-variant">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 hover:bg-surface-variant rounded-full text-body-md font-medium text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-on-surface text-surface-container-lowest rounded-full text-body-md font-medium hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <span className="w-4 h-4 border-2 border-surface-container-lowest/40 border-t-surface-container-lowest rounded-full animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
