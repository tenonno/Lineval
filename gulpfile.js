var gulp = require('gulp');

var babel = require("gulp-babel");


var src_dir = 'src/*.js';


gulp.task('default', () =>
    gulp.src(src_dir)
    .pipe(babel({
        plugins: ['transform-runtime']
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('watch', function() {
    gulp.watch(src_dir, ['default']);
});
