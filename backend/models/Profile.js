const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    website: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    languages: [
      {
        type: String,
      },
    ],

    portfolio: {
      type: String,
      default: "",
    },

    workExperience: [
      {
        role: {
          type: String,
          required: true,
        },

        company: {
          type: String,
          default: "",
        },

        country: {
          type: String,
          default: "",
        },

        from: {
          type: Date,
          required: true,
        },

        to: {
          type: Date,
        },

        current: {
          type: Boolean,
          default: false,
        },

        details: {
          type: String,
          default: "",
        },
      },
    ],

    social: {
      github: {
        type: String,
        default: "",
      },

      twitter: {
        type: String,
        default: "",
      },

      youtube: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);