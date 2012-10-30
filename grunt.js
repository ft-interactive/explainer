/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*!\n* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> \n' +
        '* FINANCIAL TIMES Ltd. Licensed <%= pkg.license%>*/'
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: ['jquery.jplayer.js', '<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    mincss: {
      dist: {
        src: ['*.css'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.css'
      }
    },
    compress: {
      zip: {
        files : {
          "dist/<%= pkg.name %>-<%= pkg.version %>.zip": ["dist/*.min.js","dist/*.min.css", "./*.swf", "./font/*"]
        },
        options: {
          flatten:false,
          basePath:'dist'
        }
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {
      noCopyright:false
    }
  });

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-bump');

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min mincss');

  // Distribution
  grunt.registerTask('dist', 'default compress');

  // Release new version and push out to ftp 
  grunt.registerTask('release', 'bump dist');
  grunt.registerTask('release:patch', 'bump:patch dist');
  grunt.registerTask('release:minor', 'bump:minor dist');
  grunt.registerTask('release:major', 'bump:major dist');

};
