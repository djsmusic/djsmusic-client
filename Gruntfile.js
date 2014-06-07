/**
 * Build system for the DJsMusic Client
 * @param {Object} grunt
 */
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		cfg: {

		},
		clean: {
			build: [
	        'build'
	      ]
		},
		cssmin: {
			production: {
				expand: true,
				cwd: 'css',
				src: ['*.css', '!*.min.css'],
				dest: 'build/css/'
			}
		},
		requirejs: {
			compile: {
				options: {
					mainConfigFile: "config.js",
					out: "build/js/app.js"
				}
			}
		},
		copy: {
			html: {
				files: [
		      // includes files within path
					{
						src: ['index-production.html'],
						dest: 'build/',
						filter: 'isFile'
					},
					{
						expand: true,
						src: ['bootstrap-3/**'],
						dest: 'build/'
					},
					{
						expand: true,
						src: ['img/**'],
						dest: 'build/'
					},
					{
						expand: true,
						src: ['js/tpl/*'],
						dest: 'build/'
					},
					{
						expand: true,
						src: ['js/app/views/*'],
						dest: 'build/'
					},
					{
						expand: true,
						src: ['js/app/models/*'],
						dest: 'build/'
					},
					{
						expand: true,
						src: ['js/app/collections/*'],
						dest: 'build/'
					},
					{
						src: ['404.html'],
						dest: 'build/',
						filter: 'isFile'
					},
					{
						src: ['CNAME'],
						dest: 'build/',
						filter: 'isFile'
					}
		    ]
			}
		},
		rename: {
			html: {
				files: [
					{
						src: ['build/index-production.html'],
						dest: 'build/index.html'
					}
				]
			}
		},
		lineremover: {
			html: {
				files: [
					{
						expand: true,
						cwd: 'build/',
						src: ['**/*.html'],
						dest: 'build/',
						ext: '.html'
	          }
	        ]
			},
			xml: {
				files: [
					{
						expand: true,
						cwd: 'build/',
						src: ['**/*.xml'],
						dest: 'build/',
						ext: '.xml'
	          }
	        ]
			}
		},
		'gh-pages': {
			options: {
				base: 'build',
				push: false,
				branch: 'gh-pages',
			},
			src: ['**']
		},
		shell: {
			bumpVersion: {
				command: 'npm version patch'
			}
		},
		hashres: {
			options: {
				encoding: 'utf8',
				fileNameFormat: '${name}.${hash}.cache.${ext}',
				renameFiles: true
			},
			code: {
				options: {},
				src: [
	          'build/js/*.js',
	          'build/css/styles.css',
	        ],
				dest: 'build/**/*.html'
			},
			images: {
				options: {},
				src: [
	          'build/**/*.png',
	          'build/**/*.jpg'
	        ],
				dest: [
	          'build/**/*.html',
	          'build/**/*.js',
	          'build/**/*.css',
	          'build/**/*.md'
	        ]
			}
		},
		releaseBranchPre: releaseBranchOptions,
		releaseBranch: releaseBranchOptions
	});

	var releaseBranchOptions = {
		app: {
			options: {
				//the name of the orphan branch. Default is gh-pages
				releaseBranch: 'gh-pages',
				//the name of the remote repository. Default is origin
				remoteRepository: 'origin',
				//point the way to the root folder of your repository (default is .)
				cwd: '../',
				//the name of the output directory. Default is dist
				distDir: 'app/dist',
				//the commit message to be used for the optional commit
				commitMessage: 'RELEASE',
				//should files be automatically commited on the orphan branch
				commit: true,
				//should the orphan branch be pushed to the remote repository
				//default is false
				push: true,
				//should the branch be an orphan branch
				//default is false
				orphan: true,
				//a blacklist of things to keep on the root level. By default only
				//the .git folder will be kept.
				blacklist: [
                '.git'
            ]
			}
		}
	};

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-line-remover');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-hashres');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-rename');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-release-branch');

	// Add the hashres to everything
	grunt.registerTask('cacheBust', [
	  'hashres:images',
	  'hashres:code'
	]);

	grunt.registerTask('release', [
	  'shell:bumpVersion'
	]);

	grunt.registerTask('build', [
	  'clean',
	  'copy:html',
	  'rename:html',
	  'requirejs:compile',
	  'cssmin:production',
	  'cacheBust',
	  'lineremover'
	]);

	grunt.registerTask('deploy', [
	  'releaseBranchPre:app',
	  'releaseBranch:app',
	]);
};