config = (name) ->
  require('./tasks/grunt/' + name)

module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.initConfig
    pkg: grunt.file.readJSON('bower.json')

    broccoli:       config 'broccoli'
    clean:          config 'clean'
    testem:         config 'testem'

  # load local tasks
  grunt.task.loadTasks('./tasks')

  grunt.registerTask('broccoli_production_test', [
    'clean:build'
    'broccoli:production_test:build'
  ])

  grunt.registerTask('broccoli_dist', [
    'clean:dist'
    'broccoli:dist:build'
  ])

  grunt.registerTask('test', [
    'broccoli_production_test'
    'testem:ci:build'
    'clean:build'
  ])

  grunt.registerTask('dist', [
    'test'
    'broccoli_dist'
  ])

  grunt.registerTask('default', [
    'dist'
  ])
