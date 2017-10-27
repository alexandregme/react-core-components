const cluster = require('cluster');
const forky = require('forky');
const os = require('os');

const defaultWorkerCount  = os.cpus().length;
const envWorkerCount      = parseInt(process.env.WORKERS_COUNT, 10);
const workerCount         = isNaN(envWorkerCount) ? defaultWorkerCount : envWorkerCount;

let workerFilename = __dirname + '/worker.js';
//TODO remove 
if (process.env.NODE_ENV === 'development') {
  workerFilename = __dirname + '/worker-development.js';
}

cluster.on('fork', (worker) => {
  console.log(`Worker #${worker.id} has been forked`);
});

forky({
  path: workerFilename,
  workers: workerCount
});