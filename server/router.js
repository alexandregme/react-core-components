import express from 'express';
import path from 'path';

export default () => {
  const router = express.Router();

  const domains = {
    "site":    "./app/domains/site/routes",
    "hotsite":    "./app/domains/hotsite/routes"
  }

  console.info('Start domains mounting.');

  Object
    .keys(domains)
    .forEach(domainName => {
      const domainRoutesPath = path.join(__dirname, '../', domains[domainName]);

      console.info(`Mounting \'${domainName}\' from ${domainRoutesPath}`);

      const domainRoutes = require(domainRoutesPath).default;

      if ({}.toString.call(domainRoutes) !== '[object Function]') {
        throw new Error(`${domainName}'s routes should be exposed as a function.`);
      }

      router.use(domainRoutes());

      console.info(`Domain \'${domainName}\' is mounted.`);
    });

  return router;
};
