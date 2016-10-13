const gulp        = require('gulp');
const browserSync = require('browser-sync').create()
const sass        = require('gulp-sass');
const prefix      = require('gulp-autoprefixer');
const nano        = require('gulp-cssnano');
const maps        = require('gulp-sourcemaps');
const htmlmin     = require('gulp-htmlmin');
const rename      = require("gulp-rename");
const imagemin    = require('gulp-imagemin');
const ghPages     = require('gulp-gh-pages');
const babel       = require("gulp-babel");
const notify      = require('gulp-notify');
const uglify      = require('gulp-uglify');
const plumber     = require('gulp-plumber');
const svgstore    = require('gulp-svgstore');
const svgmin      = require('gulp-svgmin');
const path        = require('path');

function onError(error) {
  notify({
    title: 'Error',
    message: error.messageOriginal,
  }).write(error);

  this.emit('end');
}

gulp.task('html', function() {
  return gulp.src('./app/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('assets', function() {
  gulp.src('./app/img/*.jpg')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('copy', function() {
  gulp.src('./app/assets/*')
  .pipe(gulp.dest('./dist/assets'))
})

gulp.task('svgstore', function () {
    return gulp
        .src('./app/img/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('sass', function() {
    return gulp.src('./app/scss/**/*.scss')
      .pipe(maps.init())
      .pipe(plumber({ errorHandler: onError }))
      .pipe(sass())
      .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(nano())
      .pipe(rename('styles.min.css'))
      .pipe(maps.write('.'))
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.stream());
})

gulp.task('js', function () {
  return gulp.src('./app/js/app.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages())
})

gulp.task('serve', ['build'], function() {
  browserSync.init({
    open: false,
    notify: false,
    server: {
        baseDir: './dist',
    }
  })
  gulp.watch('./app/scss/**/*.scss', ['sass'])
  gulp.watch('./app/js/*.js', ['js']).on('change', browserSync.reload)
  gulp.watch('./app/*.html', ['html']).on('change', browserSync.reload)
})

gulp.task('build', ['copy', 'assets', 'svgstore', 'sass', 'js', 'html'])
