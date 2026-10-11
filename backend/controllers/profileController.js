const Profile = require("../models/Profile");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

const populateUser = (query) => {
  return query.populate(
    "user",
    "name username email profilePic bio reputation"
  );
};

// GET /api/profile/me
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Run all queries in parallel for efficiency
    const [
      profile,
      questionCount,
      answerCount,
      acceptedAnswerCount,
      questions,
      answers,
    ] = await Promise.all([
      // Find the user's profile
      populateUser(Profile.findOne({ user: userId })),

      // Count questions created by this user
      Question.countDocuments({ author: userId }),

      // Count answers created by this user
      Answer.countDocuments({ author: userId }),

      // Count accepted answers created by this user
      Answer.countDocuments({ author: userId, isAccepted: true }),

      // Fetch the user's question documents
      Question.find({ author: userId })
        .select("title tags upvotes downvotes views createdAt")
        .sort({ createdAt: -1 }),

      // Fetch the user's answer documents, with the parent question title
      Answer.find({ author: userId })
        .select("content question isAccepted upvotes downvotes createdAt")
        .populate("question", "title")
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      profile: profile || null,

      stats: {
        questions: questionCount,
        answers: answerCount,
        accepted: acceptedAnswerCount,
      },

      questions,
      answers,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /api/profile/me
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      website,
      country,
      languages,
      portfolio,
      workExperience,
      social,
    } = req.body;

    const profile = await populateUser(
      Profile.findOneAndUpdate(
        {
          user: req.user.userId,
        },
        {
          website,
          country,
          languages,
          portfolio,
          workExperience,
          social,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      )
    );

    res.status(200).json({
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  createOrUpdateProfile,
};