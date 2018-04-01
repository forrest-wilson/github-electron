//**** Modules ****//
const gulp = require("gulp");
const jshint = require("gulp-jshint");

gulp.task("jshint", () => {
    return gulp.src(["**/*.js", "!node_modules/**"])
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("default", ["jshint"], (cb) => {
    gulp.watch(["**/*.js", "!node_modules/**"], ["jshint"], cb);
});