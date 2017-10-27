import svg4everybody from 'svg4everybody';

//TODO refactor
/**
 * Render App on the Client-side.
 * In case of `store` isn't provided, then `AppContainer` won't be wrapped into `<Provider/>`
 * In case of `iocContainer` isn't provided, then `AppContainer` won't be wrapped into `<ServiceProvider/>`
 *
 * @param {React.Component|Function} AppContainer
 * @param {Object} [store] - Redux store
 * @param {IocContainer} [iocContainer] - IoC container with service dependencies
 * @param {String} [mountNodeId] - the DOM element id, in which App should be mounted
 */
export function run(AppContainer, { mountNodeId = 'root' }) {

  
    // ========================================================
    // Generate SVG sprite
    // ========================================================
    svg4everybody();
  
    //TODO remover
    // ========================================================
    // Go!
    // ========================================================
    const mountNode = document.getElementById(mountNodeId);
  
    if (! mountNode) {
      throw new Error(`[renderClientApp] Mount DOM node #${mountNodeId} isn't found`);
    }
  
    ReactDOM.render(
      <App/>,
      mountNode
    );
  
  }