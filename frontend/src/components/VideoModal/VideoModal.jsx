import { useState } from "react";
import { CATEGORIES } from "../../data/categories.js";

export default function VideoModal({ mode, video, onClose, onSave, saving }) {
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
