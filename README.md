# k8s-job-dispatcher

`k8s-job-dispatcher` listens for data and creates kubernetes jobs.

## Handy commands

### Create a job

`curl -d '{"name":"test-job", "namespace":"default", "image":"nginx", "command":["sleep"], "args":["1"]}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/jobs`

### Get jobs

`curl http://localhost:3000/api/jobs`

## Why

While the server itself is somewhat useless, it is well instrumented and can be a reference for other projects.

### Instrumentation

* [Logs](./lib/logger.js)
* [Traces](./lib/tracer.js)
