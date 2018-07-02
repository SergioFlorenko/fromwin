const gulp = require('gulp');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const bs = require('browser-sync').create();
const sass = require('gulp-sass');

const path = {
    html: ['*.html', '_includes/*.html', '_layouts/*.html'],
    scss: 'scss/**/*.scss'
};

// 1. jekyll build
// gulp.task('jekyll:build', function (done) {
//     return spawn('jekyll', ['build'], {
//         shell: true,
//         stdio: 'inherit'
//     }).on('close', done);
// });

gulp.task('jekyll:build', ['sass'], function (done) {
    exec('jekyll build', function (error, stdout, stderr) {
        if(error) {
            console.log(`exec error: ${error}`);
            return;
        }
        console.log(`exec stdout: ${stdout} \n ${stdout.length}`);
        console.log(`exec stderr: ${stderr} \n ${stderr.length}`);
        done();
    })
});

// 2. browser-sync
gulp.task('browser-sync', ['jekyll:build'], function () {
    bs.init({
        server: {
            baseDir: "_site"
        }
    });
});

// 3. reload and watch, and all command in one
gulp.task('jekyll:rebuild', ['jekyll:build'], function () {
    bs.reload();
});
gulp.task('watch', function () {
    gulp.watch(path.html, ['jekyll:rebuild']);
    gulp.watch(path.scss, ['sass']);
});
gulp.task('serve', ['browser-sync', 'watch']);

// 4. sass preprocessor
gulp.task('sass', function() {
    return gulp.src('scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('_site/styles/'))
        .pipe(bs.stream())
        .pipe(gulp.dest('styles'));
});

// test
gulp.task('hello', function () {
    console.log('Hey, good news for everyone!');
});