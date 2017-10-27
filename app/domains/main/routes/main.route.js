import express from 'express';
import { renderApp } from '../../../../core/utils/pageRender';

/* eslint-disable no-unused-vars */
import {
  App,
} from '../pages/main';
/* eslint-enable no-unused-vars */

export default () => {
  const router = express.Router();

  router.get('*', (req, res) => {
    /* START-DEV-CODE */
    // Requiring of app-specific modules must be placed within "route" callback
    // in order to provide so-called "Hot reloading" of app modules on the server-side in DEV-mode
    const {
        App,
    } = require( '../pages/main' );
    /* END-DEV-CODE */
    
    // ------------------------------------
    // Render the page
    // ------------------------------------
    res.send(renderApp(App, {
      pageTitle: 'main page',
      domainName: 'main',
      pageName:'main'
    }));
  });

  return router;
};
