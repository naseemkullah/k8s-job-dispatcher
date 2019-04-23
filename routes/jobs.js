const express = require('express');
const { Client, KubeConfig } = require('kubernetes-client');
const Request = require('kubernetes-client/backends/request');
const { pino } = require('../lib/logger');
const { tracer } = require('../lib/tracer');

const router = express.Router();

let client;
const kubeconfig = new KubeConfig();

try {
  kubeconfig.loadFromCluster();
  const backend = new Request({ kubeconfig });
  client = new Client({ backend, version: '1.13' });
} catch (error) {
  kubeconfig.loadFromDefault();
  const backend = new Request({ kubeconfig });
  client = new Client({ backend, version: '1.13' });
}
const awaitClient = async () => client.loadSpec();
awaitClient();

router.get('/', async (req, res) => {
  const span = tracer.startSpan('list-all-jobs');
  span.setTag('namespace', 'all');
  const jobs = await client.apis.batch.v1.namespaces().jobs.get();
  res.send(jobs);
  span.finish();
});

router.get('/:namespace', async (req, res) => {
  const span = tracer.startSpan('list-jobs-per-namespace');
  span.setTag('namespace', req.params.namespace);
  const jobs = await client.apis.batch.v1.namespaces(req.params.namespace).jobs.get();
  res.send(jobs);
  span.finish();
});

router.get('/:namespace/:name', async (req, res) => {
  const span = tracer.startSpan('get-job-status');
  span.setTag('job', `${req.params.namespace}/${req.params.name}`);
  const jobStatus = await client.apis.batch.v1.namespaces(req.params.namespace)
    .jobs(req.params.name).status.get();
  res.send(jobStatus);
  span.finish();
});

router.post('/', async (req, res, next) => {
  const span = tracer.startSpan('create-job');
  span.setTag('job', `${req.body.namespace}/${req.body.name}`);
  try {
    const job = await client.apis.batch.v1.namespaces(req.body.namespace).jobs.post({
      body: {
        apiVersion: 'batch/v1',
        kind: 'Job',
        metadata: {
          generateName: `${req.body.name}-`,
          namespace: req.body.namespace,
        },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: req.body.name,
                  image: req.body.image,
                  command: req.body.command,
                  args: req.body.args,
                },
              ],
              restartPolicy: 'OnFailure',
            },
          },
        },
      },
    });
    pino.info(job);
    res.send(job);
  } catch (err) {
    pino.error(err);
    span.log({
      event: 'error',
      error: { object: err },
    });
    next(err);
  }
  span.finish();
});

module.exports = router;
