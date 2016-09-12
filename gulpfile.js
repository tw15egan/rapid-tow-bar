var gulp        = require('gulp');
var browserSync = require('browser-sync').create()
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var nano        = require('gulp-cssnano');
var maps        = require('gulp-sourcemaps');
var htmlmin     = require('gulp-htmlmin');
var rename      = require("gulp-rename");
var imagemin    = require('gulp-imagemin');

gulp.task('html', function() {
  return gulp.src('./app/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('assets', function() {
  gulp.src('./app/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'))
})

gulp.task('sass', function() {
    return gulp.src('./app/scss/main.scss')
      .pipe(maps.init())
      .pipe(sass())
      .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(nano())
      .pipe(rename('styles.min.css'))
      .pipe(maps.write('.'))
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.reload({stream: true}))
})

gulp.task('serve', ['build'], function() {
  
  browserSync.init({
    server: {
        baseDir: './dist'
    }
  })
  gulp.watch('./app/scss/**/*.scss', ['sass'])
  gulp.watch('./app/*.html', ['html']).on('change', browserSync.reload)
})

gulp.task('build', ['sass', 'html'])
