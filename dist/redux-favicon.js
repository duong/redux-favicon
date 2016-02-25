(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReduxFavicon"] = factory();
	else
		root["ReduxFavicon"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	// The middleware is kept as simple as possible.
	// All favicon operations are delegated to a function below.


	exports.default = function () {
	  var favicoOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  // Detect if this middleware is being used without being 'preloaded',
	  // by being passed a store instead of favicoOptions
	  if (typeof favicoOptions.getState === 'function') {
	    console.error('redux-favicon middleware not preloaded! \nYou need to first call reduxFavicon with its configuration to initialize it, THEN pass it to createStore.\n\nSee https://github.com/joshwcomeau/redux-favico/#troubleshooting');
	  }

	  var favicon = favicoIntegration(favicoOptions);

	  return function (store) {
	    return function (next) {
	      return function (action) {
	        // Ignore actions that don't tweak the favicon
	        if (!action.meta || typeof action.meta.favicon === 'undefined') {
	          return next(action);
	        }

	        favicon.update(action.meta.favicon, function (err) {
	          if (err) console.warn(err);

	          return next(action);
	        });
	      };
	    };
	  };
	};

	var _favico = __webpack_require__(1);

	var _favico2 = _interopRequireDefault(_favico);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var defaultFavicoOptions = { animation: 'slide' };
	var favicoEnumValues = ['increment', 'decrement', 'reset'];

	// This integration communicates directly with Favico.js to set the badge.
	function favicoIntegration() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? defaultFavicoOptions : arguments[0];

	  // Create a new Favico integration.
	  // Initially this was going to be a singleton object, but I realized there
	  // may be cases where you want several different types of notifications.
	  // The middleware does not yet support multiple instances, but it should
	  // be easy to add if there's demand :)
	  //
	  // Not using the constructor pattern, because it obfuscates JS' prototypal
	  // nature, and there's no need for inheritance here, so this is equivalent.
	  var favico = new _favico2.default(options);

	  return {
	    currentVal: 0,

	    update: function update(value, callback) {
	      if (typeof value === 'number') {
	        // Don't allow non-integer values
	        if (value % 1 !== 0) {
	          var errorMessage = '\n            Warning: Favico not affected.\n            You provided a floating-point value: ' + value + '.\n            You need to provide an integer, or a keyword value.\n            See <INSERT LINK> for more information.\n          ';
	          return callback(errorMessage);
	        }

	        this.currentVal = value;
	      } else if (typeof value === 'string') {
	        switch (value.toLowerCase()) {
	          case 'increment':
	            this.currentVal++;break;
	          case 'decrement':
	            this.currentVal--;break;
	          case 'reset':
	            this.currentVal = 0;break;
	          default:
	            var errorMessage = '\n              Warning: Favico not affected.\n              You provided a string value: ' + value + '.\n              The only strings we accept are: ' + favicoEnumValues.join(', ') + '.\n              See <INSERT LINK> for more information.\n            ';
	            return callback(errorMessage);
	        }
	      } else {
	        var errorMessage = '\n          Warning: Favico provided an illegal type.\n          You provided a a value of type: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + '.\n          We only accept integers or strings.\n          See <INSERT LINK> for more information.\n        ';
	        return callback(errorMessage);
	      }

	      // Don't allow negative numbers
	      this.currentVal = this.currentVal < 0 ? 0 : this.currentVal;

	      // Set the 'badge' to be our derived value.
	      // The favico.js library will show it if it's a positive number,
	      // or hide it if it isn't.
	      favico.badge(this.currentVal);

	      return callback();
	    }
	  };
	}
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @license MIT
	 * @fileOverview Favico animations
	 * @author Miroslav Magda, http://blog.ejci.net
	 * @version 0.3.10
	 */

	/**
	 * Create new favico instance
	 * @param {Object} Options
	 * @return {Object} Favico object
	 * @example
	 * var favico = new Favico({
	 *    bgColor : '#d00',
	 *    textColor : '#fff',
	 *    fontFamily : 'sans-serif',
	 *    fontStyle : 'bold',
	 *    position : 'down',
	 *    type : 'circle',
	 *    animation : 'slide',
	 *    dataUrl: function(url){},
	 *    win: top
	 * });
	 */
	(function () {

		var Favico = (function (opt) {
			'use strict';
			opt = (opt) ? opt : {};
			var _def = {
				bgColor: '#d00',
				textColor: '#fff',
				fontFamily: 'sans-serif', //Arial,Verdana,Times New Roman,serif,sans-serif,...
				fontStyle: 'bold', //normal,italic,oblique,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
				type: 'circle',
				position: 'down', // down, up, left, leftup (upleft)
				animation: 'slide',
				elementId: false,
				dataUrl: false,
				win: window
			};
			var _opt, _orig, _h, _w, _canvas, _context, _img, _ready, _lastBadge, _running, _readyCb, _stop, _browser, _animTimeout, _drawTimeout, _doc;

			_browser = {};
			_browser.ff = typeof InstallTrigger != 'undefined';
			_browser.chrome = !!window.chrome;
			_browser.opera = !!window.opera || navigator.userAgent.indexOf('Opera') >= 0;
			_browser.ie = /*@cc_on!@*/false;
			_browser.safari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
			_browser.supported = (_browser.chrome || _browser.ff || _browser.opera);

			var _queue = [];
			_readyCb = function () {
			};
			_ready = _stop = false;
			/**
			 * Initialize favico
			 */
			var init = function () {
				//merge initial options
				_opt = merge(_def, opt);
				_opt.bgColor = hexToRgb(_opt.bgColor);
				_opt.textColor = hexToRgb(_opt.textColor);
				_opt.position = _opt.position.toLowerCase();
				_opt.animation = (animation.types['' + _opt.animation]) ? _opt.animation : _def.animation;

				_doc = _opt.win.document;

				var isUp = _opt.position.indexOf('up') > -1;
				var isLeft = _opt.position.indexOf('left') > -1;

				//transform animation
				if (isUp || isLeft) {
					for (var i = 0; i < animation.types['' + _opt.animation].length; i++) {
						var step = animation.types['' + _opt.animation][i];

						if (isUp) {
							if (step.y < 0.6) {
								step.y = step.y - 0.4;
							} else {
								step.y = step.y - 2 * step.y + (1 - step.w);
							}
						}

						if (isLeft) {
							if (step.x < 0.6) {
								step.x = step.x - 0.4;
							} else {
								step.x = step.x - 2 * step.x + (1 - step.h);
							}
						}

						animation.types['' + _opt.animation][i] = step;
					}
				}
				_opt.type = (type['' + _opt.type]) ? _opt.type : _def.type;

				_orig = link.getIcon();
				//create temp canvas
				_canvas = document.createElement('canvas');
				//create temp image
				_img = document.createElement('img');
				if (_orig.hasAttribute('href')) {
					_img.setAttribute('crossOrigin', 'anonymous');
					//get width/height
					_img.onload = function () {
						_h = (_img.height > 0) ? _img.height : 32;
						_w = (_img.width > 0) ? _img.width : 32;
						_canvas.height = _h;
						_canvas.width = _w;
						_context = _canvas.getContext('2d');
						icon.ready();
					};
					_img.setAttribute('src', _orig.getAttribute('href'));
				} else {
					_img.onload = function () {
						_h = 32;
						_w = 32;
						_img.height = _h;
						_img.width = _w;
						_canvas.height = _h;
						_canvas.width = _w;
						_context = _canvas.getContext('2d');
						icon.ready();
					};
					_img.setAttribute('src', '');
				}

			};
			/**
			 * Icon namespace
			 */
			var icon = {};
			/**
			 * Icon is ready (reset icon) and start animation (if ther is any)
			 */
			icon.ready = function () {
				_ready = true;
				icon.reset();
				_readyCb();
			};
			/**
			 * Reset icon to default state
			 */
			icon.reset = function () {
				//reset
				if (!_ready) {
					return;
				}
				_queue = [];
				_lastBadge = false;
				_running = false;
				_context.clearRect(0, 0, _w, _h);
				_context.drawImage(_img, 0, 0, _w, _h);
				//_stop=true;
				link.setIcon(_canvas);
				//webcam('stop');
				//video('stop');
				window.clearTimeout(_animTimeout);
				window.clearTimeout(_drawTimeout);
			};
			/**
			 * Start animation
			 */
			icon.start = function () {
				if (!_ready || _running) {
					return;
				}
				var finished = function () {
					_lastBadge = _queue[0];
					_running = false;
					if (_queue.length > 0) {
						_queue.shift();
						icon.start();
					} else {

					}
				};
				if (_queue.length > 0) {
					_running = true;
					var run = function () {
						// apply options for this animation
						['type', 'animation', 'bgColor', 'textColor', 'fontFamily', 'fontStyle'].forEach(function (a) {
							if (a in _queue[0].options) {
								_opt[a] = _queue[0].options[a];
							}
						});
						animation.run(_queue[0].options, function () {
							finished();
						}, false);
					};
					if (_lastBadge) {
						animation.run(_lastBadge.options, function () {
							run();
						}, true);
					} else {
						run();
					}
				}
			};

			/**
			 * Badge types
			 */
			var type = {};
			var options = function (opt) {
				opt.n = ((typeof opt.n) === 'number') ? Math.abs(opt.n | 0) : opt.n;
				opt.x = _w * opt.x;
				opt.y = _h * opt.y;
				opt.w = _w * opt.w;
				opt.h = _h * opt.h;
				opt.len = ("" + opt.n).length;
				return opt;
			};
			/**
			 * Generate circle
			 * @param {Object} opt Badge options
			 */
			type.circle = function (opt) {
				opt = options(opt);
				var more = false;
				if (opt.len === 2) {
					opt.x = opt.x - opt.w * 0.4;
					opt.w = opt.w * 1.4;
					more = true;
				} else if (opt.len >= 3) {
					opt.x = opt.x - opt.w * 0.65;
					opt.w = opt.w * 1.65;
					more = true;
				}
				_context.clearRect(0, 0, _w, _h);
				_context.drawImage(_img, 0, 0, _w, _h);
				_context.beginPath();
				_context.font = _opt.fontStyle + " " + Math.floor(opt.h * (opt.n > 99 ? 0.85 : 1)) + "px " + _opt.fontFamily;
				_context.textAlign = 'center';
				if (more) {
					_context.moveTo(opt.x + opt.w / 2, opt.y);
					_context.lineTo(opt.x + opt.w - opt.h / 2, opt.y);
					_context.quadraticCurveTo(opt.x + opt.w, opt.y, opt.x + opt.w, opt.y + opt.h / 2);
					_context.lineTo(opt.x + opt.w, opt.y + opt.h - opt.h / 2);
					_context.quadraticCurveTo(opt.x + opt.w, opt.y + opt.h, opt.x + opt.w - opt.h / 2, opt.y + opt.h);
					_context.lineTo(opt.x + opt.h / 2, opt.y + opt.h);
					_context.quadraticCurveTo(opt.x, opt.y + opt.h, opt.x, opt.y + opt.h - opt.h / 2);
					_context.lineTo(opt.x, opt.y + opt.h / 2);
					_context.quadraticCurveTo(opt.x, opt.y, opt.x + opt.h / 2, opt.y);
				} else {
					_context.arc(opt.x + opt.w / 2, opt.y + opt.h / 2, opt.h / 2, 0, 2 * Math.PI);
				}
				_context.fillStyle = 'rgba(' + _opt.bgColor.r + ',' + _opt.bgColor.g + ',' + _opt.bgColor.b + ',' + opt.o + ')';
				_context.fill();
				_context.closePath();
				_context.beginPath();
				_context.stroke();
				_context.fillStyle = 'rgba(' + _opt.textColor.r + ',' + _opt.textColor.g + ',' + _opt.textColor.b + ',' + opt.o + ')';
				//_context.fillText((more) ? '9+' : opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
				if ((typeof opt.n) === 'number' && opt.n > 999) {
					_context.fillText(((opt.n > 9999) ? 9 : Math.floor(opt.n / 1000)) + 'k+', Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.2));
				} else {
					_context.fillText(opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
				}
				_context.closePath();
			};
			/**
			 * Generate rectangle
			 * @param {Object} opt Badge options
			 */
			type.rectangle = function (opt) {
				opt = options(opt);
				var more = false;
				if (opt.len === 2) {
					opt.x = opt.x - opt.w * 0.4;
					opt.w = opt.w * 1.4;
					more = true;
				} else if (opt.len >= 3) {
					opt.x = opt.x - opt.w * 0.65;
					opt.w = opt.w * 1.65;
					more = true;
				}
				_context.clearRect(0, 0, _w, _h);
				_context.drawImage(_img, 0, 0, _w, _h);
				_context.beginPath();
				_context.font = _opt.fontStyle + " " + Math.floor(opt.h * (opt.n > 99 ? 0.9 : 1)) + "px " + _opt.fontFamily;
				_context.textAlign = 'center';
				_context.fillStyle = 'rgba(' + _opt.bgColor.r + ',' + _opt.bgColor.g + ',' + _opt.bgColor.b + ',' + opt.o + ')';
				_context.fillRect(opt.x, opt.y, opt.w, opt.h);
				_context.fillStyle = 'rgba(' + _opt.textColor.r + ',' + _opt.textColor.g + ',' + _opt.textColor.b + ',' + opt.o + ')';
				//_context.fillText((more) ? '9+' : opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
				if ((typeof opt.n) === 'number' && opt.n > 999) {
					_context.fillText(((opt.n > 9999) ? 9 : Math.floor(opt.n / 1000)) + 'k+', Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.2));
				} else {
					_context.fillText(opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
				}
				_context.closePath();
			};

			/**
			 * Set badge
			 */
			var badge = function (number, opts) {
				console.log("\n\n\nI SHOULD NEVER BE CALLED\n\n\n")
				opts = ((typeof opts) === 'string' ? {
					animation: opts
				} : opts) || {};
				_readyCb = function () {
					try {
						if (typeof (number) === 'number' ? (number > 0) : (number !== '')) {
							var q = {
								type: 'badge',
								options: {
									n: number
								}
							};
							if ('animation' in opts && animation.types['' + opts.animation]) {
								q.options.animation = '' + opts.animation;
							}
							if ('type' in opts && type['' + opts.type]) {
								q.options.type = '' + opts.type;
							}
							['bgColor', 'textColor'].forEach(function (o) {
								if (o in opts) {
									q.options[o] = hexToRgb(opts[o]);
								}
							});
							['fontStyle', 'fontFamily'].forEach(function (o) {
								if (o in opts) {
									q.options[o] = opts[o];
								}
							});
							_queue.push(q);
							if (_queue.length > 100) {
								throw new Error('Too many badges requests in queue.');
							}
							icon.start();
						} else {
							icon.reset();
						}
					} catch (e) {
						throw new Error('Error setting badge. Message: ' + e.message);
					}
				};
				if (_ready) {
					_readyCb();
				}
			};

			/**
			 * Set image as icon
			 */
			var image = function (imageElement) {
				_readyCb = function () {
					try {
						var w = imageElement.width;
						var h = imageElement.height;
						var newImg = document.createElement('img');
						var ratio = (w / _w < h / _h) ? (w / _w) : (h / _h);
						newImg.setAttribute('crossOrigin', 'anonymous');
						newImg.onload=function(){
							_context.clearRect(0, 0, _w, _h);
							_context.drawImage(newImg, 0, 0, _w, _h);
							link.setIcon(_canvas);
						};
						newImg.setAttribute('src', imageElement.getAttribute('src'));
						newImg.height = (h / ratio);
						newImg.width = (w / ratio);
					} catch (e) {
						throw new Error('Error setting image. Message: ' + e.message);
					}
				};
				if (_ready) {
					_readyCb();
				}
			};
			/**
			 * Set video as icon
			 */
			var video = function (videoElement) {
				_readyCb = function () {
					try {
						if (videoElement === 'stop') {
							_stop = true;
							icon.reset();
							_stop = false;
							return;
						}
						//var w = videoElement.width;
						//var h = videoElement.height;
						//var ratio = (w / _w < h / _h) ? (w / _w) : (h / _h);
						videoElement.addEventListener('play', function () {
							drawVideo(this);
						}, false);

					} catch (e) {
						throw new Error('Error setting video. Message: ' + e.message);
					}
				};
				if (_ready) {
					_readyCb();
				}
			};
			/**
			 * Set video as icon
			 */
			var webcam = function (action) {
				//UR
				if (!window.URL || !window.URL.createObjectURL) {
					window.URL = window.URL || {};
					window.URL.createObjectURL = function (obj) {
						return obj;
					};
				}
				if (_browser.supported) {
					var newVideo = false;
					navigator.getUserMedia = navigator.getUserMedia || navigator.oGetUserMedia || navigator.msGetUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
					_readyCb = function () {
						try {
							if (action === 'stop') {
								_stop = true;
								icon.reset();
								_stop = false;
								return;
							}
							newVideo = document.createElement('video');
							newVideo.width = _w;
							newVideo.height = _h;
							navigator.getUserMedia({
								video: true,
								audio: false
							}, function (stream) {
								newVideo.src = URL.createObjectURL(stream);
								newVideo.play();
								drawVideo(newVideo);
							}, function () {
							});
						} catch (e) {
							throw new Error('Error setting webcam. Message: ' + e.message);
						}
					};
					if (_ready) {
						_readyCb();
					}
				}

			};

			/**
			 * Draw video to context and repeat :)
			 */
			function drawVideo(video) {
				if (video.paused || video.ended || _stop) {
					return false;
				}
				//nasty hack for FF webcam (Thanks to Julian Ćwirko, kontakt@redsunmedia.pl)
				try {
					_context.clearRect(0, 0, _w, _h);
					_context.drawImage(video, 0, 0, _w, _h);
				} catch (e) {

				}
				_drawTimeout = setTimeout(function () {
					drawVideo(video);
				}, animation.duration);
				link.setIcon(_canvas);
			}

			var link = {};
			/**
			 * Get icon from HEAD tag or create a new <link> element
			 */
			link.getIcon = function () {
				var elm = false;
				//get link element
				var getLink = function () {
					var link = _doc.getElementsByTagName('head')[0].getElementsByTagName('link');
					for (var l = link.length, i = (l - 1); i >= 0; i--) {
						if ((/(^|\s)icon(\s|$)/i).test(link[i].getAttribute('rel'))) {
							return link[i];
						}
					}
					return false;
				};
				if (_opt.element) {
					elm = _opt.element;
				} else if (_opt.elementId) {
					//if img element identified by elementId
					elm = _doc.getElementById(_opt.elementId);
					elm.setAttribute('href', elm.getAttribute('src'));
				} else {
					//if link element
					elm = getLink();
					if (elm === false) {
						elm = _doc.createElement('link');
						elm.setAttribute('rel', 'icon');
						_doc.getElementsByTagName('head')[0].appendChild(elm);
					}
				}
				elm.setAttribute('type', 'image/png');
				return elm;
			};
			link.setIcon = function (canvas) {
				var url = canvas.toDataURL('image/png');
				if (_opt.dataUrl) {
					//if using custom exporter
					_opt.dataUrl(url);
				}
				if (_opt.element) {
					_opt.element.setAttribute('href', url);
					_opt.element.setAttribute('src', url);
				} else if (_opt.elementId) {
					//if is attached to element (image)
					var elm = _doc.getElementById(_opt.elementId);
					elm.setAttribute('href', url);
					elm.setAttribute('src', url);
				} else {
					//if is attached to fav icon
					if (_browser.ff || _browser.opera) {
						//for FF we need to "recreate" element, atach to dom and remove old <link>
						//var originalType = _orig.getAttribute('rel');
						var old = _orig;
						_orig = _doc.createElement('link');
						//_orig.setAttribute('rel', originalType);
						if (_browser.opera) {
							_orig.setAttribute('rel', 'icon');
						}
						_orig.setAttribute('rel', 'icon');
						_orig.setAttribute('type', 'image/png');
						_doc.getElementsByTagName('head')[0].appendChild(_orig);
						_orig.setAttribute('href', url);
						if (old.parentNode) {
							old.parentNode.removeChild(old);
						}
					} else {
						_orig.setAttribute('href', url);
					}
				}
			};

			//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb#answer-5624139
			//HEX to RGB convertor
			function hexToRgb(hex) {
				var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
				hex = hex.replace(shorthandRegex, function (m, r, g, b) {
					return r + r + g + g + b + b;
				});
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : false;
			}

			/**
			 * Merge options
			 */
			function merge(def, opt) {
				var mergedOpt = {};
				var attrname;
				for (attrname in def) {
					mergedOpt[attrname] = def[attrname];
				}
				for (attrname in opt) {
					mergedOpt[attrname] = opt[attrname];
				}
				return mergedOpt;
			}

			/**
			 * Cross-browser page visibility shim
			 * http://stackoverflow.com/questions/12536562/detect-whether-a-window-is-visible
			 */
			function isPageHidden() {
				return _doc.hidden || _doc.msHidden || _doc.webkitHidden || _doc.mozHidden;
			}

			/**
			 * @namespace animation
			 */
			var animation = {};
			/**
			 * Animation "frame" duration
			 */
			animation.duration = 40;
			/**
			 * Animation types (none,fade,pop,slide)
			 */
			animation.types = {};
			animation.types.fade = [{
				x: 0.4,
				y: 0.4,
				w: 0.6,
				h: 0.6,
				o: 0.0
			}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 0.1
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 0.2
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 0.3
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 0.4
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 0.5
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 0.6
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 0.7
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 0.8
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 0.9
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 1.0
				}];
			animation.types.none = [{
				x: 0.4,
				y: 0.4,
				w: 0.6,
				h: 0.6,
				o: 1
			}];
			animation.types.pop = [{
				x: 1,
				y: 1,
				w: 0,
				h: 0,
				o: 1
			}, {
					x: 0.9,
					y: 0.9,
					w: 0.1,
					h: 0.1,
					o: 1
				}, {
					x: 0.8,
					y: 0.8,
					w: 0.2,
					h: 0.2,
					o: 1
				}, {
					x: 0.7,
					y: 0.7,
					w: 0.3,
					h: 0.3,
					o: 1
				}, {
					x: 0.6,
					y: 0.6,
					w: 0.4,
					h: 0.4,
					o: 1
				}, {
					x: 0.5,
					y: 0.5,
					w: 0.5,
					h: 0.5,
					o: 1
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 1
				}];
			animation.types.popFade = [{
				x: 0.75,
				y: 0.75,
				w: 0,
				h: 0,
				o: 0
			}, {
					x: 0.65,
					y: 0.65,
					w: 0.1,
					h: 0.1,
					o: 0.2
				}, {
					x: 0.6,
					y: 0.6,
					w: 0.2,
					h: 0.2,
					o: 0.4
				}, {
					x: 0.55,
					y: 0.55,
					w: 0.3,
					h: 0.3,
					o: 0.6
				}, {
					x: 0.50,
					y: 0.50,
					w: 0.4,
					h: 0.4,
					o: 0.8
				}, {
					x: 0.45,
					y: 0.45,
					w: 0.5,
					h: 0.5,
					o: 0.9
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 1
				}];
			animation.types.slide = [{
				x: 0.4,
				y: 1,
				w: 0.6,
				h: 0.6,
				o: 1
			}, {
					x: 0.4,
					y: 0.9,
					w: 0.6,
					h: 0.6,
					o: 1
				}, {
					x: 0.4,
					y: 0.9,
					w: 0.6,
					h: 0.6,
					o: 1
				}, {
					x: 0.4,
					y: 0.8,
					w: 0.6,
					h: 0.6,
					o: 1
				}, {
					x: 0.4,
					y: 0.7,
					w: 0.6,
					h: 0.6,
					o: 1
				}, {
					x: 0.4,
					y: 0.6,
					w: 0.6,
					h: 0.6,
					o: 1
				}, {
					x: 0.4,
					y: 0.5,
					w: 0.6,
					h: 0.6,
					o: 1
				}, {
					x: 0.4,
					y: 0.4,
					w: 0.6,
					h: 0.6,
					o: 1
				}];
			/**
			 * Run animation
			 * @param {Object} opt Animation options
			 * @param {Object} cb Callabak after all steps are done
			 * @param {Object} revert Reverse order? true|false
			 * @param {Object} step Optional step number (frame bumber)
			 */
			animation.run = function (opt, cb, revert, step) {
				var animationType = animation.types[isPageHidden() ? 'none' : _opt.animation];
				if (revert === true) {
					step = (typeof step !== 'undefined') ? step : animationType.length - 1;
				} else {
					step = (typeof step !== 'undefined') ? step : 0;
				}
				cb = (cb) ? cb : function () {
				};
				if ((step < animationType.length) && (step >= 0)) {
					type[_opt.type](merge(opt, animationType[step]));
					_animTimeout = setTimeout(function () {
						if (revert) {
							step = step - 1;
						} else {
							step = step + 1;
						}
						animation.run(opt, cb, revert, step);
					}, animation.duration);

					link.setIcon(_canvas);
				} else {
					cb();
					return;
				}
			};
			//auto init
			init();
			return {
				badge: badge,
				video: video,
				image: image,
				webcam: webcam,
				reset: icon.reset,
				browser: {
					supported: _browser.supported
				}
			};
		});

		// AMD / RequireJS
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return Favico;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}
		// CommonJS
		else if (typeof module !== 'undefined' && module.exports) {
			module.exports = Favico;
		}
		// included directly via <script> tag
		else {
			this.Favico = Favico;
		}

	})();


/***/ }
/******/ ])
});
;