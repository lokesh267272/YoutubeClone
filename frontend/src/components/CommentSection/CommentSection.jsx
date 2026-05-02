import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate } from '../../data/mockData.js';
import api from '../../api/axios.js';

const AVATAR_COLORS = ['#4d96ff', '#ffd93d', '#6bcb77', '#c77dff', '#ff6b6b', '#ff9a3c', '#00b4d8', '#f72585'];

function getAvatarColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash += username.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function CommentAvatar({ username, size = 'w-10 h-10' }) {
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ backgroundColor: getAvatarColor(username) }}
    >
      {username[0]?.toUpperCase()}
    </div>
  );
}

function CommentItem({ comment, currentUser, onEdit, onDelete }) {
  const isOwn = currentUser && String(comment.userId) === String(currentUser._id);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex gap-3 group">
      <CommentAvatar username={comment.username} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-title-sm font-title-sm text-on-surface">
            @{comment.username}
          </span>
          <span className="text-body-sm text-secondary">
            {formatDate(comment.createdAt)}
          </span>
          {isOwn && (
            <span className="text-label-md font-label-md text-primary ml-1">(you)</span>
          )}
        </div>

        <p className="text-body-md text-on-surface mb-2 whitespace-pre-wrap break-words">
          {comment.text}
        </p>

        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 hover:bg-surface-variant px-2 py-1 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[18px] text-on-surface">thumb_up</span>
          </button>
          <button className="flex items-center p-2 hover:bg-surface-variant rounded-full transition-colors">
            <span className="material-symbols-outlined text-[18px] text-on-surface">thumb_down</span>
          </button>
          {isOwn && (
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(p => !p)}
                className="p-1.5 hover:bg-surface-variant rounded-full transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">more_vert</span>
              </button>
              {menuOpen && (
                <div className="absolute left-0 top-8 w-36 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => { onEdit(comment); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-body-md text-on-surface hover:bg-surface-variant transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => { onDelete(comment._id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-body-md text-error hover:bg-error-container/30 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ videoId }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/comments/${videoId}`)
      .then(({ data }) => setComments(data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [videoId]);

  async function handleAddComment() {
    if (!user) { navigate('/login'); return; }
    if (!newText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/comments/${videoId}`, { text: newText.trim() });
      setComments(prev => [data, ...prev]);
      setNewText('');
      setInputFocused(false);
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  }

  async function handleSaveEdit(id) {
    if (!editText.trim()) return;
    try {
      const { data } = await api.put(`/comments/${videoId}/${id}`, { text: editText.trim() });
      setComments(prev => prev.map(c => c._id === id ? data : c));
      setEditingId(null);
      setEditText('');
    } catch { /* ignore */ }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${videoId}/${id}`);
      setComments(prev => prev.filter(c => c._id !== id));
    } catch { /* ignore */ }
  }

  function handleStartEdit(comment) {
    setEditingId(comment._id);
    setEditText(comment.text);
  }

  function handleCancel() {
    setNewText('');
    setInputFocused(false);
  }

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <h2 className="text-headline-md font-headline-md text-on-surface">
          {comments.length.toLocaleString()} Comments
        </h2>
        <button className="flex items-center gap-2 text-on-surface hover:text-secondary transition-colors">
          <span className="material-symbols-outlined text-[20px]">sort</span>
          <span className="text-label-md font-label-md">Sort by</span>
        </button>
      </div>

      {/* Add comment */}
      {user ? (
        <div className="flex gap-4 mb-8">
          <CommentAvatar username={user.username} />
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleAddComment(); }}
              placeholder="Add a comment…"
              className="w-full bg-transparent border-b border-surface-variant focus:border-on-surface outline-none py-2 text-body-md text-on-surface transition-colors placeholder:text-secondary"
            />
            {inputFocused && (
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 hover:bg-surface-variant rounded-full text-label-md font-label-md transition-colors text-on-surface"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!newText.trim() || submitting}
                  className="px-4 py-2 bg-on-surface text-surface-container-lowest rounded-full text-label-md font-label-md disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all flex items-center gap-2"
                >
                  {submitting && (
                    <span className="w-3 h-3 border-2 border-surface-container-lowest/40 border-t-surface-container-lowest rounded-full animate-spin" />
                  )}
                  Comment
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-8 p-4 bg-surface-container-low rounded-xl border border-surface-variant">
          <span className="material-symbols-outlined text-secondary">account_circle</span>
          <span className="text-body-md text-secondary flex-1">Sign in to add a comment</span>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 border border-outline rounded-full text-label-md font-label-md text-primary hover:bg-primary-fixed/20 transition-colors"
          >
            Sign in
          </button>
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-surface-container flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 bg-surface-container rounded w-32" />
                <div className="h-4 bg-surface-container rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {comments.map(comment => (
            editingId === comment._id ? (
              <div key={comment._id} className="flex gap-3">
                <CommentAvatar username={comment.username} />
                <div className="flex-1">
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    autoFocus
                    rows={3}
                    className="w-full bg-transparent border-b border-on-surface outline-none py-2 text-body-md text-on-surface resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 hover:bg-surface-variant rounded-full text-label-md font-label-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(comment._id)}
                      disabled={!editText.trim()}
                      className="px-4 py-2 bg-on-surface text-surface-container-lowest rounded-full text-label-md font-label-md disabled:opacity-40 hover:opacity-90 transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUser={user}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}
