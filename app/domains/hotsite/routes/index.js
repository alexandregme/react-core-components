import express from 'express';
import landing from './landing.route';

export default () => {

  // ========================================================
  // Initialize routes
  // ========================================================
  const innerRouter = express.Router();
  const outerRouter = express.Router();

  //path
  innerRouter.use('/', landing());

  //namespace
  outerRouter.use('/hotsite', innerRouter);

  return outerRouter;
};
