import User from "../models/User.js";
import TestResult from "../models/TestResult.js";
import CareerProfile from "../models/CareerProfile.js";

// @desc Get Admin Dashboard high-level metrics
// @route GET /api/admin/dashboard
// @access Private (Admin only)
export const getAdminDashboardMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await User.countDocuments({ role: { $in: ["admin", "teacher"] } });
    const activeUsers = await User.countDocuments({ isActive: { $ne: false } });

    // Count registrations in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newRegistrationsThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Recent 10 users
    const recentUsers = await User.find()
      .select("-password -passwordHash")
      .sort({ createdAt: -1 })
      .limit(10);

    // Tests count
    const totalTestsTaken = await TestResult.countDocuments();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalAdmins,
        activeUsers,
        newRegistrationsThisMonth,
        totalTestsTaken,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all registered users with filtering, search, and pagination
// @route GET /api/admin/users
// @access Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const {
      search = "",
      role = "All",
      department = "All",
      college = "All",
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 100,
    } = req.query;

    const filter = {};

    if (role && role !== "All") {
      filter.role = role.toLowerCase();
    }
    if (department && department !== "All") {
      filter.department = department;
    }
    if (college && college !== "All") {
      filter.college = college;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { rollNo: { $regex: q, $options: "i" } },
        { college: { $regex: q, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -passwordHash")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit, 10)),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      users,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single user details
// @route GET /api/admin/users/:id
// @access Private (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -passwordHash");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const [tests, career] = await Promise.all([
      TestResult.find({ user: user._id }).sort({ createdAt: -1 }),
      CareerProfile.findOne({ user: user._id }),
    ]);

    res.json({
      success: true,
      user,
      tests,
      career,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update user role or details
// @route PUT /api/admin/users/:id
// @access Private (Admin only)
export const updateUser = async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "role",
      "college",
      "course",
      "department",
      "year",
      "semester",
      "batch",
      "rollNo",
      "attendanceRate",
      "isActive",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -passwordHash");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete user
// @route DELETE /api/admin/users/:id
// @access Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin" && user.email === "admin@learnx.ai") {
      return res.status(400).json({ success: false, message: "Cannot delete master admin account" });
    }

    await User.findByIdAndDelete(req.params.id);
    await TestResult.deleteMany({ user: req.params.id });

    res.json({
      success: true,
      message: "User and associated records removed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
