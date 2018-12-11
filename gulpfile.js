var gulp = require('gulp');
var typedoc = require("gulp-typedoc");
 
gulp.task("typedoc", function() {
    return gulp
        .src(["src/**/**/*.ts"])
        .pipe(typedoc({
            // TypeScript options (see typescript docs)
            module: "commonjs",
            target: "es5",
            includeDeclarations: true,
 
            // Output options (see typedoc docs)
            out: "./out",
 
            // TypeDoc options (see typedoc docs)
            name: "my-project",
            theme: "/path/to/my/theme",
            plugins: ["my", "plugins"],
            ignoreCompilerErrors: false,
            version: true,
        }))
    ;
});