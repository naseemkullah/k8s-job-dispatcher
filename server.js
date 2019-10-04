const { JaegerTraceExporter } = require('@opencensus/exporter-jaeger');
const tracing = require('@opencensus/nodejs');

const exporter = new JaegerTraceExporter({ serviceName: 'k8s-job-dispatcher' });
tracing.registerExporter(exporter).start();

const express = require('express');
const { expressLogger, logger } = require('./lib/logger');
const jobs = require('./routes/jobs');

const app = express();

app.use(express.json());
app.use(expressLogger);
app.get('/healthz', (req, res) => res.status(200).end());
app.use('/api/jobs', jobs);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.code).send(err.message);
});

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = app; // for testing
