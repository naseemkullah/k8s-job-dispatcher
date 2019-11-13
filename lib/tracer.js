const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const opentelemetry = require('@opentelemetry/core');
const { NodeTracer } = require('@opentelemetry/node');
const { BatchSpanProcessor } = require('@opentelemetry/tracing');

// Create and configure NodeTracer
const tracer = new NodeTracer({
  plugins: {
    http: {
      enabled: true,
      path: '@opentelemetry/plugin-http',
      config: {
        ignoreIncomingPaths: [
          /^\/healthz/,
        ],
      },
    },
  },
});


const exporter = new JaegerExporter({ serviceName: 'k8s-job-dispatcher' });
tracer.addSpanProcessor(new BatchSpanProcessor(exporter));

// Initialize the tracer
opentelemetry.initGlobalTracer(tracer);
