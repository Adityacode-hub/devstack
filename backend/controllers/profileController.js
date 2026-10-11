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

    // Find the user's profile
    const profile = await populateUser(
      Profile.findOne({
        user: userId,
      })
    );

    // Count questions created by this user
    const questionCount = await Question.countDocuments({
      author: userId,
    });

    // Count answers created by this user
    const answerCount = await Answer.countDocuments({
      author: userId,
    });

    // Count accepted answers created by this user
    const acceptedAnswerCount = await Answer.countDocuments({
      author: userId,
      isAccepted: true,
    });

    res.status(200).json({
      profile: profile || null,

      stats: {
        questions: questionCount,
        answers: answerCount,
        accepted: acceptedAnswerCount,
      },
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