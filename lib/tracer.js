const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const opentelemetry = require('@opentelemetry/core');
const { NodeTracerRegistry } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');

const registry = new NodeTracerRegistry({
  logLevel: opentelemetry.LogLevel.ERROR,
  plugins: {
    http: {
      enabled: true,
      path: '@opentelemetry/plugin-http',
      ignoreIncomingPaths: [/\/healthz/],
    },
  },
  sampler: new opentelemetry.ProbabilitySampler(0.5),
});

const exporter = new JaegerExporter({ serviceName: 'k8s-job-dispatcher' });

registry.addSpanProcessor(new SimpleSpanProcessor(exporter));

opentelemetry.initGlobalTracerRegistry(registry);

module.exports = opentelemetry.getTracer();
