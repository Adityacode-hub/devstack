const Question = require("../models/Question");

const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const question = await Question.create({
      author: req.user.userId,
      title,
      description,
      tags,
    });

    res.status(201).json({
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getQuestions = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const questions = await Question.find(filter)
      .populate("author", "name username profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalQuestions = await Question.countDocuments(filter);

    const totalPages = Math.ceil(totalQuestions / Number(limit));

    res.status(200).json({
      questions,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalQuestions,
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate(
      "author",
      "name username profilePic"
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.status(200).json({
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (question.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own question",
      });
    }

    question.title = title || question.title;
    question.description = description || question.description;
    question.tags = tags || question.tags;

    await question.save();

    res.status(200).json({
      message: "Question updated successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (question.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own question",
      });
    }

    await question.deleteOne();

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const userId = req.user.userId;

    const alreadyUpvoted = question.upvotes.includes(userId);

    if (alreadyUpvoted) {
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      question.upvotes.push(userId);

      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== userId
      );
    }

    await question.save();

    res.status(200).json({
      message: alreadyUpvoted
        ? "Question upvote removed"
        : "Question upvoted",
      upvotes: question.upvotes.length,
      downvotes: question.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const downvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const userId = req.user.userId;

    const alreadyDownvoted = question.downvotes.includes(userId);

    if (alreadyDownvoted) {
      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      question.downvotes.push(userId);

      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== userId
      );
    }

    await question.save();

    res.status(200).json({
      message: alreadyDownvoted
        ? "Question downvote removed"
        : "Question downvoted",
      upvotes: question.upvotes.length,
      downvotes: question.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
    module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
    upvoteQuestion,
    downvoteQuestion,
};