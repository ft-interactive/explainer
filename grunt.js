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
        dest: 'dist/<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    copy: {
      dist:{
        files: {
          "dist/<%= pkg.version %>/font/": "font/**",
          "dist/<%= pkg.version %>/Jplayer.swf": "Jplayer.swf"
        }
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    mincss: {
      dist: {
        src: ['*.css'],
        dest: 'dist/<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.min.css'
      }
    },
    compress: {
      zip: {
        files : {
          "dist/<%= pkg.name %>-<%= pkg.version %>.zip": ["dist/<%= pkg.version %>/**"]
        },
        options: {
          flatten:false,
          basePath:'dist/<%= pkg.version %>'
        }
      }
    },
    watch: {
      files: '*',
      tasks: ['default']
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
    },
    'ftp-deploy': {
      build: {
        auth: {
          host: 'interactive.ftdata.co.uk',
          port: 21,
          user: 'ftcointeractive'
        },
        src: 'dist/<%= pkg.version %>',
        dest: '/explainers/'
      }
    }
  });
  
  // Extend with extra tasks
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-bump'); // use to bump the version before working or making a distribution package
  grunt.loadNpmTasks('grunt-ftp-deploy');

  // Define Default task.
  grunt.registerTask('default', 'lint concat min mincss copy');

  // Define Distribution task
  grunt.registerTask('dist', 'default compress');

};
