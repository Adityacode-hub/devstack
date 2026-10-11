const express = require("express");

const {
  createQuestion,getQuestions,getQuestionById,updateQuestion,deleteQuestion,upvoteQuestion,downvoteQuestion
} = require("../../controllers/questionController");

const protect = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createQuestion);
router.get("/", getQuestions);
router.get("/:id",getQuestionById);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);
router.put("/:id/upvote", protect, upvoteQuestion);
router.put("/:id/downvote", protect, downvoteQuestion);
module.exports = router;