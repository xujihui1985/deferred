module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            src: 'src/deferred.js',
            options: {
                specs: 'tests/spec/*Spec.js',
                vendor: [
                ],
                host : 'http://127.0.0.1:3000/'
            }
        },
        connect: {
            test: {
                options: {
                    port: 3000
                }
            },
            forever: {
                options: {
                    port: 3000,
                    keepalive: true
                }
            }
        },
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
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['jshint', 'uglify']);
    grunt.registerTask('test', ['connect:test', 'jasmine']);
};