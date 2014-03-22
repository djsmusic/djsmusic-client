/**
 * Build system for the DJsMusic Client 
 * @param {Object} grunt
 */
module.exports = function(grunt) {
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
		      {src: ['index-production.html'], dest: 'build/', filter: 'isFile'},
		      {expand:true, src: ['bootstrap-3/**'], dest: 'build/'},
		      {expand:true, src: ['img/**'], dest: 'build/'},
		      {expand:true, src: ['js/tpl/*'], dest: 'build/'},
		      {expand:true, src: ['js/app/views/*'], dest: 'build/'},
		      {expand:true, src: ['js/app/models/*'], dest: 'build/'},
		      {expand:true, src: ['js/app/collections/*'], dest: 'build/'},
		      {src: ['404.html'], dest: 'build/', filter: 'isFile'}
		    ]
		  }
		},
		rename:{
			html: {
				files: [
					{src: ['build/index-production.html'], dest: 'build/index.html'}
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
	    buildGhPages: {
		    options: {
		    	dist: "build"
		    },
		    production: {
		      	build_branch: "gh-pages",
		        dist: "build",
		        pull: true
		    },
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
	        options: {
	        },
	        src: [
	          'build/js/*.js',
	          'build/css/styles.css',
	        ],
	        dest: 'build/**/*.html'
	      },
	      images: {
	        options: {
	        },
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
	});
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-line-remover');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-hashres');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-rename');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-build-gh-pages');
	
	// Add the hashres to everything
	grunt.registerTask('cacheBust', [
	  'hashres:images',
	  'hashres:code'
	]);
	
	grunt.registerTask('release', [
	  'shell:bumpVersion'
	]); 
	
	grunt.registerTask('test', [
	  'clean',
	  'copy:html',
	  'rename:html',
	  'requirejs:compile',
	  'cssmin:production',
	  'cacheBust',
	  'lineremover'
	]);
	
	grunt.registerTask('deploy', [
	  'buildGhPages:production',
	  'release'
	]);
};