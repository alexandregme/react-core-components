const
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    gulpSync = require('gulp-sync')(gulp),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config');

gulp.task('clean', function () {
    return gulp.src('./public/build').pipe(clean());
});

gulp.task('build-frontend', function () {
    webpack(webpackConfig).run();
});

gulp.task('dev', gulpSync.sync([
    'clean',
    'build-frontend',
]));

gulp.task('default', ['dev']);