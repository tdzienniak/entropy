module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['build']
        },

        browserify: {
            core: {
                dest: './build/entropy.js',
                src: [ './src/entropy.js' ],
                options: {
                    browserifyOptions: {
                        standalone: 'Entropy'
                    }
                }
            },
            plugins: {
                dest: './build/entropy-plugins.js',
                src: [ './plugins/index.js' ]
            }
        },

        uglify: {
            core: {
                options: {
                    banner: '/**\n* <%= pkg.name %> <%= pkg.version %> - framework for making games and not only games in entity system manner - build: <%= grunt.template.today("yyyy-mm-dd") %>\n*\n* @author       Tymoteusz Dzienniak <tymoteusz.dzienniak@outlook.com>\n* @license      {@link https://github.com/RainPhilosopher/Entropy/blob/master/LICENSE|MIT License}\n*/\n',
                    //       + '"use strict";',
                    mangle: true,
                    sourceMap: true,
                    sourceMapName: 'build/entropy.map.js'
                    //wrap: true
                },
                files: {
                  'build/entropy.min.js': ['./build/entropy.js']
                }
            },
            plugins: {
                options: {
                    banner: '/**\n* <%= pkg.name %> <%= pkg.version %> - framework for making games and not only games in entity system manner - build: <%= grunt.template.today("yyyy-mm-dd") %>\n*\n* @author       Tymoteusz Dzienniak <tymoteusz.dzienniak@outlook.com>\n* @license      {@link https://github.com/RainPhilosopher/Entropy/blob/master/LICENSE|MIT License}\n*/\n',
                    //       + '"use strict";',
                    mangle: true,
                    sourceMap: true,
                    sourceMapName: 'build/entropy-plugins.map.js'
                    //wrap: true
                },
                files: {
                  'build/entropy-plugins.min.js': ['./build/entropy-plugins.js']
                }
            }
        },

        yuidoc: {
            compile: {
                name: 'Entropy',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                logo: '../entropy.png',
                options: {
                    paths: ['./src', './plugins'],
                    outdir: './docs'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    // Default task(s).
    grunt.registerTask('build-core', ['clean', 'browserify:core', 'uglify:core']);
    grunt.registerTask('build-plugins', ['browserify:plugins', 'uglify:plugins']);
    grunt.registerTask('build-docs', ['yuidoc']);
    grunt.registerTask('build', ['build-core', 'build-plugins', 'build-docs']);

};
