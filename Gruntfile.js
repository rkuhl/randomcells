module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt); // autoload tasks

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// ### Coffee ###
		coffee: {
			common: {
				src: 'src/*.coffee',
				dest: 'src/',
				expand: true, // one-to-one mapping
				flatten: true, //remove all unnecessary nesting
				ext: '.js'
			},
		},
		// ### Minify scripts ###
		uglify: {
			build: {
				src: 'src/*.js',
				dest: 'dist/',
				expand: true, // one-to-one mapping
				flatten: true, //remove all unnecessary nesting
				ext: '.min.js'
			}
		},

		// ### Watch ###
		watch: {
			options: {
				livereload: true
			},
			coffee: {
				files: ['src/*.coffee'],
				tasks: ['coffee'],
				options: {
					spawn: false
				}
			}
		}

	});

	// ### build (PRODUCTION)
	grunt.registerTask('build', ['coffee', 'uglify']);
	// ### default (DEV)
	grunt.registerTask('default', ['coffee', 'watch']);

};