module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['build']
        },

        browserify: {
            standalone: {
                src: [ './src/entropy.coffee' ],
                dest: './build/entropy.js',
                options: {
                    transform: ['coffeeify'],
                    browserifyOptions: {
                        extensions: [".coffee"]
                    },
                    bundleOptions: {
                        standalone: '<%= pkg.name %>'
                    }
                }
            },
        },
        
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                //       + '"use strict";',
                mangle: true,
                sourceMap: 'build/entropy.map.js'
                //wrap: true
            },
            build: {
                files: {
                  'build/entropy.min.js': ['./build/entropy.js']
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
    grunt.loadNpmTasks('grunt-browserify');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'browserify', /*'wrap', */'uglify'/*, /*'qunit'*/]);

};