//**** Modules ****//
const gulp = require("gulp");
const jshint = require("gulp-jshint");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");

//**** Tasks ****//
gulp.task("jshint", () => {
    return gulp.src(["**/*.js", "!node_modules/**"])
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("sass", () => {
    return gulp.src("./assets/stylesheets/sass/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false
        }))
        .pipe(sourcemaps.write(""))
        .pipe(gulp.dest("./assets/stylesheets/css/"));
});

gulp.task("default", ["jshint", "sass"], (cb) => {
    gulp.watch(["**/*.js", "!node_modules/**"], ["jshint"], cb);
    gulp.watch("./assets/stylesheets/sass/**/*.scss", ["sass"], cb);
});
