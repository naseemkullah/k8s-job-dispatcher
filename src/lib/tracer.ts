import {JaegerExporter} from '@opentelemetry/exporter-jaeger';
import opentelemetry from '@opentelemetry/api';
import {LogLevel, ProbabilitySampler} from '@opentelemetry/core';
import {NodeTracerProvider} from '@opentelemetry/node';
import {SimpleSpanProcessor} from '@opentelemetry/tracing';

const provider = new NodeTracerProvider({
  logLevel: LogLevel.ERROR,
  plugins: {
    http: {
      enabled: true,
      path: '@opentelemetry/plugin-http',
      // ignoreIncomingPaths: [/\/healthz/],
    },
  },
  sampler: new ProbabilitySampler(0.5),
});

const serviceName = 'k8s-job-dispatcher';
const exporter = new JaegerExporter({serviceName});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();

export default opentelemetry.trace.getTracer(serviceName);
