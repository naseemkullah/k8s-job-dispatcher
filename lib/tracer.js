const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const opentelemetry = require('@opentelemetry/api');
const { LogLevel, ProbabilitySampler } = require("@opentelemetry/core");
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');

const provider = new NodeTracerProvider({
  logLevel: LogLevel.ERROR,
  plugins: {
    http: {
      enabled: true,
      path: '@opentelemetry/plugin-http',
      ignoreIncomingPaths: [/\/healthz/],
    },
  },
  sampler: new ProbabilitySampler(0.5),
});

const exporter = new JaegerExporter({ serviceName: 'k8s-job-dispatcher' });

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

opentelemetry.trace.initGlobalTracerProvider(provider);

module.exports = opentelemetry.trace.getTracer();
