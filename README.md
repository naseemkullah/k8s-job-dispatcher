# k8s-job-dispatcher

`k8s-job-dispatcher` listens for data and creates kubernetes jobs.

### Example
`curl -d '{"name":"test-job", "namespace":"default", "image":"nginx", "command":["sleep"], "args":["1"]}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/jobs`