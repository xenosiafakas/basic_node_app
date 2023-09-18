const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  if (val > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name && !req.body.price) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Tour needs a name and a price' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({ status: 'success', data: { tour } });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {}
  );
  res.status(201).json({ status: 'success', data: { tour: newTour } });
};

exports.updateTour = (req, res) => {
  res.status(200).json({ status: 'success', data: {} });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};
