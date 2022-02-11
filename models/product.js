const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product's name"],
    trim: true,
    // maxLength:[100,"Name can't be exceed 100 character"]
  },
  price: {
    type: Number,
    required: [true, "Please enter product's price"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter product's description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product's category"],
    enum: {
      values: [
        "Electronics",
        "Laptop",
        "Cameras",
        "Accessories",
        "Headphones",
        "Food",
        "Sports",
        "Home",
        "Outdoor",
        "Cloths/shoes",
        "Beauty/Health",
        "Books",
      ],
      message: "Please select right product category",
    },
  },
  stock: {
    type: String,
    required: [true, "Please enter product's stock"],
    maxLength: [8, "Stock can't be exceed 8 character"],
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],

  seller: {
    type: String,
    required: [true, "Please enter product's seller"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
