'use strict';

const gulp = require('gulp');
const args = require('yargs').argv;
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
        css: [
            './src/style.css'
        ],
        dist: './dist',
        mainJs: './src/index.js',
        server: './server'
	}
};

gulp.task('clean', ['clean-images', 'clean-styles', 'clean-code']);

gulp.task('clean-images', function(done) {
    clean(config.paths.dist + '/images/**/*.*', done);
});

gulp.task('clean-styles', function(done) {
    clean(config.paths.dist + '/**/*.css', done);
});

gulp.task('clean-code', function(done) {
    const files = [].$.concat(
        config.paths.dist + '/scripts/*.js'
    );
    clean(files, done);
});

// gulp.task('clean-code', function(done) {
//     const files = [].concat(
//         config.temp + '**/*.js',
//         config.build + '**/*.html',
//         config.build + 'js/**/*.js'
//     );
//     clean(files, done);
// });

gulp.task('html', function(){
	gulp.src(config.paths.html)
	.pipe(gulp.dest(config.paths.dist))
	.pipe(reload({stream:true}));
});

gulp.task('js', () => {
	browserify(config.paths.mainJs)
		.transform("babelify", {presets: ["es2015", "react", "stage-0"]}, {plugins: ["transform-flow-strip-types"]})
		.bundle()
		.on('error', (err) => log(err.stack)) 
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe($.uglify())
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(reload({stream:true}));
});

gulp.task('sass', function () {
	log('Compiling Sass --> CSS');
	return gulp.src(config.paths.sass)
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.concat('bundle.css'))
		.pipe($.csso())
		.pipe(gulp.dest(config.paths.dist + '/css'))
		.pipe(reload({stream:true}));
});

gulp.task('css', function() {
	gulp.src(config.paths.css)
		.pipe($.concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'));
});

//Migrates images to the dist folder
gulp.task('images', function(){
	gulp.src(config.paths.images)
	.pipe(gulp.dest(config.paths.dist + '/images'))
	.pipe(reload({stream:true}));

	//publish favicon
	gulp.src('./src/favicon.ico')
	.pipe(gulp.dest(config.paths.dist));
});

gulp.task('lint', () => {
	//log('linting tasks');
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src([config.paths.js,'!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe($.eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe($.eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe($.eslint.failAfterError());
});

gulp.task('default', ['lint', 'sass', 'js', 'browser-sync'], function() {
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js', 'lint']);
	gulp.watch(config.paths.sass, ['sass']);
});

gulp.task('nodemon', function (cb) {
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
});


gulp.task('browser-sync', ['nodemon'], function() {
    if (browserSync.active) {
        return;
    }

    log(`*** Startign browserSync on ${config.port}`);

    browserSync.init({
        proxy: "localhost:7005"
    });
});

function clean(path, done) {
  log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
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