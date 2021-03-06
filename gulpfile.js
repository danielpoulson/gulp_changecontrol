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
const exec = require('child_process').exec;
const Cache = require('gulp-file-cache');
const cache = new Cache();

const config = {
	port: 7005,
	devBaseUrl: 'http://localhost',
	nodeServer: './server.js',
	paths: {
        html: './client/*.html',
        js: './client/src/**/*.js',
        sass: [
            './client/node_modules/bootstrap/dist/css/bootstrap.min.css',
            './client/node_modules/react-widgets/dist/css/react-widgets.css',
            './client/node_modules/react-select/dist/react-select.min.css',
            './client/node_modules/toastr/build/toastr.min.css',
            './client/src/**/*.*css'
        ],
        images: './client/src/images/*',
        fonts: [
            './client/node_modules/bootstrap/dist/fonts/*.*',
            './client/src/styles/font-awesome/fonts/*.*',
            './client/node_modules/react-widgets/lib/fonts/*.*'
        ],
        toMove: [
            './server/**/*.*',
            './server.js'
        ],
        dist: './dist',
        mainJs: './client/src/index.js',
        server: './server',
        styles: './client/src/styles'
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

function scripts_build() {
    log('****** browserify JSX --> JS');
    log(process.env.NODE_ENV);
	return browserify(config.paths.mainJs)
		.transform("babelify", {presets: ["es2015", "react", "stage-0"]}, {plugins: ["transform-flow-strip-types"]})
		.bundle()
        .on('error', (err) => log(err.stack))
		.on('error', (err) => log(err.toString())) 
		.pipe(source('bundle.js'))
		.pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
		.pipe($.uglify())
        .on('error', $.util.log)
        .pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(reload({stream:true}));
}

function scripts() {
    log('****** browserify JSX --> JS');
	return browserify(config.paths.mainJs)
        .transform("babelify", {presets: ["es2015", "react", "stage-0"]}, {plugins: ["transform-flow-strip-types"]})
        .bundle()
        .on('error', (err) => log(err.toString())) 
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(reload({stream:true}));
    }

function styles() {
    log('Compiling Sass --> CSS');
    return gulp.src(config.paths.sass)
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.concat('bundle.css'))
		// .pipe($.csso())
		.pipe(gulp.dest(config.paths.dist + '/css'))
		.pipe(reload({stream:true}));
}

//Migrates images to the dist folder
function images (done) {
	gulp.src(config.paths.images)
	.pipe(gulp.dest(config.paths.dist + '/images'))
	.pipe(reload({stream:true}));

	//publish favicon
	gulp.src('./client/favicon.ico')
	.pipe(gulp.dest(config.paths.dist));

    done();
}

function fonts() {
    log('****** Moving fonts to the fonts folder');  
    return gulp.src(config.paths.fonts)
        .pipe(gulp.dest(config.paths.dist + '/fonts/'));
}

function lint() {
    return gulp.src([config.paths.js,'!**/node_modules/**'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
}

gulp.task('compileES6', function () {
  const stream = gulp.src('./server/**/*.js') // your ES2015 code
                   .pipe(cache.filter()) // remember files
                   .pipe($.babel()) // compile new ones
                   .pipe(cache.cache()) // cache them
                   .pipe(gulp.dest(config.paths.dist + '/server')) // write them
  return stream; // important for gulp-nodemon to wait for completion
});


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
	gulp.watch('./server/**/*.js', gulp.series('compileES6'));
    done();
}

const compile = gulp.series(html, images, fonts, lint, styles);
const serveBuild = gulp.series(compile, scripts_build);
const compileDev = gulp.series(compile, scripts);

gulp.task('serveDev', gulp.parallel(browser, watch));
gulp.task('serveBuild', serveBuild);
gulp.task('compile', compile);
gulp.task('compileDev', compileDev);
gulp.task('clean', cleanDist);
gulp.task('fonts', fonts);
gulp.task('images', images);
gulp.task('browser', browser);
gulp.task('watch', watch);