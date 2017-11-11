let gulp = require("gulp");
let ts = require("gulp-typescript");
const dotenv = require('./gulp-dotenv-types-generator');
let tsProject = ts.createProject("tsconfig.json");

gulp.task('build-env-types', (next) => {
    dotenv(`${__dirname}/.env`, `${__dirname}/index.d.ts`);
    return next();
});

gulp.task('build', ['build-env-types'], function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
