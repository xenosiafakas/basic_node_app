const AppError = require('../utils/appError.js');
const Tour = require('./../models/tourModel.js');
const APIFeatures = require('./../utils/APIFeatures.js');
const catchAsync = require('./../utils/catchAsync.js');

exports.getAllTours = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour, req.query)
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: { tours },
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ _id: req.params.id });

  if (!tour) {
    throw new AppError('No tour found with that ID', 404);
  }

  res.status(200).json({ status: 'success', data: { tour } });
});

exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({ status: 'success', data: { tour: newTour } });
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    throw new AppError('No tour found with that ID', 404);
  }

  res.status(200).json({ status: 'success', data: { tour } });
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOneAndDelete({ _id: req.params.id });

  if (!tour) {
    throw new AppError('No tour found with that ID', 404);
  }

  res.status(204).json({ status: 'success' });
});

exports.getTourStats = catchAsync(async (req, res) => {
  const pipeline = [
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ];

  const stats = await Tour.aggregate(pipeline);

  res.status(200).json({ status: 'success', data: { stats } });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const pipeline = [
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    { $project: { _id: 0 } },
    {
      $sort: { numTourStarts: -1 },
    },
  ];
  const plan = await Tour.aggregate(pipeline);
  res.status(200).json({ status: 'success', data: { plan } });
});
