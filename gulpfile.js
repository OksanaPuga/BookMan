var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass');


gulp.task('scripts', function () {
    return gulp.src('dev/scripts/**/*.js')
        .pipe(sourcemaps.init())
            .pipe(concat('app.min.js'))
            .pipe(uglify())    
        .pipe(sourcemaps.write({includeContent: true, sourceRoot: '/scripts'}))
        .pipe(gulp.dest('dist/scripts'));         
});

gulp.task('styles', function () {
    return gulp.src('dev/styles/**/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(concat('style.min.css'))
            .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('html', function () {
    return gulp.src('dev/*.html')
        .pipe(minifyHtml({conditionals: true, loose: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('dev/images/*.*')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
    return gulp.src('dev/fonts/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('watch', function() {
    gulp.watch('dev/scripts/*.js', ['scripts']);
    gulp.watch('dev/styles/*.scss', ['styles']);
    gulp.watch('dev/*.html', ['html']);
    gulp.watch('dev/images/*.*', ['images']);
});

gulp.task('webserver', function() {
  return gulp.src('dist')
    .pipe(webserver({
      host: 'localhost',
      port: 8080,
      open: true,
      fallback: 'index.html',
      directoryListing: 'dist'
  }));
});

gulp.task('build', ['html', 'scripts', 'styles', 'images']);
gulp.task('serve', ['watch', 'webserver']);

gulp.task('default', function () {
    gulp.start('build');
})