import cluster from 'cluster';
import {cpus} from 'os';
import {config} from './_config';

const cpuCount = cpus().length;
const cluster_size = config.get('server.cluster_size') ?? 0;

if (cluster_size > 0) {
  if (cluster.isPrimary) {
    for (let i = 0; i < cluster_size; i += 1) {
      cluster.fork();
    }
    cluster.on('exit', () => {
      cluster.fork();
    });
  } else {
    require('./server.js');
  }
} else if (cluster_size === 0) {
  if (cluster.isPrimary) {
    for (let i = 0; i < cpuCount; i += 1) {
      cluster.fork();
    }
    cluster.on('exit', () => {
      cluster.fork();
    });
  } else {
    require('./server.js');
  }
} else {
  require('./server.js');
}
