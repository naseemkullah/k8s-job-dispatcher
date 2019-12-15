require('./lib/tracer');
const express = require('express');
const opentelemetry = require('@opentelemetry/core');
const { expressLogger, logger } = require('./lib/logger');
const jobs = require('./routes/jobs');
const { countAllRequests } = require('./lib/metrics');

const app = express();

app.use(express.json());
app.use(expressLogger);
app.get('/healthz', (req, res) => res.status(200).end());
app.use(countAllRequests());
app.use('/api/jobs', jobs);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const spanContext = opentelemetry
    .getTracer()
    .getCurrentSpan()
    .context();
  logger.error({ err, spanContext }, `${err}`);
  res.status(err.code).send(err.message);
});

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = app; // for testing
