
/*
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

* BEGIN: in terminal, from the project directory, run gulp build, then gulp to
  launch and create the project and project files.

--------------------------------------------------------------------------------
* SOURCE: https://css-tricks.com/gulp-for-beginners/
--------------------------------------------------------------------------------

* The directory structure for the app:

    |- app/                     -these files and directories were created by me
      |- css/                   -these files and directories were created by me
      |- fonts/                 -these files and directories were created by me
      |- images/                -these files and directories were created by me
      |- index.html             -these files and directories were created by me
      |- js/                    -these files and directories were created by me
      |- scss/                  -these files and directories were created by me
    |- dist/
      |- css
        |- styles.min.css
      |- images
      |- index.html
      |- js
        |- main.min.js
    |- gulpfile.js              -these files and directories were created by me
    |- node_modules/
    |- package.json

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

  * NOTES:

    - The require statement tells Node to look into the node_modules folder for a
      package named gulp. Once the package is found, we assign its contents to the
      variable gulp.

    - A gulp task in this gulpfile.js will store all of the gulp configurations.

    - gulp task syntax:
                        gulp.task("task-name", function(){
                          // gulp stuff here
                        });

    - task-name refers to the name of the task, which would be used whenever you
      want to run a task in Gulp.

    - a gulp task takes in two additional gulp methods:
      - gulp.src tells the Gulp task what files to use for the task
      - gulp.dest tells Gulp where to output the files once the task is completed

  * GLOBS:

    - Globs are matching patterns for files that allow you to add more than one
      file into gulp.src... When you use a glob, the computer checks file names and paths for the specified pattern. If the pattern exists, then a file is matched.

    - you can compile more than one scss file into css at the same time by using node globs

    - Most workflows with Gulp tend to only require 4 different globbing patterns:
      - *.scss: The * pattern is a wildcard that matches any pattern in the current directory. In this case, we’re matching any files ending with .scss in the root folder (project).
      - **//*.scss: This is a more extreme version of the * pattern that matches any file ending with .scss in the root folder and any child directories.
      - !not-me.scss: The ! indicates that Gulp should exclude the pattern from its matches, which is useful if you had to exclude a file from a matched pattern. In this case, not-me.scss would be excluded from the match.
      - *.+(scss | sass): The plus + and parentheses () allows Gulp to match multiple patterns, with different patterns separated by the pipe | character. In this case, Gulp will match any file ending with .scss or .sass in the root folder.
*/


//requirments
var gulp = require("gulp"),
    // init sass
    sass = require("gulp-sass"),
    // init browser sync
    browserSync = require("browser-sync"),
    // concatenates CSS and JavaScript files into a single file by looking for a comments in the html
    useref = require("gulp-useref"),
    // minifies javascript
    uglify = require("gulp-uglify"),

    gulpIf = require("gulp-if"),
    // minify css
    cssnano = require("gulp-cssnano"),
    // minimizes and compresses image files: png, jpg, gif, svg
    imagemin = require("gulp-imagemin"),

    cache = require("gulp-cache"),
    // cleanup files that are no longer used
    del = require("del"),
    // run tasks in sequential order
    runSequence = require("run-sequence");



//------------------------------------------------------------------------------ verification task
// verify that gulp is running
gulp.task("verify", function(){
  console.log("---------- gulp verified");
});





//------------------------------------------------------------------------------ sass task
// convert and compile scss to css, save from sccs dir, to css dir
gulp.task("sass", function(){
  return gulp.src("app/scss/**/*.scss") // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass()) // call the gulp sass plugin
    .pipe(gulp.dest("app/css")) // the destination of the outputted files
    .pipe(browserSync.reload({stream : true})); // the broswer sync call
});
//---------- DEVELOPMENT TASK





//------------------------------------------------------------------------------ browser-sync task
// initialize the browser-sync module, spin up servers
// this will let browser sync know where the root of the server should be
gulp.task("browserSync", function(){
  browserSync.init({
    server : {
      baseDir : "app" // root directory
    }
  })
  console.log("---------- sync verified");
});
//---------- DEVELOPMENT TASK





//------------------------------------------------------------------------------ useref task
// concatenate, optimize, compile and compress js files into one minified files
// create assets for distribution in dist dir
// run task to initialize concatenation
gulp.task("useref", function(){
  console.log("---------- useref verified");
  return gulp.src("app/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("dist"))
});
//---------- PRODUCTION TASK





//------------------------------------------------------------------------------ image min task
gulp.task("images", function(){
  return gulp.src("app/images/**/*.+(png|jpg|gif|svg)") // find all image file types in the app directory
    .pipe(cache(imagemin({ // clear cache and minify images
      interlaced : true // interlaced used for higher quality gif files
    })))
    .pipe(gulp.dest("dist/images")) // ouput new images to dist/images directory
})
//---------- PRODUCTION TASK





//------------------------------------------------------------------------------ font task
gulp.task("fonts", function(){
  return gulp.src("app/fonts/**/*")
    .pipe(gulp.dest("dist/fonts"))
})
//---------- PRODUCTION TASK





//------------------------------------------------------------------------------ watch task
// watch for updates on save and run tasks
gulp.task("watch", ["browserSync", "sass"], function(){
  gulp.watch("app/scss/**/*.scss", ["sass"]); // watch for scss saves and updates, then use the sass task
  gulp.watch("app/*.html", browserSync.reload); // watch for html saves and updates, then reload to show changes in the browser
  gulp.watch("app/js/**/*.js", browserSync.reload); // watch for js saves and updates, then reload to show changes in the browser
  console.log("---------- watch verified");
});
//---------- DEVELOPMENT TASK





//------------------------------------------------------------------------------ delete task
// clears away from the generated dist folder any image caches that are created
gulp.task("clean:dist", function(){
  return del.sync("dist");
});
//---------- PRODUCTION TASK



//------------------------------------------------------------------------------ sequence tag
// compile all tasks responsible for production and run them in sequence
// creates a dist folder for the production website.
gulp.task("build", function(first){
  runSequence("clean:dist", ["sass", "useref", "images", "fonts"], first);
})




//------------------------------------------------------------------------------ sequence task
// compile tasks responsible for development and run them in sequence
// default keyword used to initiate the task in terminal by typing "gulp"
gulp.task("default", function(second){
  runSequence(["sass", "browserSync", "watch"], second);
})
