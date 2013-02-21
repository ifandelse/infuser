module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    target: {
        dist: 'lib',
        all: 'lib/combined'
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'src/VersionHeader.js',
          'src/hashStorage.js',
          'src/scriptStore.js',
          'src/error.js',
          'src/helpers.js',
          'src/Api.js'
        ],
        dest: '<%= target.dist %>/<%= pkg.name %>.js'
      },
      all: {
        src: [
          'ext/TrafficCop.js',
          'src/VersionHeader.js',
          'src/hashStorage.js',
          'src/scriptStore.js',
          'src/error.js',
          'src/helpers.js',
          'src/Api.js'
        ],
        dest: '<%= target.all %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        files: {
          '<%= target.dist %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      },
      all: {
        files: {
          '<%= target.all %>/<%= pkg.name %>.min.js': ['<%= concat.all.dest %>']
        }
      }
    },
    compress: {
      dist: {
        options: {
           archive: '<%= target.dist %>/<%= pkg.name %>.min.gz.js',
           mode: 'gzip'
        },
        files: {
          '<%= target.dist %>/<%= pkg.name %>.min.gz.js': ['<%= target.dist %>/*.min.js']
        }
      },
      all: {
        options: {
           archive: '<%= target.all %>/<%= pkg.name %>.min.gz.js',
           mode: 'gzip'
        },
        files: {
          '<%= target.all %>/<%= pkg.name %>.min.gz.js': ['<%= target.all %>/*.min.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('build', ['concat', 'uglify', 'compress']);
};
