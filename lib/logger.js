const dev = !['staging', 'production'].includes(process.env.NODE_ENV);

const logger = require('pino')({
  name: 'k8s-job-dispatcher',
  useLevelLabels: true,
  prettyPrint: dev,
  timestamp: dev ? {} : () => `,"eventTime":"${Date.now() / 1000.0}"`,
  level: process.env.LOG_LEVEL || 'info',
});

const expressLogger = require('express-pino-logger')({ logger });

module.exports = { expressLogger, logger };
