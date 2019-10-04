
const isLocal = process.env.NODE_ENV === undefined;
const logger = require('pino')({
  name: 'k8s-job-dispatcher',
  useLevelLabels: true,
  prettyPrint: isLocal ? {} : false,
  timestamp: isLocal ? {} : () => `,"epochTime":"${Date.now() / 1000.0}"`,
});
const expressLogger = require('express-pino-logger')({ logger });

module.exports = { expressLogger, logger };
