const express = require('express');
const jobs = require('./routes/jobs');
const { expressPino, pino } = require('./lib/logger');

const app = express();

app.use(express.json());
app.use(expressPino);
app.get('/healthz', (req, res) => res.status(200).end());
app.use('/api/jobs', jobs);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  pino.error(err);
  res.status(err.code).send(err.message);
});

const port = process.env.PORT || 3000;
app.listen(port, () => pino.info(`Listening on port ${port}...`));

module.exports = app; // for testing
