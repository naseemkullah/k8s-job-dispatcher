
const isLocal = process.env.NODE_ENV === undefined;
const pino = require('pino')({
  name: 'k8s-job-dispatcher',
  useLevelLabels: true,
  prettyPrint: isLocal ? {} : false,
  timestamp: isLocal ? {} : () => `,"epochTime":"${Date.now() / 1000.0}"`,
});
const expressPino = require('express-pino-logger')({
  logger: pino,
});

module.exports = { expressPino, pino };
