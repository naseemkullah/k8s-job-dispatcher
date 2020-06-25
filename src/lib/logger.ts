import * as pino from 'pino';

export default pino({
  name: 'k8s-job-dispatcher',
  formatters: {
    level(label: string) {
      return {level: label};
    },
    bindings(bindings: {[key: string]: string}) {
      return {name: bindings.name};
    },
  },
  prettyPrint: process.env.NODE_ENV === undefined,
  timestamp: () => `,"eventTime":${Date.now() / 1000.0}`,
  level: process.env.LOG_LEVEL || 'info',
});
