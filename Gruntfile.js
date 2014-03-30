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
                dest: 'build/entropy.js'
          }
        },

        wrap: {
            basic: {
                src: ['build/entropy.js'],
                dest: 'build/entropy.js',
                options: {
                    wrapper: ['(function (global) {\n', '\n})(this);']
                }
            }
        },
        
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
                  'build/entropy.min.js': ['<%= concat.build.dest %>']
                }
            }
        },
        qunit: {
            all: ['tests/*.html']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'concat', 'wrap', 'uglify', 'qunit']);

};