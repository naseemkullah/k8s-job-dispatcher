const request = require('supertest');
const should = require('should');
const server = require('./server');

describe('GET /api/jobs/', () => {
  it('it should return all jobs in all namespaces', (done) => {
    request(server)
      .get('/api/jobs')
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end((err, res) => {
        res.body.statusCode.should.equal(200);
        res.body.body.kind.should.equal('JobList');
        res.body.body.items.should.be.instanceof(Array);
        done();
      });
  }).timeout(5000);
});

describe('GET /api/jobs/:namespace', () => {
  it('it should return jobs in a given namespace', (done) => {
    const namespace = 'default';
    request(server)
      .get(`/api/jobs/${namespace}`)
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end((err, res) => {
        res.body.statusCode.should.equal(200);
        res.body.body.kind.should.equal('JobList');
        res.body.body.items.should.be.instanceof(Array);
        done();
      });
  }).timeout(5000);
});

let jobName;
describe('POST /api/jobs', () => {
  it('it should create a job', (done) => {
    const jobDetails = {
      name: 'test-job',
      namespace: 'default',
      image: 'busybox',
      command: ['sleep'],
      args: ['1'],
    };
    request(server)
      .post('/api/jobs')
      .send(jobDetails)
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end((err, res) => {
        res.body.statusCode.should.equal(201);
        res.body.body.kind.should.equal('Job');
        res.body.body.metadata.namespace.should.be.exactly(jobDetails.namespace);
        res.body.body.spec.template.spec.containers[0].image.should.be.exactly(jobDetails.image);
        jobName = res.body.body.metadata.name;
        done();
      });
  }).timeout(5000);
});

describe('GET /api/jobs/:namespace/:name', () => {
  it('it should return the status of a job', (done) => {
    const namespace = 'default';
    request(server)
      .get(`/api/jobs/${namespace}/${jobName}`) // jobName depends on previous test
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end((err, res) => {
        res.body.statusCode.should.equal(200);
        res.body.body.kind.should.equal('Job');
        should.exist(res.body.body.status);
        done();
      });
  }).timeout(5000);
});
