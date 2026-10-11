const Answer = require("../models/Answer");

const createAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const { questionId } = req.params;

    const answer = await Answer.create({
      content,
      question: questionId,
      author: req.user.userId,
    });

    res.status(201).json({
      message: "Answer created successfully",
      answer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({
      question: req.params.questionId,
    })
      .populate("author", "name username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      answers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateAnswer = async (req, res) => {
  try {
    const { content } = req.body;

    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    if (answer.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own answer",
      });
    }

    answer.content = content || answer.content;

    await answer.save();

    res.status(200).json({
      message: "Answer updated successfully",
      answer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    if (answer.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own answer",
      });
    }

    await answer.deleteOne();

    res.status(200).json({
      message: "Answer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    const Question = require("../models/Question");

    const question = await Question.findById(answer.question);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (question.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Only the question author can accept an answer",
      });
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
    res.status(500).json({
      message: error.message,
    });
  }
};
const upvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    const userId = req.user.userId;

    const alreadyUpvoted = answer.upvotes.includes(userId);

    if (alreadyUpvoted) {
      answer.upvotes = answer.upvotes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      answer.upvotes.push(userId);

      answer.downvotes = answer.downvotes.filter(
        (id) => id.toString() !== userId
      );
    }

    await answer.save();

    res.status(200).json({
      message: alreadyUpvoted
        ? "Answer upvote removed"
        : "Answer upvoted",
      upvotes: answer.upvotes.length,
      downvotes: answer.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const downvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    const userId = req.user.userId;

    const alreadyDownvoted = answer.downvotes.includes(userId);

    if (alreadyDownvoted) {
      answer.downvotes = answer.downvotes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      answer.downvotes.push(userId);

      answer.upvotes = answer.upvotes.filter(
        (id) => id.toString() !== userId
      );
    }

    await answer.save();

    res.status(200).json({
      message: alreadyDownvoted
        ? "Answer downvote removed"
        : "Answer downvoted",
      upvotes: answer.upvotes.length,
      downvotes: answer.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createAnswer,
    getAnswersByQuestion,
    updateAnswer,
    deleteAnswer,
    acceptAnswer,
    upvoteAnswer,
    downvoteAnswer,
};