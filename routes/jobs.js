const express = require('express');
const { Client, KubeConfig } = require('kubernetes-client');
const Request = require('kubernetes-client/backends/request');
const { pino } = require('../lib/logger');

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
  const jobs = await client.apis.batch.v1.namespaces().jobs.get();
  res.send(jobs);
});

router.get('/:namespace', async (req, res) => {
  const jobs = await client.apis.batch.v1.namespaces(req.params.namespace).jobs.get();
  res.send(jobs);
});

router.get('/:namespace/:name', async (req, res) => {
  const jobStatus = await client.apis.batch.v1.namespaces(req.params.namespace)
    .jobs(req.params.name).status.get();
  res.send(jobStatus);
});

router.post('/', async (req, res, next) => {
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
    next(err);
  }
});

module.exports = router;
