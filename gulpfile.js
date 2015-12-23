var gulp = require('gulp');
var open = require('gulp-open');

gulp.task('copy-css', function () {
    gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('public/css'));
});

gulp.task('copy-js', function () {
    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('public/js'));
        
    gulp.src('node_modules/clipboard/dist/clipboard.min.js')
        .pipe(gulp.dest('public/js'));
});

gulp.task('copy', ['copy-css', 'copy-js']);

gulp.task('build', ['copy', 'run']);

gulp.task('run', function () {
    gulp.src('./index.html')
        .pipe(open());
});