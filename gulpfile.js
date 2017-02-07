'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserify = require('browserify'); // Bundles JS
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const babelify = require('babelify');  // Transforms React JSX to JS
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
const del = require('del');
const path = require('path');

const config = {
	port: 7005,
	devBaseUrl: 'http://localhost',
	nodeServer: './server.js',
	paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        sass: './src/**/*.*css',
        images: './src/images/*',
        toMove: [
            './server/**/*.*',
            './server.js'
        ],
        dist: './dist',
        mainJs: './src/index.js',
        server: './server'
	}
};

function cleanDist(done) {
    return clean(config.paths.dist, done);
}

function html() {
	return gulp.src(config.paths.html)
	.pipe(gulp.dest(config.paths.dist))
	.pipe(reload({stream:true}));
}

function scripts() {
    log('****** browserify JSX --> JS');
	return browserify(config.paths.mainJs)
		.transform("babelify", {presets: ["es2015", "react", "stage-0"]}, {plugins: ["transform-flow-strip-types"]})
		.bundle()
		.on('error', (err) => log(err.stack)) 
		.pipe(source('bundle.js'))
		.pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
		.pipe($.uglify())
        .on('error', $.util.log)
        .pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(reload({stream:true}));
}

function styles() {
    log('Compiling Sass --> CSS');
    return gulp.src(config.paths.sass)
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.concat('bundle.css'))
		.pipe($.csso())
		.pipe(gulp.dest(config.paths.dist + '/css'))
		.pipe(reload({stream:true}));
}

//Migrates images to the dist folder
// gulp.task('images', function(){
// 	gulp.src(config.paths.images)
// 	.pipe(gulp.dest(config.paths.dist + '/images'))
// 	.pipe(reload({stream:true}));

// 	//publish favicon
// 	gulp.src('./src/favicon.ico')
// 	.pipe(gulp.dest(config.paths.dist));
// });

function lint() {
    return gulp.src([config.paths.js,'!**/node_modules/**'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
}

function nodemon(cb) {
  let called = false;
  const nodeOptions = {
    script: 'server.js',
    delayTime: 1,
    ext: '.js .html',
    ignore: [
      'dist/**/*.js',
      'node_modules/**/*.js'
    ],
    env: {
      'NODE_ENV': 'development',
      'PORT': 7005
    },
  };

  return $.nodemon(nodeOptions)
    .on('start', function () {
        log('**** Nodemon started!');
        if (!called) {
            called = true;
            cb();
        }
    })
    .on('restart', function () {
        log('**** Nodemon restarted!');
    });
}


function browser(done) {
    if (browserSync.active) {
        return;
    }

    log(`*** Startign browserSync on ${config.port}`);

    return browserSync.init({
        proxy: "localhost:7005"
    }, done);
}

function move(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  return gulp.src(config.paths.toMove, { base: './' })
  .pipe(gulp.dest(config.paths.dist));
}

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done());
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (const item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function watch(done) {
    gulp.watch(config.paths.html, gulp.series(html));
	gulp.watch(config.paths.js, gulp.series(scripts, lint));
	gulp.watch(config.paths.sass, gulp.series(styles));
    done();
}

const serveDev = gulp.series(html, lint, styles, scripts, nodemon, browser);
const serveBuild = gulp.series(html, lint, styles, scripts, move);

gulp.task('serveDev', gulp.parallel(serveDev, watch));
gulp.task('serveBuild', gulp.parallel(serveBuild));
gulp.task('clean', cleanDist);