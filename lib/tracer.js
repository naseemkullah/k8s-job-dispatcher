const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const opentelemetry = require('@opentelemetry/core');
const { NodeTracer } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');

// Create and configure NodeTracer
const tracer = new NodeTracer({
  plugins: {
    http: {
      enabled: true,
      path: '@opentelemetry/plugin-http',
      config: { ignoreIncomingPaths: [/^\/healthz/] },
    },
  },
});


const exporter = new JaegerExporter({ serviceName: 'k8s-job-dispatcher' });

// It is recommended to use SimpleSpanProcessor in case of Jaeger exporter as
// it's internal client already handles the spans with batching logic.
tracer.addSpanProcessor(new SimpleSpanProcessor(exporter));

// Initialize the tracer
opentelemetry.initGlobalTracer(tracer);
