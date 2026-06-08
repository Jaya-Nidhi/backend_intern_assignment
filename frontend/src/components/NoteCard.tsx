import { useState } from 'react';
import { Note } from '../types';

interface Props {
  note: Note;
  isAdmin: boolean;
  currentUserId: string;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export default function NoteCard({ note, isAdmin, currentUserId, onDelete, onEdit }: Props) {
  const [confirming, setConfirming] = useState(false);
  const canModify = note.userId === currentUserId || isAdmin;

  const date = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="glass rounded-xl p-4 animate-scale-in group glass-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-100 truncate">{note.title}</h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">{note.content}</p>
        </div>
        {canModify && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
              title="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {!confirming ? (
              <button
                onClick={() => setConfirming(true)}
                className="p-1.5 rounded-md hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                title="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            ) : (
              <div className="flex gap-1">
                <button onClick={() => onDelete(note.id)} className="p-1.5 rounded-md bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors text-xs font-medium px-2">
                  Delete
                </button>
                <button onClick={() => setConfirming(false)} className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 text-xs font-medium px-2 transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className="text-xs text-slate-600 font-mono">{date}</span>
        {note.user && isAdmin && (
          <span className="text-xs text-slate-500 truncate max-w-[140px]">{note.user.email}</span>
        )}
      </div>
    </div>
  );
}
