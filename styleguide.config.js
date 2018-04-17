process.env.DONT_EXTRACT_STYLES = '1';

const path = require('path');
const glob    = require('glob');
const projectWebpackConfig = require('./webpack.config');


const sections = glob
    .sync('app/domains/**/components')
    .reduce(
        (res, filename) => {
            const pathChain = filename.split(/\\|\//);
            const name = pathChain[2];

            return res.concat([{
                name: `${name.charAt(0).toUpperCase()}${name.slice(1)}\'s components`,
                components: `${pathChain.join('/')}/!(LandingPage)/**/!(index|_*|*.test*).js`
            }]);
        }, [
            {
                name: 'Core Components',
                components: 'core/components/**/!(index|_*|*.test*).js',
            }
        ]
    );

// console output
sections.forEach(s => console.info(`Running styleguide on folder: ${s.components}`));

module.exports = {
    title: 'Component Library',

    sections,

    getExampleFilename(componentPath) {
        return componentPath.replace(/\.jsx?$/, '.md');
    },

    updateWebpackConfig(webpackConfig) {
        const coreDir = [
            path.join(__dirname, 'core'),
            path.join(__dirname, 'app')
        ];

        // Append project's loaders to styles guide config and add require "include" param to each loader
        webpackConfig.module.loaders.push(
            ...projectWebpackConfig.module.loaders.map(loader => Object.assign({include: coreDir}, loader))
        );

        // copy specific options of PostCSS plugin
        webpackConfig.postcss = projectWebpackConfig.postcss;

        return webpackConfig;
    },

    // to access from outside of local machine, default value is localhost
    serverHost: '0.0.0.0'
};