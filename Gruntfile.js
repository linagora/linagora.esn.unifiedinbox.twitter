'use strict';

var conf_path = './test/config/';
var servers = require(conf_path + 'servers-conf');
var GruntfileUtils = require('./tasks/utils/Gruntfile-utils');

module.exports = function(grunt) {
  var gruntfileUtils = new GruntfileUtils(grunt, servers);
  var runGrunt = gruntfileUtils.runGrunt();
  var shell = gruntfileUtils.shell();
  var command = gruntfileUtils.command();

  grunt.initConfig({
    eslint: {
      options: {
        config: '.eslintrc'
      },
      all: {
        src: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/**/*.js', 'backend/**/*.js', 'frontend/app/**/*.js']
      }
    },
    lint_pattern: {
      options: {
        rules: [
          { pattern: /(describe|it)\.only/, message: 'Must not use .only in tests' }
        ]
      },
      all: {
        src: ['<%= eslint.all.src %>']
      },
      css: {
        options: {
          rules: [
            { pattern: /important;(\s*$|(?=\s+[^/]))/, message: 'CSS important rules only allowed with explanatory comment' }
          ]
        },
        src: [
          'frontend/css/**/*.less'
        ]
      }
    },
    mochacli: {
      options: {
        require: ['chai', 'mockery'],
        reporter: 'spec',
        timeout: process.env.TEST_TIMEOUT || 20000,
        exit: true
      },
      backend: {
        options: {
          files: ['test/unit-backend/all.js', grunt.option('test') || 'test/unit-backend/**/*.js']
        }
      },
      midway: {
        options: {
          files: ['test/midway-backend/all.js', grunt.option('test') || 'test/midway-backend/**/*.js']
        }
      }
    },
    shell: {
      elasticsearch: shell.newShell(command.elasticsearch, /started/, 'Elasticsearch server is started.'),
      mongo: shell.newShell(command.mongo(false), new RegExp('connections on port ' + servers.mongodb.port), 'MongoDB server is started.'),
      redis: shell.newShell(command.redis, /on port/, 'Redis server is started')
    },
    run_grunt: {
      midway_backend: runGrunt.newProcess(['test-midway-backend']),
      unit_backend: runGrunt.newProcess(['test-unit-backend'])
    },
    karma: {
      unit: {
        configFile: './test/config/karma.conf.js',
        browsers: ['PhantomJS']
      }
    },

    i18n_checker: {
      all: {
        options: {
          baseDir: __dirname,
          dirs: [{
            localeDir: 'backend/lib/i18n/locales',
            templateSrc: [
              'frontend/app/**/*.pug'
            ],
            core: true
          }],
          verifyOptions: {
            defaultLocale: 'en',
            locales: ['en', 'fr', 'vi', 'zh']
          }
        }
      }
    },

    puglint: {
      all: {
        options: {
          config: {
            disallowAttributeInterpolation: true,
            disallowLegacyMixinCall: true,
            validateExtensions: true,
            validateIndentation: 2
          }
        },
        src: [
          'frontend/**/*.pug'
        ]
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('@linagora/grunt-lint-pattern');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-continue');
  grunt.loadNpmTasks('@linagora/grunt-run-grunt');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-wait-server');
  grunt.loadNpmTasks('@linagora/grunt-i18n-checker');
  grunt.loadNpmTasks('grunt-puglint');

  grunt.loadTasks('tasks');

  grunt.registerTask('setup-environment', 'create temp folders and files for tests', gruntfileUtils.setupEnvironment());
  grunt.registerTask('clean-environment', 'remove temp folder for tests', gruntfileUtils.cleanEnvironment());
  grunt.registerTask('setup-servers', ['spawn-servers', 'continue:on']);
  grunt.registerTask('spawn-servers', 'spawn servers', ['shell:mongo', 'shell:redis', 'shell:elasticsearch']);
  grunt.registerTask('kill-servers', 'kill servers', ['shell:mongo:kill', 'shell:redis:kill', 'shell:elasticsearch:kill']);

  grunt.registerTask('test-midway-backend', ['setup-environment', 'setup-servers', 'run_grunt:midway_backend', 'kill-servers', 'clean-environment']);
  grunt.registerTask('gitlab-test-midway-backend', ['setup-environment', 'run_grunt:midway_backend', 'clean-environment']);

  grunt.registerTask('test-unit-backend', 'Test backend code', ['mochacli:backend']);
  grunt.registerTask('test-unit-frontend', 'Unit test frontend code', ['karma:unit']);

  grunt.registerTask('test-frontend', 'Test frontend code', ['test-unit-frontend']);

  grunt.registerTask('test', ['linters', 'test-frontend', 'test-unit-backend', 'test-midway-backend']);

  grunt.registerTask('i18n', 'Check the translation files', ['i18n_checker']);
  grunt.registerTask('linters', 'Check code for lint', ['eslint:all', 'lint_pattern:all', 'i18n', 'pug-linter']);
  grunt.registerTask('linters-dev', 'Check changed files for lint', ['prepare-quick-lint', 'jshint:quick', 'jscs:quick', 'lint_pattern:quick']);
  grunt.registerTask('pug-linter', 'Check the pug/jade files', ['puglint:all']);
  grunt.registerTask('default', ['test']);
};
