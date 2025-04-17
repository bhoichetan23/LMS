const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  tittle: {
    type: String,
    required: [true, "Name is required"],
    minLenght: [8, "Name must be atleast 5 characters"],
    maxLenght: [50, "Name should be less than 50 characters"],
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minLenght: [8, "Description must be atleast 8 characters"],
    maxLenght: [200, "Description should be less than 50 characters"],
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],

  },
  thumbnail: {
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,

    },
  },
  lectures: [
    {
      tittle: String,
      description: String,
      public_id: {
        type: String,
        required: true,

      },
      secure_url: {
        type: String,
        required: true,

      },
    },
  ],
  numberOfLectures: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: String,
    required: true,
 -*78
 \5.

  }
}, {timestamp: true });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
+96