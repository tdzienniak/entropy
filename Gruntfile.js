module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['build']
        },

        concat: {
            options: {
                separator: '\n\n'
            },
            build: {
                // the files to concatenate
                src: ['src/**/*.js'],
                // the location of the resulting JS file
                dest: 'build/<%= pkg.name %>.js'
          }
        },

        wrap: {
            basic: {
                src: ['build/<%= pkg.name %>.js'],
                dest: 'build/<%= pkg.name %>.js',
                options: {
                    wrapper: ['(function (global) {\n', '\n})(this);']
                }
            }
        },

        /*'closure-compiler': {
            build: {
              closurePath: '../cc',
              js: 'build/<%= pkg.name %>.js',
              jsOutputFile: 'build/<%= pkg.name %>.min.js',
              maxBuffer: 500,
              options: {
                compilation_level: 'ADVANCED_OPTIMIZATIONS',
                language_in: 'ECMASCRIPT5_STRICT'
              }
            }
        },*/

        
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                //       + '"use strict";',
                mangle: true,
                sourceMap: 'entropy.map.js'
                //wrap: true
            },
            build: {
                files: {
                  'build/<%= pkg.name %>.min.js': ['<%= concat.build.dest %>']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-wrap');
    //grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'concat', 'wrap',/* 'closure-compiler',*/ 'uglify']);

};