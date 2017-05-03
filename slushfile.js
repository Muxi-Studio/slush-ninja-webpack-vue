"use strict";

const gulp = require('gulp');
const install = require('gulp-install');
const conflict = require('gulp-conflict');
const rename = require('gulp-rename');
const template = require('gulp-template');
const inquirer = require('inquirer');

gulp.task('default', function(done) {
  // ask
  inquirer.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'Project name',
      default: getName()
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description',
      default: 'A vue project.'
    },
    {
      type: 'confirm',
      name: 'vuerouter',
      message: 'Vue-router?',
      default: true
    },
    {
      type: 'list',
      name: 'es6',
      message: 'Which ES2015+ compiler do you want to use?',
      default: '',
      choices: [
        {name: 'babel (preset-es2015, preset-stage-0, preset-stage-2, plugin-transform-runtime)', value: ''},
        {name: 'bublé (only use wepback 2)', value: 'buble'}
      ]
    },
    {
      type: 'list',
      name: 'csstype',
      message: 'Which CSS preprocessor do you want to use?',
      default: 'sass',
      choices: [
        {name: 'Sass', value: 'sass'},
        {name: 'Less', value: 'less'},
        {name: 'Only CSS', value: ''}
      ]
    },
    {
      type: 'confirm',
      name: 'eslint',
      message: 'ESLint?',
      default: true
    },
    {
      type: 'confirm',
      name: 'moveon',
      message: 'Continue?'
    }
  ], function (answers) {
	  if(!answers.moveon) {
	  	return done()
	  }

	  const filesPath = [__dirname + '/templates/**']

	  if(answers.es6) {
	  	filesPath = filesPath.concat([
	      '!' + __dirname + '/templates/_babelrc'
	    ])
	  }

	  gulp.src(filesPath, { dot: true })
	    .pipe(template(answers))
	    .pipe(rename(function (file) {
	      if (file.basename[0] === '_') {
	        file.basename = '.' + file.basename.slice(1)
	      }
	    }))
	    .pipe(conflict('./'))
	    .pipe(gulp.dest('./'))
	    .pipe(install())
	    .on('end', function () {
	      done()
	    })
	    .resume()
	}); 
});

function getName() {
  let path = require('path');
  try {
    return require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    return path.basename(process.cwd());
  }
};