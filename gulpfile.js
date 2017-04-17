const gulp = require('gulp');

const babel = require("gulp-babel");

const plumber = require('gulp-plumber');

var src_dir = 'src/*.js';


gulp.task('default', () =>
    gulp.src(src_dir)
    .pipe(plumber())
    .pipe(babel({
        plugins: ['transform-runtime']
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('watch', function() {
    gulp.watch(src_dir, ['default']);
});
