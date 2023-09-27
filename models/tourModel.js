const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [5, 'A tour name must have more or equal than 5 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: "Difficulty is either 'easy', 'medium' or 'difficult'",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Rating must have a maximum of 5.0 stars'],
      min: [1, 'Rating must have a minimum of 1.0 star'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: { type: Number, required: [true, 'A tour must have a price'] },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return (
            val < this.price
          ); /*this. points to the current doc only on a new document creation in mongoDB*/
        },
        message: 'Discount price {VALUE} should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    hideTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);

// tourSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

tourSchema.pre('save', function (next) {
  /* This document middleware runs right before .save() and .create()
  but not with insertMany(). The 'save' hook points at the current documentObject*/
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
// console.log(doc);
// next();
// });

tourSchema.pre('find', function (next) {
  /* The 'find' hook points at the currect queryObject*/
  this.find({ hideTour: { $ne: true } });
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(docs);
//   next();
// });

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { hideTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
