const fs = require('fs');
const express = require('express');
const { create } = require('domain');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', result: tours.length, data: { tours } });
};

const getTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  res.status(200).json({ status: 'success', data: { tour } });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringfy(tours),
    (err) => {}
  );
  res.status(201).json({ status: 'success', data: { tour: newTour } });
};

const updateTour = (req, res) => {
  if (parseInt(req.params.id, 10) > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  res.status(200).json({ status: 'success', data: {} });
};

const deleteTour = (req, res) => {
  if (parseInt(req.params.id, 10) > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  res.status(204).json({ status: 'success', data: null });
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;

app.listen(port, () => {
  console.log('Running on port 3000');
});
