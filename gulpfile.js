const gulp = require('gulp');
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

const reload = browserSync.reload;
const outputStyle = ['expanded', 'nested', 'compact', 'compressed'];

const sourceSCSS = 'docs/resources/scss/*.scss';
const sourceJS = 'docs/resources/js/*.js';
const distCSS = 'docs/public/styles/';
const distJS = 'docs/public/scripts/';


gulp.task('browserSync', () => {
    browserSync.init({
        proxy: 'http://localhost'
    });
});

gulp.task('styles', () => {

    var onError = function(err) {
        notify.onError({
          title:    "Gulp",
          subtitle: "Failure!",
          message:  "Error: <%= error.message %>",
          sound:    "Beep"
        })(err);

        this.emit('end');
    };

    return gulp.src(sourceSCSS)
        .pipe(plumber({errorHandler: onError}))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: outputStyle[3]}).on('error', sass.logError))
        .pipe(autoprefixer('last 5 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distCSS))
        .pipe(reload({ stream: true }));
});

gulp.task('jshint', () => {
    return gulp.src(sourceJS)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', () => {
    gulp.src(sourceJS)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distJS))
        .pipe(reload({stream:true}));
});

/** Watch for all changes */
gulp.task('watch', () => {
    gulp.watch(sourceSCSS, ['styles']);
    gulp.watch(sourceJS, ['js']);
});

gulp.task('build', ['styles', 'scripts', 'browserSync', 'watch']);
