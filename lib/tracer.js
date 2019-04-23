const { initTracer } = require('jaeger-client');
const { pino } = require('./logger');

const config = {
  serviceName: 'k8s-job-dispatcher',
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    logSpans: true,
  },
};

const options = {
  logger: {
    info(msg) {
      pino.info(msg);
    },
    error(msg) {
      pino.error(msg);
    },
  },
};

exports.tracer = initTracer(config, options);
