import express from 'express';
import main from './main.route';

export default () => {

  // ========================================================
  // Initialize routes
  // ========================================================
  const innerRouter = express.Router();
  const outerRouter = express.Router();

  //path
  innerRouter.use('/', main());

  //namespace
  outerRouter.use('/main', innerRouter);

  return outerRouter;
};
