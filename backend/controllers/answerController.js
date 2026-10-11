const mongoose = require("mongoose");
const Answer = require("../models/Answer");
const Question = require("../models/Question"); // L-1: moved to top-level

// Return true when id is a valid 24-char hex ObjectId (H-2)
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── createAnswer ────────────────────────────────────────────────────────────

const createAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const { questionId } = req.params;

    // M-2: reject blank content after trimming
    if (!content?.trim()) {
      return res.status(400).json({ message: "Answer content is required" });
    }

    // H-3: verify the parent question exists before creating the answer
    if (!isValidId(questionId)) {
      return res.status(404).json({ message: "Question not found" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = await Answer.create({
      content: content.trim(),
      question: questionId,
      author: req.user.userId,
    });

    res.status(201).json({
      message: "Answer created successfully",
      answer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── getAnswersByQuestion ────────────────────────────────────────────────────

const getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({
      question: req.params.questionId,
    })
      .populate("author", "name username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ answers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── updateAnswer ────────────────────────────────────────────────────────────

const updateAnswer = async (req, res) => {
  try {
    // H-2: guard against malformed ObjectIds
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const { content } = req.body;
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only update your own answer" });
    }

    answer.content = content || answer.content;
    await answer.save();

    res.status(200).json({ message: "Answer updated successfully", answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── deleteAnswer ────────────────────────────────────────────────────────────

const deleteAnswer = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own answer" });
    }

    await answer.deleteOne();

    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── acceptAnswer ────────────────────────────────────────────────────────────

const acceptAnswer = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const question = await Question.findById(answer.question);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Only the question author can accept an answer
    if (question.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Only the question author can accept an answer" });
    }

    // M-5: prevent the question author from accepting their own answer
    if (answer.author.toString() === req.user.userId) {
      return res.status(400).json({ message: "You cannot accept your own answer" });
    }

    // H-1: unset the previously accepted answer if there is one
    if (question.acceptedAnswer && question.acceptedAnswer.toString() !== answer._id.toString()) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
    }

    answer.isAccepted = true;
    await answer.save();

    question.acceptedAnswer = answer._id;
    await question.save();

    res.status(200).json({
      message: "Answer accepted successfully",
      answer,
      question,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── upvoteAnswer ────────────────────────────────────────────────────────────

const upvoteAnswer = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const userId = req.user.userId;

    // M-4: prevent self-voting
    if (answer.author.toString() === userId) {
      return res.status(400).json({ message: "You cannot vote on your own answer" });
    }

    const alreadyUpvoted = answer.upvotes.some((id) => id.toString() === userId);

    if (alreadyUpvoted) {
      answer.upvotes = answer.upvotes.filter((id) => id.toString() !== userId);
    } else {
      answer.upvotes.push(userId);
      answer.downvotes = answer.downvotes.filter((id) => id.toString() !== userId);
    }

    await answer.save();

    res.status(200).json({
      message: alreadyUpvoted ? "Answer upvote removed" : "Answer upvoted",
      upvotes: answer.upvotes.length,
      downvotes: answer.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── downvoteAnswer ──────────────────────────────────────────────────────────

const downvoteAnswer = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const userId = req.user.userId;

    // M-4: prevent self-voting
    if (answer.author.toString() === userId) {
      return res.status(400).json({ message: "You cannot vote on your own answer" });
    }

    const alreadyDownvoted = answer.downvotes.some((id) => id.toString() === userId);

    if (alreadyDownvoted) {
      answer.downvotes = answer.downvotes.filter((id) => id.toString() !== userId);
    } else {
      answer.downvotes.push(userId);
      answer.upvotes = answer.upvotes.filter((id) => id.toString() !== userId);
    }

    await answer.save();

    res.status(200).json({
      message: alreadyDownvoted ? "Answer downvote removed" : "Answer downvoted",
      upvotes: answer.upvotes.length,
      downvotes: answer.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  upvoteAnswer,
  downvoteAnswer,
};
