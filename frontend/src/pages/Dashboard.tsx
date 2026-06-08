import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Note } from '../types';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = debouncedSearch ? { search: debouncedSearch } : {};
      const res = await api.get('/notes', { params });
      setNotes(res.data.data);
    } catch {
      showToast('Failed to load notes', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleSave = async (title: string, content: string) => {
    try {
      if (editingNote) {
        await api.patch(`/notes/${editingNote.id}`, { title, content });
        showToast('Note updated');
      } else {
        await api.post('/notes', { title, content });
        showToast('Note created');
      }
      setModalOpen(false);
      setEditingNote(null);
      fetchNotes();
    } catch {
      showToast('Failed to save note', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      showToast('Note deleted');
      fetchNotes();
    } catch {
      showToast('Failed to delete note', 'error');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl animate-slide-up
          ${toast.type === 'success' ? 'bg-jade-500/20 text-jade-400 border border-jade-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
          {toast.msg}
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-semibold tracking-tight">NoteVault</span>
            <span className={isAdmin ? 'tag-admin' : 'tag-user'}>{user?.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 hidden sm:block">{user?.email}</span>
            <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost text-sm flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {isAdmin ? 'All Notes' : 'My Notes'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isAdmin ? 'Viewing all notes across all users' : 'Your personal notes'}
            </p>
          </div>
          <button
            onClick={() => { setEditingNote(null); setModalOpen(true); }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..." className="input-field pl-9 max-w-sm"
          />
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-4 h-32 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/5 rounded w-full mb-1" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-ink-700/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">{search ? 'No notes match your search' : 'No notes yet'}</p>
            <p className="text-slate-600 text-sm mt-1">
              {search ? 'Try a different search term' : 'Create your first note to get started'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(note => (
              <NoteCard
                key={note.id} note={note}
                isAdmin={isAdmin}
                currentUserId={user?.id || ''}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <NoteModal
          note={editingNote}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingNote(null); }}
        />
      )}
    </div>
  );
}
