import * as express from 'express';
import * as ApiClient from 'kubernetes-client';

const Client = ApiClient.Client1_13;
const client = new Client({version: '1.13'});

import logger from '../lib/logger';

const router = express.Router();

router.get('/', async (req, res) => {
  const jobs = await client.apis.batch.v1.namespaces('').jobs.get();
  res.send(jobs);
});

router.get('/:namespace', async (req, res) => {
  const jobs = await client.apis.batch.v1
    .namespaces(req.params.namespace)
    .jobs.get();
  res.send(jobs);
});

router.get('/:namespace/:name', async (req, res) => {
  const jobStatus = await client.apis.batch.v1
    .namespaces(req.params.namespace)
    .jobs(req.params.name)
    .status.get();
  res.send(jobStatus);
});

router.post('/', async (req, res, next) => {
  try {
    const job = await client.apis.batch.v1
      .namespaces(req.body.namespace)
      .jobs.post({
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
    logger.info(job);
    res.send(job);
  } catch (err) {
    next(err);
  }
});

export default router;
