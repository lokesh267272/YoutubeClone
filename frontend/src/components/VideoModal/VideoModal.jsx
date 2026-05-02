import { useState } from "react";
import { CATEGORIES } from "../../data/categories.js";

export default function VideoModal({ mode, video, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    // Reuse the same form for both creating a video and editing an existing one.
    video
      ? { title: video.title, description: video.description, thumbnailUrl: video.thumbnailUrl, videoUrl: video.videoUrl, category: video.category }
      : { title: "", description: "", thumbnailUrl: "", videoUrl: "", category: CATEGORIES[1] },
  );
  const [errors, setErrors] = useState({});

  function validate() {
    // Keep validation minimal here and let the backend handle deeper checks.
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.videoUrl.trim()) e.videoUrl = "Video URL is required";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    // Pass the cleaned form state back to the parent save handler.
    onSave(form);
  }

  function set(key, val) {
    // Update one field at a time and clear its old error immediately.
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  }

  const inputBase = "w-full px-4 py-3 rounded-xl text-body-md text-on-surface bg-surface-container border outline-none transition-all placeholder:text-secondary/60";
  const inputNormal = `${inputBase} border-surface-variant focus:border-primary focus:bg-surface-container-low`;
  const inputError = `${inputBase} border-error focus:border-error bg-error/5`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-variant">
          <h2 className="text-title-lg font-title-lg text-on-surface">
            {mode === "upload" ? "Upload Video" : "Edit Video"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
            <span className="material-symbols-outlined text-secondary">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-body-md font-medium text-on-surface">
                Title <span className="text-error">*</span>
              </label>
              <span className={`text-body-sm tabular-nums ${form.title.length > 90 ? "text-error" : "text-secondary"}`}>
                {form.title.length}/100
              </span>
            </div>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="Enter video title"
              maxLength={100}
              className={errors.title ? inputError : inputNormal}
            />
            {errors.title && (
              <p className="text-error text-body-sm mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.title}
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
              onChange={e => set("description", e.target.value)}
              placeholder="Describe your video..."
              rows={3}
              maxLength={500}
              className={`${inputNormal} resize-none`}
            />
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="text-body-md font-medium text-on-surface block mb-2">Thumbnail URL</label>
            <input
              type="text"
              value={form.thumbnailUrl}
              onChange={e => set("thumbnailUrl", e.target.value)}
              placeholder="https://..."
              className={inputNormal}
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="text-body-md font-medium text-on-surface block mb-2">
              Video URL <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.videoUrl}
              onChange={e => set("videoUrl", e.target.value)}
              placeholder="https://..."
              className={errors.videoUrl ? inputError : inputNormal}
            />
            {errors.videoUrl && (
              <p className="text-error text-body-sm mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.videoUrl}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-body-md font-medium text-on-surface block mb-2">Category</label>
            <select
              value={form.category}
              onChange={e => set("category", e.target.value)}
              className={`${inputNormal} cursor-pointer`}
            >
              {/* The filter-only "All" option should not be saved on a video. */}
              {CATEGORIES.filter(c => c !== "All").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 hover:bg-surface-variant rounded-full text-body-md font-medium text-on-surface transition-colors"
            >
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
