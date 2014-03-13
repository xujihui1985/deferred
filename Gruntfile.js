module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {

            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['src/deferred.js']
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'tests/spec/**/*.js']
        },
        watch: {
            files: ['<%= jshint.all %>'],
            tasks: ['uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'uglify']);

};