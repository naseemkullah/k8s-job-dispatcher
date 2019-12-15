const { Meter } = require('@opentelemetry/metrics');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { logger } = require('./logger');

const meter = new Meter();

meter.addExporter(
  new PrometheusExporter(
    {
      startServer: true,
    },
    () => {
      logger.info('prometheus scrape endpoint: http://localhost:9464/metrics');
    },
  ),
);

const requestCount = meter.createCounter('requests', {
  monotonic: true,
  labelKeys: ['route'],
  description: 'Count all incoming requests',
});

const handles = new Map();

module.exports.countAllRequests = () => (req, res, next) => {
  if (!handles.has(req.path)) {
    const labelSet = meter.labels({ route: req.path });
    const handle = requestCount.getHandle(labelSet);
    handles.set(req.path, handle);
  }

  handles.get(req.path).add(1);
  next();
};
