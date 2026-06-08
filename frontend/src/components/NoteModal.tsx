import { useState, useEffect, FormEvent } from 'react';
import { Note } from '../types';

interface Props {
  note?: Note | null;
  onSave: (title: string, content: string) => Promise<void>;
  onClose: () => void;
}

export default function NoteModal({ note, onSave, onClose }: Props) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(title, content);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative glass rounded-2xl p-6 w-full max-w-lg animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg">{note ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">Title</label>
            <input
              type="text" required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Give your note a title..." className="input-field" autoFocus
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">Content</label>
            <textarea
              required value={content} onChange={e => setContent(e.target.value)}
              placeholder="Write your note here..." rows={5}
              className="input-field resize-none"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
              {note ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
