const mongoose = require("mongoose");
const Question = require("../models/Question");

// ─── Helpers ────────────────────────────────────────────────────────────────

// Escape special regex characters in user-supplied strings (C-3 / ReDoS fix)
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Return true when id is a valid 24-char hex ObjectId (H-2)
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── createQuestion ──────────────────────────────────────────────────────────

const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    // M-1: reject blank title / description after trimming
    if (!title?.trim()) {
      return res.status(400).json({ message: "Question title is required" });
    }
    if (!description?.trim()) {
      return res.status(400).json({ message: "Question description is required" });
    }

    const question = await Question.create({
      author: req.user.userId,
      title: title.trim(),
      description: description.trim(),
      tags,
    });

    res.status(201).json({
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── getQuestions ────────────────────────────────────────────────────────────

const getQuestions = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;

    // M-3: cap limit to 50 to prevent full-collection dumps
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (Number(page) - 1) * limit;

    let filter = {};
    if (search) {
      // C-3: escape user input before embedding in regex
      const escaped = escapeRegex(search.trim());
      filter = {
        $or: [
          { title: { $regex: escaped, $options: "i" } },
          { description: { $regex: escaped, $options: "i" } },
          { tags: { $regex: escaped, $options: "i" } },
        ],
      };
    }

    const questions = await Question.find(filter)
      .populate("author", "name username profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalQuestions = await Question.countDocuments(filter);
    const totalPages = Math.ceil(totalQuestions / limit);

    res.status(200).json({
      questions,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalQuestions,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── getQuestionById ─────────────────────────────────────────────────────────

const getQuestionById = async (req, res) => {
  try {
    // H-2: catch malformed ObjectIds before hitting the database
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Question not found" });
    }

    // H-4: find first, then increment views only on a confirmed hit
    const question = await Question.findById(req.params.id).populate(
      "author",
      "name username profilePic"
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.views = (question.views || 0) + 1;
    await question.save();

    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── updateQuestion ──────────────────────────────────────────────────────────

const updateQuestion = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Question not found" });
    }

    const { title, description, tags } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only update your own question" });
    }

    question.title = title || question.title;
    question.description = description || question.description;
    question.tags = tags || question.tags;

    await question.save();

    res.status(200).json({ message: "Question updated successfully", question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── deleteQuestion ──────────────────────────────────────────────────────────

const deleteQuestion = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Question not found" });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own question" });
    }

    await question.deleteOne();

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── upvoteQuestion ──────────────────────────────────────────────────────────

const upvoteQuestion = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Question not found" });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const userId = req.user.userId;

    // M-4: prevent self-voting
    if (question.author.toString() === userId) {
      return res.status(400).json({ message: "You cannot vote on your own question" });
    }

    const alreadyUpvoted = question.upvotes.some((id) => id.toString() === userId);

    if (alreadyUpvoted) {
      question.upvotes = question.upvotes.filter((id) => id.toString() !== userId);
    } else {
      question.upvotes.push(userId);
      question.downvotes = question.downvotes.filter((id) => id.toString() !== userId);
    }

    await question.save();

    res.status(200).json({
      message: alreadyUpvoted ? "Question upvote removed" : "Question upvoted",
      upvotes: question.upvotes.length,
      downvotes: question.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── downvoteQuestion ────────────────────────────────────────────────────────

const downvoteQuestion = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Question not found" });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const userId = req.user.userId;

    // M-4: prevent self-voting
    if (question.author.toString() === userId) {
      return res.status(400).json({ message: "You cannot vote on your own question" });
    }

    const alreadyDownvoted = question.downvotes.some((id) => id.toString() === userId);

    if (alreadyDownvoted) {
      question.downvotes = question.downvotes.filter((id) => id.toString() !== userId);
    } else {
      question.downvotes.push(userId);
      question.upvotes = question.upvotes.filter((id) => id.toString() !== userId);
    }

    await question.save();

    res.status(200).json({
      message: alreadyDownvoted ? "Question downvote removed" : "Question downvoted",
      upvotes: question.upvotes.length,
      downvotes: question.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── getTags ─────────────────────────────────────────────────────────────────

const getTags = async (req, res) => {
  try {
    const tags = await Question.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: { $toLower: "$tags" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json({ tags });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  upvoteQuestion,
  downvoteQuestion,
  getTags,
};
