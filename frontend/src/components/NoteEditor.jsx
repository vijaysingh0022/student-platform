import React, { useState, useEffect } from "react";
import api from "../services/api.js";

export default function NoteEditor({ topicId, topicTitle }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [topicId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/notes/${topicId}`);
      if (res.data?.notes) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setSaving(true);
    try {
      const res = await api.post("/notes", {
        topicId,
        title: newTitle.trim() || `${topicTitle || "Topic"} Note`,
        content: newContent.trim(),
      });

      if (res.data?.note) {
        setNotes([res.data.note, ...notes]);
        setNewTitle("");
        setNewContent("");
      }
    } catch (err) {
      console.error("Error creating note:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNote = async (id) => {
    if (!editContent.trim()) return;

    setSaving(true);
    try {
      const res = await api.put(`/notes/${id}`, {
        title: editTitle,
        content: editContent,
      });

      if (res.data?.note) {
        setNotes(notes.map((n) => (n._id === id ? res.data.note : n)));
        setEditingId(null);
      }
    } catch (err) {
      console.error("Error updating note:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>📓</span>
            <span>Personal Study Notes</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Create, edit, and save your custom revision notes for {topicTitle || "this topic"}.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-black">
          {notes.length} Notes Saved
        </span>
      </div>

      {/* Note Creation Form */}
      <form onSubmit={handleCreateNote} className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
        <input
          type="text"
          placeholder="Note Title (e.g. Quick Sort Partition Step Summary)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />

        <textarea
          rows={3}
          placeholder="Write your personal notes, key formulas, or insights here..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full p-3.5 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !newContent.trim()}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
          >
            <span>{saving ? "Saving..." : "💾 Save Note"}</span>
          </button>
        </div>
      </form>

      {/* Saved Notes List */}
      {loading ? (
        <div className="text-center py-6 text-xs font-bold text-slate-400">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8 text-xs font-medium text-slate-400 border border-dashed border-slate-200 rounded-2xl">
          No notes saved for this topic yet. Write your first note above!
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              {editingId === note._id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateNote(note._id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{note.title}</h4>
                      <span className="text-[10px] font-medium text-slate-400">
                        Saved on {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingId(note._id);
                          setEditTitle(note.title);
                          setEditContent(note.content);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
