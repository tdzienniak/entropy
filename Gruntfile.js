module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['build']
        },

        browserify: {
            standalone: {
                dest: './build/entropy.js',
                src: [ './src/entropy.js' ],
                options: {
                    browserifyOptions: {
                        standalone: 'Entropy'
                    }
                }
            }
        },

        uglify: {
            options: {
                banner: '/**\n* <%= pkg.name %> <%= pkg.version %> - framework for making games and not only games in entity system manner - build: <%= grunt.template.today("yyyy-mm-dd") %>\n*\n* @author       Tymoteusz Dzienniak <tymoteusz.dzienniak@outlook.com>\n* @license      {@link https://github.com/RainPhilosopher/Entropy/blob/master/LICENSE|MIT License}\n*/\n',
                //       + '"use strict";',
                mangle: true,
                sourceMap: true,
                sourceMapName: 'build/entropy.map.js'
                //wrap: true
            },
            build: {
                files: {
                  'build/entropy.min.js': ['./build/entropy.js']
                }
            }
        },

        yuidoc: {
            compile: {
                name: 'Entropy',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                //url: '<%= pkg.homepage %>',
                options: {
                    paths: ['./src'],
                    outdir: './docs'
                }
            }
        },

        qunit: {
            all: ['test/*.html']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'browserify', 'uglify', 'yuidoc']);

};
