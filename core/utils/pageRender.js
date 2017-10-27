import React from 'react';
import ReactDOMServer from 'react-dom/server';

//TODO use config file
const PUBLIC_PATH = '/build/';

/**
 *
 *
 * @param domainName
 * @param pageName
 * @returns {{scriptSrcList: *, styleSrcList: *, svgSpritePath: *}}
 */
function getPageResources(domainName, pageName) {
  let scriptSrcList;
  let styleSrcList;
  let headerScriptSrcList;

  scriptSrcList = [
    `${PUBLIC_PATH}vendor.js`,
    `${PUBLIC_PATH}${domainName}.${pageName}.js`
  ];

  styleSrcList = [
    `${PUBLIC_PATH}vendor.css`,
    `${PUBLIC_PATH}${domainName}.${pageName}.css`
  ];

  //TODO remove headerScript
  headerScriptSrcList = [
    `${PUBLIC_PATH}jquery-2.2.4.min.js`,
    `${PUBLIC_PATH}bootstrap.3.3.7.min.js`
  ];

  return {
    scriptSrcList: scriptSrcList.filter( src => !!src ),
    styleSrcList: styleSrcList.filter( src => !!src ),
    headerScriptSrcList
  };
}


/**
 * Render React component to string
 *
 * @param {React.Component} Component - target React component
 * @param {Object} [componentProps] - component props
 *
 * @returns {string} html - rendered component to string
 */
function renderReactComponent(Component, componentProps) {
  return ReactDOMServer.renderToString(<Component {...componentProps} />);
}


/**
 * renderHTML - render HTML based on parameters
 *
 * @param {string} title - page title
 * @param {array<string>} styleSrcList - list of src strings to styles
 * @param {array<string>} scriptSrcList - list of src strings to scripts
 * @param {string} html - html string to be rendered as a part of body
 * @param headerScriptSrcList
 * @returns {string}
 */
function renderHTML( {
  title,
  styleSrcList,
  headerScriptSrcList,
  scriptSrcList,
  html
}) {

  const generateScripts = (scripts) =>
    scripts.filter(src => !!src).map(src => `<script type="text/javascript" src="${src}"></script>`).join('');


  return `
    <!doctype html>
    <html lang="en">
    <head>
      <title>${title}</title>
      ${styleSrcList.map(src => `<link rel="stylesheet" href="${src}">`).join('')}
    </head>
    <body>
      <div id="root">${html}</div>
      ${generateScripts(scriptSrcList)}
    </body>
    </html>
  `;
}


export function renderApp (AppComponent, {
  domainName,
  pageName,
  pageTitle
}) {
  const {
    scriptSrcList,
    styleSrcList,
    headerScriptSrcList
  } = getPageResources(domainName, pageName);

  const html = renderHTML({
    title: pageTitle || `${pageName} | ${domainName}`,
    html: renderReactComponent(AppComponent),
    scriptSrcList,
    styleSrcList,
    headerScriptSrcList
  });

  return html;
};
