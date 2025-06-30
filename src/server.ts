import http from 'http';
import 'reflect-metadata';
import {config} from './_config';
import {app} from './_index';

const startServer = async () => {
  // spinning up the server
  const httpsServer = http.createServer(await app);
  httpsServer.listen(
    config.get('server.port'),
    config.get('server.address'),
    () => {
      console.log(
        `application is running on port ${config.get('server.port')}.`
      );
    }
  );
};

startServer();

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

