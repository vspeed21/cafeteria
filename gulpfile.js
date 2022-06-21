const { src, dest, watch, series } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done){
  // Compilar SASS
  src('src/scss/app.scss')//Identificar el/los archivo .scss a compilar
      .pipe(sourcemaps.init())
      .pipe( sass() ) //Compilarlo
      .pipe( postcss( [autoprefixer(), cssnano() ] ))
      .pipe(sourcemaps.write('.'))
      .pipe( dest('build/css') ) //Almacenarlo
  
  done();
}

function imagenes(){
  return src('src/img/**/*')
      .pipe(imagemin( {optimizationLevel: 3} ))
      .pipe( dest( 'build/img') )
}

function versionWebp() {
  const opciones = {
    quality: 70
  }
  return src('src/img/**/*.{jpg, png}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
}

function versionAvif(){
  const opciones = {
    quality: 70
  }
  return src('src/img/**/*.{jpg, png}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
}

function dev(done){
  watch('src/scss/**/*.scss', css)
  watch('src/img/**/*', imagenes)
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionAvif, versionWebp, css, dev );

// series - Inicia una tarea, y hasta que finaliza, inicia la siguiente
// parallel - Todas inician al mismo tiempo