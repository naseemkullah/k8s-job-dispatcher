import tracer from './lib/tracer';
import * as express from 'express';
import jobs from './routes/jobs';
import logger from './lib/logger';
import * as pinoHttp from 'pino-http';

export const httpLogger = pinoHttp({
  logger,
  serializers: {
    req(req) {
      const span = tracer.getCurrentSpan();
      let spanContext;
      if (span) {
        spanContext = span.context();
      }
      req.spanContext = spanContext;
      return req;
    },
  },
});

const app = express();

app.use(express.json());
app.use(httpLogger);
app.get('/healthz', (req, res) => res.status(200).end());
app.use('/api/jobs', jobs);

export interface HttpError extends Error {
  code: number;
}

app.use(
  (
    err: HttpError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const span = tracer.getCurrentSpan();
    let spanContext;
    if (span) {
      spanContext = span.context();
    }
    logger.error({err, spanContext}, err.message);
    res.status(err.code).send(err.message);
    next();
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = app; // for testing
