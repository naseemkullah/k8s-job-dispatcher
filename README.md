# k8s-job-dispatcher

`k8s-job-dispatcher` listens for data and creates kubernetes jobs.

### Example
`curl -d '{"name":"test-job", "namespace":"default", "image":"nginx", "command":["sleep"], "args":["1"]}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/jobs`

## Why though?

While the server itself does not serve much purpose, it is well instrumented and can serve as an example for other projects.

### Instrumentation

[Logs](./lib/logger.js)
[Traces](./lib/tracer.js)
Coming soon: Metrics
