import UserNote from "../models/UserNote.js";

// @desc Get all notes for a specific topic
// @route GET /api/notes/:topicId
export const getNotesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?.id || req.user?._id || req.query.userId || "demo-student-id";

    const notes = await UserNote.find({ userId, topicId }).sort({ updatedAt: -1 });
    return res.json({ success: true, notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch notes" });
  }
};

// @desc Create a new note for a topic
// @route POST /api/notes
export const createNote = async (req, res) => {
  try {
    const { topicId, title, content, tags } = req.body;
    const userId = req.user?.id || req.user?._id || req.body.userId || "demo-student-id";

    if (!topicId || !content) {
      return res.status(400).json({ success: false, message: "topicId and content are required" });
    }

    const note = await UserNote.create({
      userId,
      topicId,
      title: title || "My Personal Note",
      content,
      tags: tags || [],
    });

    return res.status(201).json({ success: true, note });
  } catch (err) {
    console.error("Error creating note:", err);
    return res.status(500).json({ success: false, message: "Failed to create note" });
  }
};

// @desc Update an existing note
// @route PUT /api/notes/:id
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const userId = req.user?.id || req.user?._id || req.body.userId || "demo-student-id";

    const note = await UserNote.findOneAndUpdate(
      { _id: id, userId },
      { title, content, tags },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found or unauthorized" });
    }

    return res.json({ success: true, note });
  } catch (err) {
    console.error("Error updating note:", err);
    return res.status(500).json({ success: false, message: "Failed to update note" });
  }
};

// @desc Delete a note
// @route DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id || req.query.userId || "demo-student-id";

    const note = await UserNote.findOneAndDelete({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found or unauthorized" });
    }

    return res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    return res.status(500).json({ success: false, message: "Failed to delete note" });
  }
};
