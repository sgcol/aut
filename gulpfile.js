var gulp = require('gulp');//引入gulp

var ejs  = require('gulp-ejs');//引入gulp-ejs

gulp.task('default', function() {

     gulp.src(['client/**/*.ejs', '!client/views/**'])//gulp.src中存放要编译的文件

         .pipe(ejs({},{},{ext: '.html'}))//设置生成的文件后缀名为html

        .pipe(gulp.dest('pub'));//gulp.dest中存放编译后的文件的存放地址
    gulp.src('client/**/!(*.ejs)')
        .pipe(gulp.dest('pub'));
    gulp.src('client/views/*.*').pipe(gulp.dest('pub/views'));

});

gulp.task('watch', function() {
    gulp.watch('client/**/*.*', ['default']);
})
