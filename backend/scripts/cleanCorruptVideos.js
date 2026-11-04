import mongoose from "mongoose";
import dotenv from "dotenv";
import Video from "../models/Video.js";
import { INITIAL_TOPIC_VIDEOS } from "../seed/topicVideosData.js";
import { isVideoRelevantToTopic } from "../utils/videoValidator.js";
import { CURRICULUM_TOPICS } from "../seed/curriculumData.js";

dotenv.config();

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://vs7403156_db_user:2otzz26aaBsgBCkS@cluster0.hvap95j.mongodb.net/student-platform?appName=Cluster0";

async function cleanAndSyncVideos() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  // 1. Upsert all INITIAL_TOPIC_VIDEOS so verified videos are guaranteed to be correct
  console.log(`Seeding/Updating ${INITIAL_TOPIC_VIDEOS.length} verified topic videos...`);
  for (const item of INITIAL_TOPIC_VIDEOS) {
    await Video.findOneAndUpdate(
      { topicId: item.topicId },
      { $set: item },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ Updated verified: ${item.topicId} -> "${item.title}"`);
  }

  // 2. Scan all existing videos in DB and delete any that have obvious mismatches
  const allVideos = await Video.find({}).lean();
  console.log(`\nAuditing ${allVideos.length} total videos in database for relevance...`);

  let removedCount = 0;
  for (const v of allVideos) {
    // If it's one of the verified initial topics, we already updated it above
    const isSeed = INITIAL_TOPIC_VIDEOS.some((s) => s.topicId === v.topicId);
    if (isSeed) continue;

    const topicMeta = CURRICULUM_TOPICS.find((t) => t.topicId === v.topicId);
    if (topicMeta) {
      const isRel = isVideoRelevantToTopic(
        {
          topicTitle: topicMeta.title,
          subtopics: topicMeta.subtopics || [],
          subjectName: topicMeta.subjectId || "",
        },
        v.title
      );

      if (!isRel) {
        console.log(`  ✗ Removing mismatched video: ${v.topicId} | "${v.title}" (${v.videoUrl})`);
        await Video.deleteOne({ _id: v._id });
        removedCount++;
      }
    }
  }

  console.log(`\nCleanup complete! Removed ${removedCount} mismatched records.`);
  await mongoose.disconnect();
}

cleanAndSyncVideos().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});

