const express = require("express");

const {
  createAnswer,getAnswersByQuestion,updateAnswer,deleteAnswer,acceptAnswer,upvoteAnswer,downvoteAnswer
} = require("../../controllers/answerController");

const protect = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/:questionId", protect, createAnswer);
router.get("/:questionId", getAnswersByQuestion);
router.put("/:id", protect, updateAnswer);
router.delete("/:id",protect,deleteAnswer)
router.put("/:id/accept", protect, acceptAnswer);
router.put("/:id/upvote", protect, upvoteAnswer);
router.put("/:id/downvote", protect, downvoteAnswer);
module.exports = router;