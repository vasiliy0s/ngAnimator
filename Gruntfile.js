'use strict';

module.exports = function(grunt) {

  var jshintStylish = require('jshint-stylish');

  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  var sources = 'src/{,*/}*.js';

  var banner = '/**\n * ngAnimator v<%= pkg.version %>\n * <%= pkg.description %>\n * by <%= pkg.author %>\n */\n';

  var removeUseStrictRE = /^\'use\sstrict\';\n/;

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),   

    concat: {
      options: {
        banner: banner + '\n;(function (angular) {\n\n\n\'use strict\';\n\n',
        footer: '\n\n} (angular));\n',
        separator: '\n',
        process: function (src) {
          return src.replace(removeUseStrictRE, '');
        }
      },
      dist: {
        src: ['src/{,*/}*.js'],
        dest: 'ng-animator.js',
      },
    },

    uglify: {
      options: {
        banner: banner
      },
      dist: {
        files: {
          'ng-animator.min.js': ['<%= concat.dist.dest %>'],
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: jshintStylish
      },
      sources: {
        src: [sources]
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      dest: {
        src: ['<%= concat.dist.dest %>']
      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: [sources, 'demo/scripts/{,*/}*.js'],
        tasks: ['wiredep', 'includeSource:demo', 'newer:jshint:sources'],
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['newer:jshint:gruntfile']
      },
    },

    // Make angular module safety to DI after uglification.
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dest: {
        files: [{
          expand: true,
          cwd: './',
          src: ['ng-animator.js']
        }]
      }
    }

  });

  grunt.registerTask('build', [
    'jshint:sources', 
    'concat', 
    'ngAnnotate:dest',
    'jshint:dest',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'build'
  ]);
  
};
