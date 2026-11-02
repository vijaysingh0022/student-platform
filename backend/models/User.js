import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, unique: true, sparse: true },
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Supports password or passwordHash
    password: { type: String, default: null },
    passwordHash: { type: String, default: null },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    profileImage: {
      type: String,
      default: "",
    },
    college: {
      type: String,
      default: "LearnX Institute of Technology",
    },
    course: {
      type: String,
      default: "B.Tech CSE",
    },
    department: {
      type: String,
      default: "Computer Science & Engineering",
    },
    year: {
      type: String,
      default: "3rd Year",
    },
    semester: {
      type: String,
      default: "6th Semester",
    },
    batch: {
      type: String,
      default: "2022-2026",
    },
    rollNo: {
      type: String,
      default: "",
    },
    attendanceRate: {
      type: Number,
      default: 85,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Check either password or passwordHash modification
  if (this.isModified("password") && this.password && !this.password.startsWith("$2")) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    this.passwordHash = hash;
  } else if (this.isModified("passwordHash") && this.passwordHash && !this.passwordHash.startsWith("$2")) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.passwordHash, salt);
    this.password = hash;
    this.passwordHash = hash;
  }
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  const hashToCompare = this.passwordHash || this.password;
  if (!hashToCompare) return false;
  return await bcrypt.compare(enteredPassword, hashToCompare);
};

const User = mongoose.model("User", userSchema);
export default User;

