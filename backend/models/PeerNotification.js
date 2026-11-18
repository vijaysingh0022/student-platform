import mongoose from "mongoose";

const peerNotificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderName: { type: String, default: "LearnX Community" },
    type: {
      type: String,
      enum: [
        "group_invite",
        "join_request",
        "join_approved",
        "new_reply",
        "challenge_assigned",
        "challenge_completed",
        "announcement",
        "badge_earned",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: "/community" },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "StudyGroup" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

peerNotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const PeerNotification = mongoose.model("PeerNotification", peerNotificationSchema);
export default PeerNotification;

