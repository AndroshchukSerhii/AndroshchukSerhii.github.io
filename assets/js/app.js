'use strict'

$(function () {
  var imgs = [];
  var parallaxImg = document.getElementById("parallax");
  
  if (document.documentElement.clientWidth > 768) {
    [].forEach.call(document.querySelectorAll('img[data-src]'), function (img) {
      img.setAttribute('src', img.getAttribute('data-src'));
      img.onload = function () {
        img.removeAttribute('data-src');
      };
    });
  }

	$.each($('*'), function () {
		var
			$this = $(this),
			background = $this.css('background-image'),
			img = $this.is('img');

		if (background != 'none') {
			var path = background.replace('url("', '').replace('")', '');
			imgs.push(path);
		}

		if (img) {
			var path = $this.attr('src');

			if (path) {
				imgs.push(path);
			}
		}

	}); 

	
	var percentsTotal = 1;

	for (var i = 0; i < imgs.length; i++) {
		var image = $('<img>', {
			attr: {
				src: imgs[i]
			}
		});

		image.on({
			load : function () {
				setPercents(imgs.length, percentsTotal);
				percentsTotal++;
			},

			error : function () {
        percentsTotal++;
				setPrecents(imgs.length, percentsTotal);
			}
		});
	}

	function setPercents(total, current) {
		var percent = Math.ceil(current / total * 100);

		if (percent >= 100) {
			$('.preloader').fadeOut();
		}

		$('.preloader__percents').text(percent + '%');
	}
  // $('.preloader').fadeOut();
});

var blur = (function(){
    var 
        blur = $('.feadback__blur'),
        blurSection = $('.about-me');

    return {
      set: function() {
        var 
            imgWidth = $('.about-me').width(),
            imgHeight = $('.about-me').height(),
            posLeft = blurSection.offset().left - blur.offset().left,
            posTop = blurSection.offset().top - blur.offset().top,
            posTops = posTop + (-posTop*.1);
        blur.css({
          'background-size': imgWidth + 'px' + ' ' + imgHeight + 'px',
          'background-position': posLeft + 'px' + ' ' + posTops + 'px'        
        })
      }
    }
}());

var blogMenu = (function() {
  var 
    linkNav = document.querySelectorAll('[href^="#nav"]'),
    V = 0.5, // скорость скрола при нажатии на меню
    activeHeight =  200; // высота от верха экрана при которой срабатывает переключение

  return {
    set: function(){
      var
        stickySidebar = $('.blog__list').offset().top;
      console.log(2); 
      $(window).scroll(function() { 
        console.log($(window).scrollTop())

        if ($(window).scrollTop() + activeHeight > stickySidebar) {
            $('.blog__list').addClass('blog__list-fix');

        }
        else {
            $('.blog__list').removeClass('blog__list-fix');
        }  
      });

      for (var i = 0; i < linkNav.length; i++) {
        linkNav[i].onclick = function(){
          var w = window.pageYOffset,
              hash = this.href.replace(/[^#]*(.*)/, '$1'),
              t = document.querySelector(hash).getBoundingClientRect().top,
              start = null;
          requestAnimationFrame(step);
          function step(time) {
            if (start === null) start = time;
            var progress = time - start,
                r = (t < 0 ? Math.max(w - progress/V, w + t) : Math.min(w + progress/V, w + t));
            window.scrollTo(0,r);
            if (r != w + t) {requestAnimationFrame(step)} else {location.hash = hash}
          }
          return false;
        }
      }

      window.addEventListener('scroll', function(e) {
        var 
          nav = document.querySelectorAll('section[id^="nav"]');

        for (var i = 0; i < nav.length; i++) { 
          document.querySelector('a[href="#' + nav[i].id + '"]').className=((1 >= nav[i].getBoundingClientRect().top-activeHeight && nav[i].getBoundingClientRect().top >= activeHeight-nav[i].offsetHeight) ? 'blog__list-item_active' : '');
        }
      }, false);
    }
  }
}());

var slider = (function() {
  //private
  var
    flag = true,
    timer = 0,
    timerDuration = 400000000;

  return {
    
    init: function() {
      var _this = this;
      // create dots
      _this.createDots();

      // tern up switcher
      _this.autoSwitch();
      $('.slider__controls-button').on('click', function(e) {
        e.preventDefault();

        var
          $this = $(this),
          slides = $this.closest('.slider').find('.slider__item'),
          activeSlide = slides.filter('.active'),
          nextSlide = activeSlide.next(),
          prevSlide = activeSlide.prev(),
          firstSlide =slides.first(),
          lastSlide = slides.last();
        _this.clearTimer();
        if ($this.hasClass('slider__arrows-next')) {

            if (nextSlide.length) {
              // console.log("forward");
              _this.moveSlide(nextSlide, 'forward');

            } else {
              _this.moveSlide(firstSlide, 'forward');
           }

        } else {

           if (prevSlide.length) {
              _this.moveSlide(prevSlide, 'backward');

           } else {
              _this.moveSlide(lastSlide, 'backward');
           }
        }
      });
        // click to dots
      $('.slider__dots-current').on('click', function(e){
        e.preventDefault();

        var 
          $this = $(this),
          dots = $this.closest('.slider__dots').find('.slider__dots-current'),
          activeDot = dots.filter('.active'),
          dot = $this.closest('.slider__dots-current'),
          curDotNum =dot.index(),
          direction = (activeDot.index() < curDotNum) ? 'forward' : 'backward',
          reqSlide = $this.closest('.slider').find('.slider__item').eq(curDotNum);
        if (!dot.hasClass('active')){
        _this.clearTimer();
        _this.moveSlide(reqSlide, direction);
        }
      });
    },
    moveSlide: function(slide, direction){
      var
        _this = this,
        container = slide.closest('.slider'),
        slides = container.find('.slider__item'),
        activeSlide = slides.filter('.active'),
        slideWidth = slides.width(),
        duration = 500,
        reqCssPosition = 0,
        reqSlideStrafe = 0;

      if (flag) {
        flag = false;
        if (direction === 'forward') {
            reqCssPosition = slideWidth;
            reqSlideStrafe = -slideWidth;
        } else if (direction === 'backward') {
            reqCssPosition = -slideWidth;
            reqSlideStrafe = slideWidth;
        }
        slide.css('left', reqCssPosition).addClass('inslide');

        var movableSlide = slides.filter('.inslide');
        activeSlide.animate({left: reqSlideStrafe}, duration);
        
        movableSlide.animate({left: 0}, duration, function(){
          var $this = $(this);

          slides.css('left', '0').removeClass('active');

          $this.toggleClass('inslide active');

          _this.setActiveDot(container.find('.slider__dots'));
          flag = true;
        });
      }
    },
    createDots: function() {
      var
        _this = this,
        container = $('.slider');
      var
        dotMarkup = '<li class="slider__dots-current"><a class="slider__dots-link" href="#"></a></li>';

      container.each(function(){
          var 
            $this = $(this),
            slides = $this.find('.slider__item'),
            dotContainer = $this.find('.slider__dots');
          for (var i = 0; i <slides.size(); i++) {
              dotContainer.append(dotMarkup);
          }
          _this.setActiveDot(dotContainer)
      });
    },
    setActiveDot: function(container) {
      var
        slides = container.closest('.slidesContainer').find('.slider__item');
      container
        .find('.slider__dots-current')    
        .eq(slides.filter('.active').index())
        .addClass('active')
        .siblings()
        .removeClass('active');
    },
    autoSwitch : function(){
        var _this = this;
        timer = setInterval(function(){
            var
              slides = $('.slider__list .slider__item'),
              activeSlide = slides.filter('.active'),
              nextSlide = activeSlide.next(),
              firstSlide = slides.first();

            if (nextSlide.length) {
              // console.log("forward");
              _this.moveSlide(nextSlide, 'forward');

            } else {
              _this.moveSlide(firstSlide, 'forward');
           }

        }, timerDuration);
    },
    clearTimer: function(){
      if (timer) {
        clearInterval(timer);
        this.autoSwitch();
      }
    }
  }
}());

(function(jQuery, undefined) {
  // VAR
  var debug = true,
      
      options = {
        mouseport:     'body',  // jQuery object or selector of DOM node to use as mouseport
        xparallax:     true,    // boolean | 0-1 | 'npx' | 'n%'
        yparallax:     true,    //
        xorigin:       0.5,     // 0-1 - Sets default alignment. Only has effect when parallax values are something other than 1 (or true, or '100%')
        yorigin:       0.5,     //
        decay:         0.56,    // 0-1 (0 instant, 1 forever) - Sets rate of decay curve for catching up with target mouse position
        frameDuration: 30,      // Int (milliseconds)
        freezeClass:   'freeze' // String - Class added to layer when frozen
      },
  
      value = {
        left: 1,
        top: 0,
        middle: 0.5,
        center: 0.5,
        right: 1,
        bottom: 1
      },
  
      rpx = /^\d+\s?px$/,
      rpercent = /^\d+\s?%$/,
      
      win = jQuery(window),
      doc = jQuery(document),
      mouse = [0, 0];
  
  var Timer = (function(){
    var debug = false;
    
    // Shim for requestAnimationFrame, falling back to timer. See:
    // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    var requestFrame = (function(){
          return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(fn, node){
              return window.setTimeout(function(){
                fn();
              }, 25);
            }
          );
        })();
    
    function Timer() {
      var callbacks = [],
        nextFrame;
      
      function noop() {}
      
      function frame(){
        var cbs = callbacks.slice(0),
            l = cbs.length,
            i = -1;
        
        if (debug) { console.log('timer frame()', l); }
        
        while(++i < l) { cbs[i].call(this); }
        requestFrame(nextFrame);
      }
      
      function start() {
        if (debug) { console.log('timer start()'); }
        this.start = noop;
        this.stop = stop;
        nextFrame = frame;
        requestFrame(nextFrame);
      }
      
      function stop() {
        if (debug) { console.log('timer stop()'); }
        this.start = start;
        this.stop = noop;
        nextFrame = noop;
      }
      
      this.callbacks = callbacks;
      this.start = start;
      this.stop = stop;
    }

    Timer.prototype = {
      add: function(fn) {
        var callbacks = this.callbacks,
            l = callbacks.length;
        
        // Check to see if this callback is already in the list.
        // Don't add it twice.
        while (l--) {
          if (callbacks[l] === fn) { return; }
        }
        
        this.callbacks.push(fn);
        if (debug) { console.log('timer add()', this.callbacks.length); }
      },
    
      remove: function(fn) {
        var callbacks = this.callbacks,
            l = callbacks.length;
        
        // Remove all instances of this callback.
        while (l--) {
          if (callbacks[l] === fn) { callbacks.splice(l, 1); }
        }
        
        if (debug) { console.log('timer remove()', this.callbacks.length); }
        
        if (callbacks.length === 0) { this.stop(); }
      }
    };
    
    return Timer;
  })();
  
  function parseCoord(x) {
    return (rpercent.exec(x)) ? parseFloat(x)/100 : x;
  }
  
  function parseBool(x) {
    return typeof x === "boolean" ? x : !!( parseFloat(x) ) ;
  }
  
  function portData(port) {
    var events = {
          'mouseenter.parallax': mouseenter,
          'mouseleave.parallax': mouseleave
        },
        winEvents = {
          'resize.parallax': resize
        },
        data = {
          elem: port,
          events: events,
          winEvents: winEvents,
          timer: new Timer()
        },
        layers, size, offset;
    
    function updatePointer() {
      data.pointer = getPointer(mouse, [true, true], offset, size);
    }
    
    function resize() {
      size = getSize(port);
      offset = getOffset(port);
      data.threshold = getThreshold(size);
    }
    
    function mouseenter() {
      data.timer.add(updatePointer);
    }
    
    function mouseleave(e) {
      data.timer.remove(updatePointer);
      data.pointer = getPointer([e.pageX, e.pageY], [true, true], offset, size);
    }

    win.on(winEvents);
    port.on(events);
    
    resize();
    
    return data;
  }
  
  function getData(elem, name, fn) {
    var data = elem.data(name);
    
    if (!data) {
      data = fn ? fn(elem) : {} ;
      elem.data(name, data);
    }
    
    return data;
  }
  
  function getPointer(mouse, parallax, offset, size){
    var pointer = [],
        x = 2;
    
    while (x--) {
      pointer[x] = (mouse[x] - offset[x]) / size[x] ;
      pointer[x] = pointer[x] < 0 ? 0 : pointer[x] > 1 ? 1 : pointer[x] ;
    }
    
    return pointer;
  }
  
  function getSize(elem) {
    return [elem.width(), elem.height()];
  }
  
  function getOffset(elem) {
    var offset = elem.offset() || {left: 0, top: 0},
      borderLeft = elem.css('borderLeftStyle') === 'none' ? 0 : parseInt(elem.css('borderLeftWidth'), 10),
      borderTop = elem.css('borderTopStyle') === 'none' ? 0 : parseInt(elem.css('borderTopWidth'), 10),
      paddingLeft = parseInt(elem.css('paddingLeft'), 10),
      paddingTop = parseInt(elem.css('paddingTop'), 10);
    
    return [offset.left + borderLeft + paddingLeft, offset.top + borderTop + paddingTop];
  }
  
  function getThreshold(size) {
    return [1/size[0], 1/size[1]];
  }
  
  function layerSize(elem, x, y) {
    return [x || elem.outerWidth(), y || elem.outerHeight()];
  }
  
  function layerOrigin(xo, yo) {
    var o = [xo, yo],
      i = 2,
      origin = [];
    
    while (i--) {
      origin[i] = typeof o[i] === 'string' ?
        o[i] === undefined ?
          1 :
          value[origin[i]] || parseCoord(origin[i]) :
        o[i] ;
    }
    
    return origin;
  }
  
  function layerPx(xp, yp) {
    return [rpx.test(xp), rpx.test(yp)];
  }
  
  function layerParallax(xp, yp, px) {
    var p = [xp, yp],
        i = 2,
        parallax = [];
    
    while (i--) {
      parallax[i] = px[i] ?
        parseInt(p[i], 10) :
        parallax[i] = p[i] === true ? 1 : parseCoord(p[i]) ;
    }
    
    return parallax;
  }
  
  function layerOffset(parallax, px, origin, size) {
    var i = 2,
        offset = [];
    
    while (i--) {
      offset[i] = px[i] ?
        origin[i] * (size[i] - parallax[i]) :
        parallax[i] ? origin[i] * ( 1 - parallax[i] ) : 0 ;
    }
    
    return offset;
  }
  
  function layerPosition(px, origin) {
    var i = 2,
        position = [];
    
    while (i--) {
      if (px[i]) {
        // Set css position constant
        position[i] = origin[i] * 100 + '%';
      }
      else {
      
      }
    }
    
    return position;
  }
  
  function layerPointer(elem, parallax, px, offset, size) {
    var viewport = elem.offsetParent(),
      pos = elem.position(),
      position = [],
      pointer = [],
      i = 2;
    
    // Reverse calculate ratio from elem's current position
    while (i--) {
      position[i] = px[i] ?
        // TODO: reverse calculation for pixel case
        0 :
        pos[i === 0 ? 'left' : 'top'] / (viewport[i === 0 ? 'outerWidth' : 'outerHeight']() - size[i]) ;
      
      pointer[i] = (position[i] - offset[i]) / parallax[i] ;
    }
    
    return pointer;
  }
  
  function layerCss(parallax, px, offset, size, position, pointer) {
    var pos = [],
        cssPosition,
        cssMargin,
        x = 2,
        css = {};
    
    while (x--) {
      if (parallax[x]) {
        pos[x] = parallax[x] * pointer[x] + offset[x];
        
        // We're working in pixels
        if (px[x]) {
          cssPosition = position[x];
          cssMargin = pos[x] * -1;
        }
        // We're working by ratio
        else {
          cssPosition = pos[x] * 100 + '%';
          cssMargin = pos[x] * size[x] * -1;
        }
        
        // Fill in css object
        if (x === 0) {
          css.left = cssPosition;
          css.marginLeft = cssMargin;
        }
        else {
          css.top = cssPosition;
          css.marginTop = cssMargin;
        }
      }
    }
    
    return css;
  }
  
  function pointerOffTarget(targetPointer, prevPointer, threshold, decay, parallax, targetFn, updateFn) {
    var pointer, x;
    
    if ((!parallax[0] || Math.abs(targetPointer[0] - prevPointer[0]) < threshold[0]) &&
        (!parallax[1] || Math.abs(targetPointer[1] - prevPointer[1]) < threshold[1])) {
        // Pointer has hit the target
        if (targetFn) { targetFn(); }
        return updateFn(targetPointer);
    }
    
    // Pointer is nowhere near the target
    pointer = [];
    x = 2;
    
    while (x--) {
      if (parallax[x]) {
        pointer[x] = targetPointer[x] + decay * (prevPointer[x] - targetPointer[x]);
      }
    }
      
    return updateFn(pointer);
  }
  
  function pointerOnTarget(targetPointer, prevPointer, threshold, decay, parallax, targetFn, updateFn) {
    // Don't bother updating if the pointer hasn't changed.
    if (targetPointer[0] === prevPointer[0] && targetPointer[1] === prevPointer[1]) {
      return;
    }
    
    return updateFn(targetPointer);
  }
  
  function unport(elem, events, winEvents) {
    elem.off(events).removeData('parallax_port');
    win.off(winEvents);
  }
  
  function unparallax(node, port, events) {
    port.elem.off(events);
    
    // Remove this node from layers
    port.layers = port.layers.not(node);
    
    // If port.layers is empty, destroy the port
    if (port.layers.length === 0) {
      unport(port.elem, port.events, port.winEvents);
    }
  }
  
  function unstyle(parallax) {
    var css = {};
    
    if (parallax[0]) {
      css.left = '';
      css.marginLeft = '';
    }
    
    if (parallax[1]) {
      css.top = '';
      css.marginTop = '';
    }
    
    elem.css(css);
  }
  
  jQuery.fn.parallax = function(o){
    var options = jQuery.extend({}, jQuery.fn.parallax.options, o),
        args = arguments,
        elem = options.mouseport instanceof jQuery ?
          options.mouseport :
          jQuery(options.mouseport) ,
        port = getData(elem, 'parallax_port', portData),
        timer = port.timer;
    
    return this.each(function(i) {
      var node      = this,
          elem      = jQuery(this),
          opts      = args[i + 1] ? jQuery.extend({}, options, args[i + 1]) : options,
          decay     = opts.decay,
          size      = layerSize(elem, opts.width, opts.height),
          origin    = layerOrigin(opts.xorigin, opts.yorigin),
          px        = layerPx(opts.xparallax, opts.yparallax),
          parallax  = layerParallax(opts.xparallax, opts.yparallax, px),
          offset    = layerOffset(parallax, px, origin, size),
          position  = layerPosition(px, origin),
          pointer   = layerPointer(elem, parallax, px, offset, size),
          pointerFn = pointerOffTarget,
          targetFn  = targetInside,
          events = {
            'mouseenter.parallax': function mouseenter(e) {
              pointerFn = pointerOffTarget;
              targetFn = targetInside;
              timer.add(frame);
              timer.start();
            },
            'mouseleave.parallax': function mouseleave(e) {
              // Make the layer come to rest at it's limit with inertia
              pointerFn = pointerOffTarget;
              // Stop the timer when the the pointer hits target
              targetFn = targetOutside;
            }
          };
      
      function updateCss(newPointer) {
        var css = layerCss(parallax, px, offset, size, position, newPointer);
        elem.css(css);
        pointer = newPointer;
      }
      
      function frame() {
        pointerFn(port.pointer, pointer, port.threshold, decay, parallax, targetFn, updateCss);
      }
      
      function targetInside() {
        // Pointer hits the target pointer inside the port
        pointerFn = pointerOnTarget;
      }
      
      function targetOutside() {
        // Pointer hits the target pointer outside the port
        timer.remove(frame);
      }
      
      
      if (jQuery.data(node, 'parallax')) {
        elem.unparallax();
      }
      
      jQuery.data(node, 'parallax', {
        port: port,
        events: events,
        parallax: parallax
      });
      
      port.elem.on(events);
      port.layers = port.layers? port.layers.add(node): jQuery(node);
      
      /*function freeze() {
        freeze = true;
      }
      
      function unfreeze() {
        freeze = false;
      }*/
      
      /*jQuery.event.add(this, 'freeze.parallax', freeze);
      jQuery.event.add(this, 'unfreeze.parallax', unfreeze);*/
    });
  };
  
  jQuery.fn.unparallax = function(bool) {
    return this.each(function() {
      var data = jQuery.data(this, 'parallax');
      
      // This elem is not parallaxed
      if (!data) { return; }
      
      jQuery.removeData(this, 'parallax');
      unparallax(this, data.port, data.events);
      if (bool) { unstyle(data.parallax); }
    });
  };
  
  jQuery.fn.parallax.options = options;
  
  // Pick up and store mouse position on document: IE does not register
  // mousemove on window.
  doc.on('mousemove.parallax', function(e){
    mouse = [e.pageX, e.pageY];
  });
}(jQuery));

var scrollPage = (function() {
  return {
    set: function() {
      $("a[href*=#]").on("click", function(e){
          var anchor = $(this);
          $('html, body').stop().animate({
              scrollTop: $(anchor.attr('href')).offset().top
          }, 777);
          e.preventDefault();
          return false;
      });
    }
  }
}());


$(document).ready(function(){
  $('.flip').click(function(){
    $('.cont-flip').toggleClass('flipped');
    $('.button__wrap').toggleClass('button__wrap_hidden')
    return false;
  });

  jQuery('.parallax-layer').parallax({
        mouseport: jQuery("#parallax")
    });

    if ($('.slider').length) {
      slider.init();   
    }
    if ($('#section').length) {
      scrollPage.set();
    }
    
   $('#toggle').click(function() {
     $(this).toggleClass('active');
     $('#overlay').toggleClass('open');
     $('body').toggleClass('stop-scrolling');
    // $('body').bind('touchmove', function(e){e.preventDefault()})
    // $('body').unbind('touchmove')
    });
  if ($('#map').length) {
      ymaps.ready(function () {
        // В функцию поступает пространство имен, которое содержит все запрощенные при инициализации модули. 
          var myMap = new ymaps.Map('map', {
                center: [50.45111022, 30.45062542],
                zoom: 12,
                // В данном примере карта создается без контролов, так как те не были загружены при инициализации API.
                controls: []
            }),
            placemark = new ymaps.Placemark(
                myMap.getCenter(), {
                }
            );
             myMap.behaviors.disable('scrollZoom');
        // myMap.geoObjects.add(placemark);  
      }); 
  }
  if ($('.feadback').length) {
    blur.set();
  }
  if ($('.blog__list').length) {
    console.log(223);
    blogMenu.set();
  }
});


$(document).resize(function(){
  if ($('.feadback').length) {
    blur.set();
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGltZ3MgPSBbXTtcclxuICB2YXIgcGFyYWxsYXhJbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcmFsbGF4XCIpO1xyXG4gIFxyXG4gIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggPiA3NjgpIHtcclxuICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1zcmNdJyksIGZ1bmN0aW9uIChpbWcpIHtcclxuICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgaW1nLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSk7XHJcbiAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaW1nLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zcmMnKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblx0JC5lYWNoKCQoJyonKSwgZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyXHJcblx0XHRcdCR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0YmFja2dyb3VuZCA9ICR0aGlzLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxyXG5cdFx0XHRpbWcgPSAkdGhpcy5pcygnaW1nJyk7XHJcblxyXG5cdFx0aWYgKGJhY2tncm91bmQgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHZhciBwYXRoID0gYmFja2dyb3VuZC5yZXBsYWNlKCd1cmwoXCInLCAnJykucmVwbGFjZSgnXCIpJywgJycpO1xyXG5cdFx0XHRpbWdzLnB1c2gocGF0aCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGltZykge1xyXG5cdFx0XHR2YXIgcGF0aCA9ICR0aGlzLmF0dHIoJ3NyYycpO1xyXG5cclxuXHRcdFx0aWYgKHBhdGgpIHtcclxuXHRcdFx0XHRpbWdzLnB1c2gocGF0aCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fSk7IFxyXG5cclxuXHRcclxuXHR2YXIgcGVyY2VudHNUb3RhbCA9IDE7XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgaW1ncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGltYWdlID0gJCgnPGltZz4nLCB7XHJcblx0XHRcdGF0dHI6IHtcclxuXHRcdFx0XHRzcmM6IGltZ3NbaV1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aW1hZ2Uub24oe1xyXG5cdFx0XHRsb2FkIDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNldFBlcmNlbnRzKGltZ3MubGVuZ3RoLCBwZXJjZW50c1RvdGFsKTtcclxuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRlcnJvciA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwZXJjZW50c1RvdGFsKys7XHJcblx0XHRcdFx0c2V0UHJlY2VudHMoaW1ncy5sZW5ndGgsIHBlcmNlbnRzVG90YWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBlcmNlbnRzKHRvdGFsLCBjdXJyZW50KSB7XHJcblx0XHR2YXIgcGVyY2VudCA9IE1hdGguY2VpbChjdXJyZW50IC8gdG90YWwgKiAxMDApO1xyXG5cclxuXHRcdGlmIChwZXJjZW50ID49IDEwMCkge1xyXG5cdFx0XHQkKCcucHJlbG9hZGVyJykuZmFkZU91dCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoJy5wcmVsb2FkZXJfX3BlcmNlbnRzJykudGV4dChwZXJjZW50ICsgJyUnKTtcclxuXHR9XHJcbiAgLy8gJCgnLnByZWxvYWRlcicpLmZhZGVPdXQoKTtcclxufSk7XHJcblxyXG52YXIgYmx1ciA9IChmdW5jdGlvbigpe1xyXG4gICAgdmFyIFxyXG4gICAgICAgIGJsdXIgPSAkKCcuZmVhZGJhY2tfX2JsdXInKSxcclxuICAgICAgICBibHVyU2VjdGlvbiA9ICQoJy5hYm91dC1tZScpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgICBpbWdXaWR0aCA9ICQoJy5hYm91dC1tZScpLndpZHRoKCksXHJcbiAgICAgICAgICAgIGltZ0hlaWdodCA9ICQoJy5hYm91dC1tZScpLmhlaWdodCgpLFxyXG4gICAgICAgICAgICBwb3NMZWZ0ID0gYmx1clNlY3Rpb24ub2Zmc2V0KCkubGVmdCAtIGJsdXIub2Zmc2V0KCkubGVmdCxcclxuICAgICAgICAgICAgcG9zVG9wID0gYmx1clNlY3Rpb24ub2Zmc2V0KCkudG9wIC0gYmx1ci5vZmZzZXQoKS50b3AsXHJcbiAgICAgICAgICAgIHBvc1RvcHMgPSBwb3NUb3AgKyAoLXBvc1RvcCouMSk7XHJcbiAgICAgICAgYmx1ci5jc3Moe1xyXG4gICAgICAgICAgJ2JhY2tncm91bmQtc2l6ZSc6IGltZ1dpZHRoICsgJ3B4JyArICcgJyArIGltZ0hlaWdodCArICdweCcsXHJcbiAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbic6IHBvc0xlZnQgKyAncHgnICsgJyAnICsgcG9zVG9wcyArICdweCcgICAgICAgIFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxufSgpKTtcclxuXHJcbnZhciBibG9nTWVudSA9IChmdW5jdGlvbigpIHtcclxuICB2YXIgXHJcbiAgICBsaW5rTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2hyZWZePVwiI25hdlwiXScpLFxyXG4gICAgViA9IDAuNSwgLy8g0YHQutC+0YDQvtGB0YLRjCDRgdC60YDQvtC70LAg0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LzQtdC90Y5cclxuICAgIGFjdGl2ZUhlaWdodCA9ICAyMDA7IC8vINCy0YvRgdC+0YLQsCDQvtGCINCy0LXRgNGF0LAg0Y3QutGA0LDQvdCwINC/0YDQuCDQutC+0YLQvtGA0L7QuSDRgdGA0LDQsdCw0YLRi9Cy0LDQtdGCINC/0LXRgNC10LrQu9GO0YfQtdC90LjQtVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2V0OiBmdW5jdGlvbigpe1xyXG4gICAgICB2YXJcclxuICAgICAgICBzdGlja3lTaWRlYmFyID0gJCgnLmJsb2dfX2xpc3QnKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgIGNvbnNvbGUubG9nKDIpOyBcclxuICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgY29uc29sZS5sb2coJCh3aW5kb3cpLnNjcm9sbFRvcCgpKVxyXG5cclxuICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgYWN0aXZlSGVpZ2h0ID4gc3RpY2t5U2lkZWJhcikge1xyXG4gICAgICAgICAgICAkKCcuYmxvZ19fbGlzdCcpLmFkZENsYXNzKCdibG9nX19saXN0LWZpeCcpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5ibG9nX19saXN0JykucmVtb3ZlQ2xhc3MoJ2Jsb2dfX2xpc3QtZml4Jyk7XHJcbiAgICAgICAgfSAgXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5rTmF2Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGlua05hdltpXS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHZhciB3ID0gd2luZG93LnBhZ2VZT2Zmc2V0LFxyXG4gICAgICAgICAgICAgIGhhc2ggPSB0aGlzLmhyZWYucmVwbGFjZSgvW14jXSooLiopLywgJyQxJyksXHJcbiAgICAgICAgICAgICAgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaGFzaCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wLFxyXG4gICAgICAgICAgICAgIHN0YXJ0ID0gbnVsbDtcclxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgICAgICAgIGZ1bmN0aW9uIHN0ZXAodGltZSkge1xyXG4gICAgICAgICAgICBpZiAoc3RhcnQgPT09IG51bGwpIHN0YXJ0ID0gdGltZTtcclxuICAgICAgICAgICAgdmFyIHByb2dyZXNzID0gdGltZSAtIHN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgciA9ICh0IDwgMCA/IE1hdGgubWF4KHcgLSBwcm9ncmVzcy9WLCB3ICsgdCkgOiBNYXRoLm1pbih3ICsgcHJvZ3Jlc3MvViwgdyArIHQpKTtcclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAscik7XHJcbiAgICAgICAgICAgIGlmIChyICE9IHcgKyB0KSB7cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApfSBlbHNlIHtsb2NhdGlvbi5oYXNoID0gaGFzaH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2VjdGlvbltpZF49XCJuYXZcIl0nKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXYubGVuZ3RoOyBpKyspIHsgXHJcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhW2hyZWY9XCIjJyArIG5hdltpXS5pZCArICdcIl0nKS5jbGFzc05hbWU9KCgxID49IG5hdltpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AtYWN0aXZlSGVpZ2h0ICYmIG5hdltpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPj0gYWN0aXZlSGVpZ2h0LW5hdltpXS5vZmZzZXRIZWlnaHQpID8gJ2Jsb2dfX2xpc3QtaXRlbV9hY3RpdmUnIDogJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxufSgpKTtcclxuXHJcbnZhciBzbGlkZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgLy9wcml2YXRlXHJcbiAgdmFyXHJcbiAgICBmbGFnID0gdHJ1ZSxcclxuICAgIHRpbWVyID0gMCxcclxuICAgIHRpbWVyRHVyYXRpb24gPSA0MDAwMDAwMDA7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAvLyBjcmVhdGUgZG90c1xyXG4gICAgICBfdGhpcy5jcmVhdGVEb3RzKCk7XHJcblxyXG4gICAgICAvLyB0ZXJuIHVwIHN3aXRjaGVyXHJcbiAgICAgIF90aGlzLmF1dG9Td2l0Y2goKTtcclxuICAgICAgJCgnLnNsaWRlcl9fY29udHJvbHMtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICBzbGlkZXMgPSAkdGhpcy5jbG9zZXN0KCcuc2xpZGVyJykuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG4gICAgICAgICAgYWN0aXZlU2xpZGUgPSBzbGlkZXMuZmlsdGVyKCcuYWN0aXZlJyksXHJcbiAgICAgICAgICBuZXh0U2xpZGUgPSBhY3RpdmVTbGlkZS5uZXh0KCksXHJcbiAgICAgICAgICBwcmV2U2xpZGUgPSBhY3RpdmVTbGlkZS5wcmV2KCksXHJcbiAgICAgICAgICBmaXJzdFNsaWRlID1zbGlkZXMuZmlyc3QoKSxcclxuICAgICAgICAgIGxhc3RTbGlkZSA9IHNsaWRlcy5sYXN0KCk7XHJcbiAgICAgICAgX3RoaXMuY2xlYXJUaW1lcigpO1xyXG4gICAgICAgIGlmICgkdGhpcy5oYXNDbGFzcygnc2xpZGVyX19hcnJvd3MtbmV4dCcpKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAobmV4dFNsaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZm9yd2FyZFwiKTtcclxuICAgICAgICAgICAgICBfdGhpcy5tb3ZlU2xpZGUobmV4dFNsaWRlLCAnZm9yd2FyZCcpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBfdGhpcy5tb3ZlU2xpZGUoZmlyc3RTbGlkZSwgJ2ZvcndhcmQnKTtcclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgIGlmIChwcmV2U2xpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgX3RoaXMubW92ZVNsaWRlKHByZXZTbGlkZSwgJ2JhY2t3YXJkJyk7XHJcblxyXG4gICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgX3RoaXMubW92ZVNsaWRlKGxhc3RTbGlkZSwgJ2JhY2t3YXJkJyk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgICAgLy8gY2xpY2sgdG8gZG90c1xyXG4gICAgICAkKCcuc2xpZGVyX19kb3RzLWN1cnJlbnQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHZhciBcclxuICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgIGRvdHMgPSAkdGhpcy5jbG9zZXN0KCcuc2xpZGVyX19kb3RzJykuZmluZCgnLnNsaWRlcl9fZG90cy1jdXJyZW50JyksXHJcbiAgICAgICAgICBhY3RpdmVEb3QgPSBkb3RzLmZpbHRlcignLmFjdGl2ZScpLFxyXG4gICAgICAgICAgZG90ID0gJHRoaXMuY2xvc2VzdCgnLnNsaWRlcl9fZG90cy1jdXJyZW50JyksXHJcbiAgICAgICAgICBjdXJEb3ROdW0gPWRvdC5pbmRleCgpLFxyXG4gICAgICAgICAgZGlyZWN0aW9uID0gKGFjdGl2ZURvdC5pbmRleCgpIDwgY3VyRG90TnVtKSA/ICdmb3J3YXJkJyA6ICdiYWNrd2FyZCcsXHJcbiAgICAgICAgICByZXFTbGlkZSA9ICR0aGlzLmNsb3Nlc3QoJy5zbGlkZXInKS5maW5kKCcuc2xpZGVyX19pdGVtJykuZXEoY3VyRG90TnVtKTtcclxuICAgICAgICBpZiAoIWRvdC5oYXNDbGFzcygnYWN0aXZlJykpe1xyXG4gICAgICAgIF90aGlzLmNsZWFyVGltZXIoKTtcclxuICAgICAgICBfdGhpcy5tb3ZlU2xpZGUocmVxU2xpZGUsIGRpcmVjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBtb3ZlU2xpZGU6IGZ1bmN0aW9uKHNsaWRlLCBkaXJlY3Rpb24pe1xyXG4gICAgICB2YXJcclxuICAgICAgICBfdGhpcyA9IHRoaXMsXHJcbiAgICAgICAgY29udGFpbmVyID0gc2xpZGUuY2xvc2VzdCgnLnNsaWRlcicpLFxyXG4gICAgICAgIHNsaWRlcyA9IGNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19pdGVtJyksXHJcbiAgICAgICAgYWN0aXZlU2xpZGUgPSBzbGlkZXMuZmlsdGVyKCcuYWN0aXZlJyksXHJcbiAgICAgICAgc2xpZGVXaWR0aCA9IHNsaWRlcy53aWR0aCgpLFxyXG4gICAgICAgIGR1cmF0aW9uID0gNTAwLFxyXG4gICAgICAgIHJlcUNzc1Bvc2l0aW9uID0gMCxcclxuICAgICAgICByZXFTbGlkZVN0cmFmZSA9IDA7XHJcblxyXG4gICAgICBpZiAoZmxhZykge1xyXG4gICAgICAgIGZsYWcgPSBmYWxzZTtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnZm9yd2FyZCcpIHtcclxuICAgICAgICAgICAgcmVxQ3NzUG9zaXRpb24gPSBzbGlkZVdpZHRoO1xyXG4gICAgICAgICAgICByZXFTbGlkZVN0cmFmZSA9IC1zbGlkZVdpZHRoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnYmFja3dhcmQnKSB7XHJcbiAgICAgICAgICAgIHJlcUNzc1Bvc2l0aW9uID0gLXNsaWRlV2lkdGg7XHJcbiAgICAgICAgICAgIHJlcVNsaWRlU3RyYWZlID0gc2xpZGVXaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2xpZGUuY3NzKCdsZWZ0JywgcmVxQ3NzUG9zaXRpb24pLmFkZENsYXNzKCdpbnNsaWRlJyk7XHJcblxyXG4gICAgICAgIHZhciBtb3ZhYmxlU2xpZGUgPSBzbGlkZXMuZmlsdGVyKCcuaW5zbGlkZScpO1xyXG4gICAgICAgIGFjdGl2ZVNsaWRlLmFuaW1hdGUoe2xlZnQ6IHJlcVNsaWRlU3RyYWZlfSwgZHVyYXRpb24pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG1vdmFibGVTbGlkZS5hbmltYXRlKHtsZWZ0OiAwfSwgZHVyYXRpb24sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgIHNsaWRlcy5jc3MoJ2xlZnQnLCAnMCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAkdGhpcy50b2dnbGVDbGFzcygnaW5zbGlkZSBhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICBfdGhpcy5zZXRBY3RpdmVEb3QoY29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2RvdHMnKSk7XHJcbiAgICAgICAgICBmbGFnID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNyZWF0ZURvdHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXJcclxuICAgICAgICBfdGhpcyA9IHRoaXMsXHJcbiAgICAgICAgY29udGFpbmVyID0gJCgnLnNsaWRlcicpO1xyXG4gICAgICB2YXJcclxuICAgICAgICBkb3RNYXJrdXAgPSAnPGxpIGNsYXNzPVwic2xpZGVyX19kb3RzLWN1cnJlbnRcIj48YSBjbGFzcz1cInNsaWRlcl9fZG90cy1saW5rXCIgaHJlZj1cIiNcIj48L2E+PC9saT4nO1xyXG5cclxuICAgICAgY29udGFpbmVyLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHZhciBcclxuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBzbGlkZXMgPSAkdGhpcy5maW5kKCcuc2xpZGVyX19pdGVtJyksXHJcbiAgICAgICAgICAgIGRvdENvbnRhaW5lciA9ICR0aGlzLmZpbmQoJy5zbGlkZXJfX2RvdHMnKTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDxzbGlkZXMuc2l6ZSgpOyBpKyspIHtcclxuICAgICAgICAgICAgICBkb3RDb250YWluZXIuYXBwZW5kKGRvdE1hcmt1cCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBfdGhpcy5zZXRBY3RpdmVEb3QoZG90Q29udGFpbmVyKVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzZXRBY3RpdmVEb3Q6IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xyXG4gICAgICB2YXJcclxuICAgICAgICBzbGlkZXMgPSBjb250YWluZXIuY2xvc2VzdCgnLnNsaWRlc0NvbnRhaW5lcicpLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKTtcclxuICAgICAgY29udGFpbmVyXHJcbiAgICAgICAgLmZpbmQoJy5zbGlkZXJfX2RvdHMtY3VycmVudCcpICAgIFxyXG4gICAgICAgIC5lcShzbGlkZXMuZmlsdGVyKCcuYWN0aXZlJykuaW5kZXgoKSlcclxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgLnNpYmxpbmdzKClcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSxcclxuICAgIGF1dG9Td2l0Y2ggOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICBzbGlkZXMgPSAkKCcuc2xpZGVyX19saXN0IC5zbGlkZXJfX2l0ZW0nKSxcclxuICAgICAgICAgICAgICBhY3RpdmVTbGlkZSA9IHNsaWRlcy5maWx0ZXIoJy5hY3RpdmUnKSxcclxuICAgICAgICAgICAgICBuZXh0U2xpZGUgPSBhY3RpdmVTbGlkZS5uZXh0KCksXHJcbiAgICAgICAgICAgICAgZmlyc3RTbGlkZSA9IHNsaWRlcy5maXJzdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5leHRTbGlkZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZvcndhcmRcIik7XHJcbiAgICAgICAgICAgICAgX3RoaXMubW92ZVNsaWRlKG5leHRTbGlkZSwgJ2ZvcndhcmQnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgX3RoaXMubW92ZVNsaWRlKGZpcnN0U2xpZGUsICdmb3J3YXJkJyk7XHJcbiAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB0aW1lckR1cmF0aW9uKTtcclxuICAgIH0sXHJcbiAgICBjbGVhclRpbWVyOiBmdW5jdGlvbigpe1xyXG4gICAgICBpZiAodGltZXIpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcclxuICAgICAgICB0aGlzLmF1dG9Td2l0Y2goKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSgpKTtcclxuXHJcbihmdW5jdGlvbihqUXVlcnksIHVuZGVmaW5lZCkge1xyXG4gIC8vIFZBUlxyXG4gIHZhciBkZWJ1ZyA9IHRydWUsXHJcbiAgICAgIFxyXG4gICAgICBvcHRpb25zID0ge1xyXG4gICAgICAgIG1vdXNlcG9ydDogICAgICdib2R5JywgIC8vIGpRdWVyeSBvYmplY3Qgb3Igc2VsZWN0b3Igb2YgRE9NIG5vZGUgdG8gdXNlIGFzIG1vdXNlcG9ydFxyXG4gICAgICAgIHhwYXJhbGxheDogICAgIHRydWUsICAgIC8vIGJvb2xlYW4gfCAwLTEgfCAnbnB4JyB8ICduJSdcclxuICAgICAgICB5cGFyYWxsYXg6ICAgICB0cnVlLCAgICAvL1xyXG4gICAgICAgIHhvcmlnaW46ICAgICAgIDAuNSwgICAgIC8vIDAtMSAtIFNldHMgZGVmYXVsdCBhbGlnbm1lbnQuIE9ubHkgaGFzIGVmZmVjdCB3aGVuIHBhcmFsbGF4IHZhbHVlcyBhcmUgc29tZXRoaW5nIG90aGVyIHRoYW4gMSAob3IgdHJ1ZSwgb3IgJzEwMCUnKVxyXG4gICAgICAgIHlvcmlnaW46ICAgICAgIDAuNSwgICAgIC8vXHJcbiAgICAgICAgZGVjYXk6ICAgICAgICAgMC41NiwgICAgLy8gMC0xICgwIGluc3RhbnQsIDEgZm9yZXZlcikgLSBTZXRzIHJhdGUgb2YgZGVjYXkgY3VydmUgZm9yIGNhdGNoaW5nIHVwIHdpdGggdGFyZ2V0IG1vdXNlIHBvc2l0aW9uXHJcbiAgICAgICAgZnJhbWVEdXJhdGlvbjogMzAsICAgICAgLy8gSW50IChtaWxsaXNlY29uZHMpXHJcbiAgICAgICAgZnJlZXplQ2xhc3M6ICAgJ2ZyZWV6ZScgLy8gU3RyaW5nIC0gQ2xhc3MgYWRkZWQgdG8gbGF5ZXIgd2hlbiBmcm96ZW5cclxuICAgICAgfSxcclxuICBcclxuICAgICAgdmFsdWUgPSB7XHJcbiAgICAgICAgbGVmdDogMSxcclxuICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgbWlkZGxlOiAwLjUsXHJcbiAgICAgICAgY2VudGVyOiAwLjUsXHJcbiAgICAgICAgcmlnaHQ6IDEsXHJcbiAgICAgICAgYm90dG9tOiAxXHJcbiAgICAgIH0sXHJcbiAgXHJcbiAgICAgIHJweCA9IC9eXFxkK1xccz9weCQvLFxyXG4gICAgICBycGVyY2VudCA9IC9eXFxkK1xccz8lJC8sXHJcbiAgICAgIFxyXG4gICAgICB3aW4gPSBqUXVlcnkod2luZG93KSxcclxuICAgICAgZG9jID0galF1ZXJ5KGRvY3VtZW50KSxcclxuICAgICAgbW91c2UgPSBbMCwgMF07XHJcbiAgXHJcbiAgdmFyIFRpbWVyID0gKGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgZGVidWcgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgLy8gU2hpbSBmb3IgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBmYWxsaW5nIGJhY2sgdG8gdGltZXIuIFNlZTpcclxuICAgIC8vIHNlZSBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xyXG4gICAgdmFyIHJlcXVlc3RGcmFtZSA9IChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGZuLCBub2RlKXtcclxuICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGZuKCk7XHJcbiAgICAgICAgICAgICAgfSwgMjUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pKCk7XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIFRpbWVyKCkge1xyXG4gICAgICB2YXIgY2FsbGJhY2tzID0gW10sXHJcbiAgICAgICAgbmV4dEZyYW1lO1xyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gbm9vcCgpIHt9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBmcmFtZSgpe1xyXG4gICAgICAgIHZhciBjYnMgPSBjYWxsYmFja3Muc2xpY2UoMCksXHJcbiAgICAgICAgICAgIGwgPSBjYnMubGVuZ3RoLFxyXG4gICAgICAgICAgICBpID0gLTE7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGRlYnVnKSB7IGNvbnNvbGUubG9nKCd0aW1lciBmcmFtZSgpJywgbCk7IH1cclxuICAgICAgICBcclxuICAgICAgICB3aGlsZSgrK2kgPCBsKSB7IGNic1tpXS5jYWxsKHRoaXMpOyB9XHJcbiAgICAgICAgcmVxdWVzdEZyYW1lKG5leHRGcmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gICAgICAgIGlmIChkZWJ1ZykgeyBjb25zb2xlLmxvZygndGltZXIgc3RhcnQoKScpOyB9XHJcbiAgICAgICAgdGhpcy5zdGFydCA9IG5vb3A7XHJcbiAgICAgICAgdGhpcy5zdG9wID0gc3RvcDtcclxuICAgICAgICBuZXh0RnJhbWUgPSBmcmFtZTtcclxuICAgICAgICByZXF1ZXN0RnJhbWUobmV4dEZyYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gc3RvcCgpIHtcclxuICAgICAgICBpZiAoZGVidWcpIHsgY29uc29sZS5sb2coJ3RpbWVyIHN0b3AoKScpOyB9XHJcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xyXG4gICAgICAgIHRoaXMuc3RvcCA9IG5vb3A7XHJcbiAgICAgICAgbmV4dEZyYW1lID0gbm9vcDtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdGhpcy5jYWxsYmFja3MgPSBjYWxsYmFja3M7XHJcbiAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcclxuICAgICAgdGhpcy5zdG9wID0gc3RvcDtcclxuICAgIH1cclxuXHJcbiAgICBUaW1lci5wcm90b3R5cGUgPSB7XHJcbiAgICAgIGFkZDogZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5jYWxsYmFja3MsXHJcbiAgICAgICAgICAgIGwgPSBjYWxsYmFja3MubGVuZ3RoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGlzIGNhbGxiYWNrIGlzIGFscmVhZHkgaW4gdGhlIGxpc3QuXHJcbiAgICAgICAgLy8gRG9uJ3QgYWRkIGl0IHR3aWNlLlxyXG4gICAgICAgIHdoaWxlIChsLS0pIHtcclxuICAgICAgICAgIGlmIChjYWxsYmFja3NbbF0gPT09IGZuKSB7IHJldHVybjsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGZuKTtcclxuICAgICAgICBpZiAoZGVidWcpIHsgY29uc29sZS5sb2coJ3RpbWVyIGFkZCgpJywgdGhpcy5jYWxsYmFja3MubGVuZ3RoKTsgfVxyXG4gICAgICB9LFxyXG4gICAgXHJcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5jYWxsYmFja3MsXHJcbiAgICAgICAgICAgIGwgPSBjYWxsYmFja3MubGVuZ3RoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFJlbW92ZSBhbGwgaW5zdGFuY2VzIG9mIHRoaXMgY2FsbGJhY2suXHJcbiAgICAgICAgd2hpbGUgKGwtLSkge1xyXG4gICAgICAgICAgaWYgKGNhbGxiYWNrc1tsXSA9PT0gZm4pIHsgY2FsbGJhY2tzLnNwbGljZShsLCAxKTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoZGVidWcpIHsgY29uc29sZS5sb2coJ3RpbWVyIHJlbW92ZSgpJywgdGhpcy5jYWxsYmFja3MubGVuZ3RoKTsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChjYWxsYmFja3MubGVuZ3RoID09PSAwKSB7IHRoaXMuc3RvcCgpOyB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIHJldHVybiBUaW1lcjtcclxuICB9KSgpO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIHBhcnNlQ29vcmQoeCkge1xyXG4gICAgcmV0dXJuIChycGVyY2VudC5leGVjKHgpKSA/IHBhcnNlRmxvYXQoeCkvMTAwIDogeDtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gcGFyc2VCb29sKHgpIHtcclxuICAgIHJldHVybiB0eXBlb2YgeCA9PT0gXCJib29sZWFuXCIgPyB4IDogISEoIHBhcnNlRmxvYXQoeCkgKSA7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIHBvcnREYXRhKHBvcnQpIHtcclxuICAgIHZhciBldmVudHMgPSB7XHJcbiAgICAgICAgICAnbW91c2VlbnRlci5wYXJhbGxheCc6IG1vdXNlZW50ZXIsXHJcbiAgICAgICAgICAnbW91c2VsZWF2ZS5wYXJhbGxheCc6IG1vdXNlbGVhdmVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdpbkV2ZW50cyA9IHtcclxuICAgICAgICAgICdyZXNpemUucGFyYWxsYXgnOiByZXNpemVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICBlbGVtOiBwb3J0LFxyXG4gICAgICAgICAgZXZlbnRzOiBldmVudHMsXHJcbiAgICAgICAgICB3aW5FdmVudHM6IHdpbkV2ZW50cyxcclxuICAgICAgICAgIHRpbWVyOiBuZXcgVGltZXIoKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGF5ZXJzLCBzaXplLCBvZmZzZXQ7XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVBvaW50ZXIoKSB7XHJcbiAgICAgIGRhdGEucG9pbnRlciA9IGdldFBvaW50ZXIobW91c2UsIFt0cnVlLCB0cnVlXSwgb2Zmc2V0LCBzaXplKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZnVuY3Rpb24gcmVzaXplKCkge1xyXG4gICAgICBzaXplID0gZ2V0U2l6ZShwb3J0KTtcclxuICAgICAgb2Zmc2V0ID0gZ2V0T2Zmc2V0KHBvcnQpO1xyXG4gICAgICBkYXRhLnRocmVzaG9sZCA9IGdldFRocmVzaG9sZChzaXplKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZnVuY3Rpb24gbW91c2VlbnRlcigpIHtcclxuICAgICAgZGF0YS50aW1lci5hZGQodXBkYXRlUG9pbnRlcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIG1vdXNlbGVhdmUoZSkge1xyXG4gICAgICBkYXRhLnRpbWVyLnJlbW92ZSh1cGRhdGVQb2ludGVyKTtcclxuICAgICAgZGF0YS5wb2ludGVyID0gZ2V0UG9pbnRlcihbZS5wYWdlWCwgZS5wYWdlWV0sIFt0cnVlLCB0cnVlXSwgb2Zmc2V0LCBzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB3aW4ub24od2luRXZlbnRzKTtcclxuICAgIHBvcnQub24oZXZlbnRzKTtcclxuICAgIFxyXG4gICAgcmVzaXplKCk7XHJcbiAgICBcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBnZXREYXRhKGVsZW0sIG5hbWUsIGZuKSB7XHJcbiAgICB2YXIgZGF0YSA9IGVsZW0uZGF0YShuYW1lKTtcclxuICAgIFxyXG4gICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgIGRhdGEgPSBmbiA/IGZuKGVsZW0pIDoge30gO1xyXG4gICAgICBlbGVtLmRhdGEobmFtZSwgZGF0YSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBnZXRQb2ludGVyKG1vdXNlLCBwYXJhbGxheCwgb2Zmc2V0LCBzaXplKXtcclxuICAgIHZhciBwb2ludGVyID0gW10sXHJcbiAgICAgICAgeCA9IDI7XHJcbiAgICBcclxuICAgIHdoaWxlICh4LS0pIHtcclxuICAgICAgcG9pbnRlclt4XSA9IChtb3VzZVt4XSAtIG9mZnNldFt4XSkgLyBzaXplW3hdIDtcclxuICAgICAgcG9pbnRlclt4XSA9IHBvaW50ZXJbeF0gPCAwID8gMCA6IHBvaW50ZXJbeF0gPiAxID8gMSA6IHBvaW50ZXJbeF0gO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gcG9pbnRlcjtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gZ2V0U2l6ZShlbGVtKSB7XHJcbiAgICByZXR1cm4gW2VsZW0ud2lkdGgoKSwgZWxlbS5oZWlnaHQoKV07XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGdldE9mZnNldChlbGVtKSB7XHJcbiAgICB2YXIgb2Zmc2V0ID0gZWxlbS5vZmZzZXQoKSB8fCB7bGVmdDogMCwgdG9wOiAwfSxcclxuICAgICAgYm9yZGVyTGVmdCA9IGVsZW0uY3NzKCdib3JkZXJMZWZ0U3R5bGUnKSA9PT0gJ25vbmUnID8gMCA6IHBhcnNlSW50KGVsZW0uY3NzKCdib3JkZXJMZWZ0V2lkdGgnKSwgMTApLFxyXG4gICAgICBib3JkZXJUb3AgPSBlbGVtLmNzcygnYm9yZGVyVG9wU3R5bGUnKSA9PT0gJ25vbmUnID8gMCA6IHBhcnNlSW50KGVsZW0uY3NzKCdib3JkZXJUb3BXaWR0aCcpLCAxMCksXHJcbiAgICAgIHBhZGRpbmdMZWZ0ID0gcGFyc2VJbnQoZWxlbS5jc3MoJ3BhZGRpbmdMZWZ0JyksIDEwKSxcclxuICAgICAgcGFkZGluZ1RvcCA9IHBhcnNlSW50KGVsZW0uY3NzKCdwYWRkaW5nVG9wJyksIDEwKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIFtvZmZzZXQubGVmdCArIGJvcmRlckxlZnQgKyBwYWRkaW5nTGVmdCwgb2Zmc2V0LnRvcCArIGJvcmRlclRvcCArIHBhZGRpbmdUb3BdO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBnZXRUaHJlc2hvbGQoc2l6ZSkge1xyXG4gICAgcmV0dXJuIFsxL3NpemVbMF0sIDEvc2l6ZVsxXV07XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGxheWVyU2l6ZShlbGVtLCB4LCB5KSB7XHJcbiAgICByZXR1cm4gW3ggfHwgZWxlbS5vdXRlcldpZHRoKCksIHkgfHwgZWxlbS5vdXRlckhlaWdodCgpXTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gbGF5ZXJPcmlnaW4oeG8sIHlvKSB7XHJcbiAgICB2YXIgbyA9IFt4bywgeW9dLFxyXG4gICAgICBpID0gMixcclxuICAgICAgb3JpZ2luID0gW107XHJcbiAgICBcclxuICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgb3JpZ2luW2ldID0gdHlwZW9mIG9baV0gPT09ICdzdHJpbmcnID9cclxuICAgICAgICBvW2ldID09PSB1bmRlZmluZWQgP1xyXG4gICAgICAgICAgMSA6XHJcbiAgICAgICAgICB2YWx1ZVtvcmlnaW5baV1dIHx8IHBhcnNlQ29vcmQob3JpZ2luW2ldKSA6XHJcbiAgICAgICAgb1tpXSA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBvcmlnaW47XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGxheWVyUHgoeHAsIHlwKSB7XHJcbiAgICByZXR1cm4gW3JweC50ZXN0KHhwKSwgcnB4LnRlc3QoeXApXTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gbGF5ZXJQYXJhbGxheCh4cCwgeXAsIHB4KSB7XHJcbiAgICB2YXIgcCA9IFt4cCwgeXBdLFxyXG4gICAgICAgIGkgPSAyLFxyXG4gICAgICAgIHBhcmFsbGF4ID0gW107XHJcbiAgICBcclxuICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgcGFyYWxsYXhbaV0gPSBweFtpXSA/XHJcbiAgICAgICAgcGFyc2VJbnQocFtpXSwgMTApIDpcclxuICAgICAgICBwYXJhbGxheFtpXSA9IHBbaV0gPT09IHRydWUgPyAxIDogcGFyc2VDb29yZChwW2ldKSA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBwYXJhbGxheDtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gbGF5ZXJPZmZzZXQocGFyYWxsYXgsIHB4LCBvcmlnaW4sIHNpemUpIHtcclxuICAgIHZhciBpID0gMixcclxuICAgICAgICBvZmZzZXQgPSBbXTtcclxuICAgIFxyXG4gICAgd2hpbGUgKGktLSkge1xyXG4gICAgICBvZmZzZXRbaV0gPSBweFtpXSA/XHJcbiAgICAgICAgb3JpZ2luW2ldICogKHNpemVbaV0gLSBwYXJhbGxheFtpXSkgOlxyXG4gICAgICAgIHBhcmFsbGF4W2ldID8gb3JpZ2luW2ldICogKCAxIC0gcGFyYWxsYXhbaV0gKSA6IDAgO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gb2Zmc2V0O1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBsYXllclBvc2l0aW9uKHB4LCBvcmlnaW4pIHtcclxuICAgIHZhciBpID0gMixcclxuICAgICAgICBwb3NpdGlvbiA9IFtdO1xyXG4gICAgXHJcbiAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgIGlmIChweFtpXSkge1xyXG4gICAgICAgIC8vIFNldCBjc3MgcG9zaXRpb24gY29uc3RhbnRcclxuICAgICAgICBwb3NpdGlvbltpXSA9IG9yaWdpbltpXSAqIDEwMCArICclJztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBsYXllclBvaW50ZXIoZWxlbSwgcGFyYWxsYXgsIHB4LCBvZmZzZXQsIHNpemUpIHtcclxuICAgIHZhciB2aWV3cG9ydCA9IGVsZW0ub2Zmc2V0UGFyZW50KCksXHJcbiAgICAgIHBvcyA9IGVsZW0ucG9zaXRpb24oKSxcclxuICAgICAgcG9zaXRpb24gPSBbXSxcclxuICAgICAgcG9pbnRlciA9IFtdLFxyXG4gICAgICBpID0gMjtcclxuICAgIFxyXG4gICAgLy8gUmV2ZXJzZSBjYWxjdWxhdGUgcmF0aW8gZnJvbSBlbGVtJ3MgY3VycmVudCBwb3NpdGlvblxyXG4gICAgd2hpbGUgKGktLSkge1xyXG4gICAgICBwb3NpdGlvbltpXSA9IHB4W2ldID9cclxuICAgICAgICAvLyBUT0RPOiByZXZlcnNlIGNhbGN1bGF0aW9uIGZvciBwaXhlbCBjYXNlXHJcbiAgICAgICAgMCA6XHJcbiAgICAgICAgcG9zW2kgPT09IDAgPyAnbGVmdCcgOiAndG9wJ10gLyAodmlld3BvcnRbaSA9PT0gMCA/ICdvdXRlcldpZHRoJyA6ICdvdXRlckhlaWdodCddKCkgLSBzaXplW2ldKSA7XHJcbiAgICAgIFxyXG4gICAgICBwb2ludGVyW2ldID0gKHBvc2l0aW9uW2ldIC0gb2Zmc2V0W2ldKSAvIHBhcmFsbGF4W2ldIDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHBvaW50ZXI7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGxheWVyQ3NzKHBhcmFsbGF4LCBweCwgb2Zmc2V0LCBzaXplLCBwb3NpdGlvbiwgcG9pbnRlcikge1xyXG4gICAgdmFyIHBvcyA9IFtdLFxyXG4gICAgICAgIGNzc1Bvc2l0aW9uLFxyXG4gICAgICAgIGNzc01hcmdpbixcclxuICAgICAgICB4ID0gMixcclxuICAgICAgICBjc3MgPSB7fTtcclxuICAgIFxyXG4gICAgd2hpbGUgKHgtLSkge1xyXG4gICAgICBpZiAocGFyYWxsYXhbeF0pIHtcclxuICAgICAgICBwb3NbeF0gPSBwYXJhbGxheFt4XSAqIHBvaW50ZXJbeF0gKyBvZmZzZXRbeF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gV2UncmUgd29ya2luZyBpbiBwaXhlbHNcclxuICAgICAgICBpZiAocHhbeF0pIHtcclxuICAgICAgICAgIGNzc1Bvc2l0aW9uID0gcG9zaXRpb25beF07XHJcbiAgICAgICAgICBjc3NNYXJnaW4gPSBwb3NbeF0gKiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gV2UncmUgd29ya2luZyBieSByYXRpb1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgY3NzUG9zaXRpb24gPSBwb3NbeF0gKiAxMDAgKyAnJSc7XHJcbiAgICAgICAgICBjc3NNYXJnaW4gPSBwb3NbeF0gKiBzaXplW3hdICogLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZpbGwgaW4gY3NzIG9iamVjdFxyXG4gICAgICAgIGlmICh4ID09PSAwKSB7XHJcbiAgICAgICAgICBjc3MubGVmdCA9IGNzc1Bvc2l0aW9uO1xyXG4gICAgICAgICAgY3NzLm1hcmdpbkxlZnQgPSBjc3NNYXJnaW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgY3NzLnRvcCA9IGNzc1Bvc2l0aW9uO1xyXG4gICAgICAgICAgY3NzLm1hcmdpblRvcCA9IGNzc01hcmdpbjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIGNzcztcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gcG9pbnRlck9mZlRhcmdldCh0YXJnZXRQb2ludGVyLCBwcmV2UG9pbnRlciwgdGhyZXNob2xkLCBkZWNheSwgcGFyYWxsYXgsIHRhcmdldEZuLCB1cGRhdGVGbikge1xyXG4gICAgdmFyIHBvaW50ZXIsIHg7XHJcbiAgICBcclxuICAgIGlmICgoIXBhcmFsbGF4WzBdIHx8IE1hdGguYWJzKHRhcmdldFBvaW50ZXJbMF0gLSBwcmV2UG9pbnRlclswXSkgPCB0aHJlc2hvbGRbMF0pICYmXHJcbiAgICAgICAgKCFwYXJhbGxheFsxXSB8fCBNYXRoLmFicyh0YXJnZXRQb2ludGVyWzFdIC0gcHJldlBvaW50ZXJbMV0pIDwgdGhyZXNob2xkWzFdKSkge1xyXG4gICAgICAgIC8vIFBvaW50ZXIgaGFzIGhpdCB0aGUgdGFyZ2V0XHJcbiAgICAgICAgaWYgKHRhcmdldEZuKSB7IHRhcmdldEZuKCk7IH1cclxuICAgICAgICByZXR1cm4gdXBkYXRlRm4odGFyZ2V0UG9pbnRlcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFBvaW50ZXIgaXMgbm93aGVyZSBuZWFyIHRoZSB0YXJnZXRcclxuICAgIHBvaW50ZXIgPSBbXTtcclxuICAgIHggPSAyO1xyXG4gICAgXHJcbiAgICB3aGlsZSAoeC0tKSB7XHJcbiAgICAgIGlmIChwYXJhbGxheFt4XSkge1xyXG4gICAgICAgIHBvaW50ZXJbeF0gPSB0YXJnZXRQb2ludGVyW3hdICsgZGVjYXkgKiAocHJldlBvaW50ZXJbeF0gLSB0YXJnZXRQb2ludGVyW3hdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgICBcclxuICAgIHJldHVybiB1cGRhdGVGbihwb2ludGVyKTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gcG9pbnRlck9uVGFyZ2V0KHRhcmdldFBvaW50ZXIsIHByZXZQb2ludGVyLCB0aHJlc2hvbGQsIGRlY2F5LCBwYXJhbGxheCwgdGFyZ2V0Rm4sIHVwZGF0ZUZuKSB7XHJcbiAgICAvLyBEb24ndCBib3RoZXIgdXBkYXRpbmcgaWYgdGhlIHBvaW50ZXIgaGFzbid0IGNoYW5nZWQuXHJcbiAgICBpZiAodGFyZ2V0UG9pbnRlclswXSA9PT0gcHJldlBvaW50ZXJbMF0gJiYgdGFyZ2V0UG9pbnRlclsxXSA9PT0gcHJldlBvaW50ZXJbMV0pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gdXBkYXRlRm4odGFyZ2V0UG9pbnRlcik7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIHVucG9ydChlbGVtLCBldmVudHMsIHdpbkV2ZW50cykge1xyXG4gICAgZWxlbS5vZmYoZXZlbnRzKS5yZW1vdmVEYXRhKCdwYXJhbGxheF9wb3J0Jyk7XHJcbiAgICB3aW4ub2ZmKHdpbkV2ZW50cyk7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIHVucGFyYWxsYXgobm9kZSwgcG9ydCwgZXZlbnRzKSB7XHJcbiAgICBwb3J0LmVsZW0ub2ZmKGV2ZW50cyk7XHJcbiAgICBcclxuICAgIC8vIFJlbW92ZSB0aGlzIG5vZGUgZnJvbSBsYXllcnNcclxuICAgIHBvcnQubGF5ZXJzID0gcG9ydC5sYXllcnMubm90KG5vZGUpO1xyXG4gICAgXHJcbiAgICAvLyBJZiBwb3J0LmxheWVycyBpcyBlbXB0eSwgZGVzdHJveSB0aGUgcG9ydFxyXG4gICAgaWYgKHBvcnQubGF5ZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB1bnBvcnQocG9ydC5lbGVtLCBwb3J0LmV2ZW50cywgcG9ydC53aW5FdmVudHMpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiB1bnN0eWxlKHBhcmFsbGF4KSB7XHJcbiAgICB2YXIgY3NzID0ge307XHJcbiAgICBcclxuICAgIGlmIChwYXJhbGxheFswXSkge1xyXG4gICAgICBjc3MubGVmdCA9ICcnO1xyXG4gICAgICBjc3MubWFyZ2luTGVmdCA9ICcnO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAocGFyYWxsYXhbMV0pIHtcclxuICAgICAgY3NzLnRvcCA9ICcnO1xyXG4gICAgICBjc3MubWFyZ2luVG9wID0gJyc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGVsZW0uY3NzKGNzcyk7XHJcbiAgfVxyXG4gIFxyXG4gIGpRdWVyeS5mbi5wYXJhbGxheCA9IGZ1bmN0aW9uKG8pe1xyXG4gICAgdmFyIG9wdGlvbnMgPSBqUXVlcnkuZXh0ZW5kKHt9LCBqUXVlcnkuZm4ucGFyYWxsYXgub3B0aW9ucywgbyksXHJcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cyxcclxuICAgICAgICBlbGVtID0gb3B0aW9ucy5tb3VzZXBvcnQgaW5zdGFuY2VvZiBqUXVlcnkgP1xyXG4gICAgICAgICAgb3B0aW9ucy5tb3VzZXBvcnQgOlxyXG4gICAgICAgICAgalF1ZXJ5KG9wdGlvbnMubW91c2Vwb3J0KSAsXHJcbiAgICAgICAgcG9ydCA9IGdldERhdGEoZWxlbSwgJ3BhcmFsbGF4X3BvcnQnLCBwb3J0RGF0YSksXHJcbiAgICAgICAgdGltZXIgPSBwb3J0LnRpbWVyO1xyXG4gICAgXHJcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGkpIHtcclxuICAgICAgdmFyIG5vZGUgICAgICA9IHRoaXMsXHJcbiAgICAgICAgICBlbGVtICAgICAgPSBqUXVlcnkodGhpcyksXHJcbiAgICAgICAgICBvcHRzICAgICAgPSBhcmdzW2kgKyAxXSA/IGpRdWVyeS5leHRlbmQoe30sIG9wdGlvbnMsIGFyZ3NbaSArIDFdKSA6IG9wdGlvbnMsXHJcbiAgICAgICAgICBkZWNheSAgICAgPSBvcHRzLmRlY2F5LFxyXG4gICAgICAgICAgc2l6ZSAgICAgID0gbGF5ZXJTaXplKGVsZW0sIG9wdHMud2lkdGgsIG9wdHMuaGVpZ2h0KSxcclxuICAgICAgICAgIG9yaWdpbiAgICA9IGxheWVyT3JpZ2luKG9wdHMueG9yaWdpbiwgb3B0cy55b3JpZ2luKSxcclxuICAgICAgICAgIHB4ICAgICAgICA9IGxheWVyUHgob3B0cy54cGFyYWxsYXgsIG9wdHMueXBhcmFsbGF4KSxcclxuICAgICAgICAgIHBhcmFsbGF4ICA9IGxheWVyUGFyYWxsYXgob3B0cy54cGFyYWxsYXgsIG9wdHMueXBhcmFsbGF4LCBweCksXHJcbiAgICAgICAgICBvZmZzZXQgICAgPSBsYXllck9mZnNldChwYXJhbGxheCwgcHgsIG9yaWdpbiwgc2l6ZSksXHJcbiAgICAgICAgICBwb3NpdGlvbiAgPSBsYXllclBvc2l0aW9uKHB4LCBvcmlnaW4pLFxyXG4gICAgICAgICAgcG9pbnRlciAgID0gbGF5ZXJQb2ludGVyKGVsZW0sIHBhcmFsbGF4LCBweCwgb2Zmc2V0LCBzaXplKSxcclxuICAgICAgICAgIHBvaW50ZXJGbiA9IHBvaW50ZXJPZmZUYXJnZXQsXHJcbiAgICAgICAgICB0YXJnZXRGbiAgPSB0YXJnZXRJbnNpZGUsXHJcbiAgICAgICAgICBldmVudHMgPSB7XHJcbiAgICAgICAgICAgICdtb3VzZWVudGVyLnBhcmFsbGF4JzogZnVuY3Rpb24gbW91c2VlbnRlcihlKSB7XHJcbiAgICAgICAgICAgICAgcG9pbnRlckZuID0gcG9pbnRlck9mZlRhcmdldDtcclxuICAgICAgICAgICAgICB0YXJnZXRGbiA9IHRhcmdldEluc2lkZTtcclxuICAgICAgICAgICAgICB0aW1lci5hZGQoZnJhbWUpO1xyXG4gICAgICAgICAgICAgIHRpbWVyLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdtb3VzZWxlYXZlLnBhcmFsbGF4JzogZnVuY3Rpb24gbW91c2VsZWF2ZShlKSB7XHJcbiAgICAgICAgICAgICAgLy8gTWFrZSB0aGUgbGF5ZXIgY29tZSB0byByZXN0IGF0IGl0J3MgbGltaXQgd2l0aCBpbmVydGlhXHJcbiAgICAgICAgICAgICAgcG9pbnRlckZuID0gcG9pbnRlck9mZlRhcmdldDtcclxuICAgICAgICAgICAgICAvLyBTdG9wIHRoZSB0aW1lciB3aGVuIHRoZSB0aGUgcG9pbnRlciBoaXRzIHRhcmdldFxyXG4gICAgICAgICAgICAgIHRhcmdldEZuID0gdGFyZ2V0T3V0c2lkZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNzcyhuZXdQb2ludGVyKSB7XHJcbiAgICAgICAgdmFyIGNzcyA9IGxheWVyQ3NzKHBhcmFsbGF4LCBweCwgb2Zmc2V0LCBzaXplLCBwb3NpdGlvbiwgbmV3UG9pbnRlcik7XHJcbiAgICAgICAgZWxlbS5jc3MoY3NzKTtcclxuICAgICAgICBwb2ludGVyID0gbmV3UG9pbnRlcjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gZnJhbWUoKSB7XHJcbiAgICAgICAgcG9pbnRlckZuKHBvcnQucG9pbnRlciwgcG9pbnRlciwgcG9ydC50aHJlc2hvbGQsIGRlY2F5LCBwYXJhbGxheCwgdGFyZ2V0Rm4sIHVwZGF0ZUNzcyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHRhcmdldEluc2lkZSgpIHtcclxuICAgICAgICAvLyBQb2ludGVyIGhpdHMgdGhlIHRhcmdldCBwb2ludGVyIGluc2lkZSB0aGUgcG9ydFxyXG4gICAgICAgIHBvaW50ZXJGbiA9IHBvaW50ZXJPblRhcmdldDtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gdGFyZ2V0T3V0c2lkZSgpIHtcclxuICAgICAgICAvLyBQb2ludGVyIGhpdHMgdGhlIHRhcmdldCBwb2ludGVyIG91dHNpZGUgdGhlIHBvcnRcclxuICAgICAgICB0aW1lci5yZW1vdmUoZnJhbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGpRdWVyeS5kYXRhKG5vZGUsICdwYXJhbGxheCcpKSB7XHJcbiAgICAgICAgZWxlbS51bnBhcmFsbGF4KCk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGpRdWVyeS5kYXRhKG5vZGUsICdwYXJhbGxheCcsIHtcclxuICAgICAgICBwb3J0OiBwb3J0LFxyXG4gICAgICAgIGV2ZW50czogZXZlbnRzLFxyXG4gICAgICAgIHBhcmFsbGF4OiBwYXJhbGxheFxyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIHBvcnQuZWxlbS5vbihldmVudHMpO1xyXG4gICAgICBwb3J0LmxheWVycyA9IHBvcnQubGF5ZXJzPyBwb3J0LmxheWVycy5hZGQobm9kZSk6IGpRdWVyeShub2RlKTtcclxuICAgICAgXHJcbiAgICAgIC8qZnVuY3Rpb24gZnJlZXplKCkge1xyXG4gICAgICAgIGZyZWV6ZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHVuZnJlZXplKCkge1xyXG4gICAgICAgIGZyZWV6ZSA9IGZhbHNlO1xyXG4gICAgICB9Ki9cclxuICAgICAgXHJcbiAgICAgIC8qalF1ZXJ5LmV2ZW50LmFkZCh0aGlzLCAnZnJlZXplLnBhcmFsbGF4JywgZnJlZXplKTtcclxuICAgICAgalF1ZXJ5LmV2ZW50LmFkZCh0aGlzLCAndW5mcmVlemUucGFyYWxsYXgnLCB1bmZyZWV6ZSk7Ki9cclxuICAgIH0pO1xyXG4gIH07XHJcbiAgXHJcbiAgalF1ZXJ5LmZuLnVucGFyYWxsYXggPSBmdW5jdGlvbihib29sKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IGpRdWVyeS5kYXRhKHRoaXMsICdwYXJhbGxheCcpO1xyXG4gICAgICBcclxuICAgICAgLy8gVGhpcyBlbGVtIGlzIG5vdCBwYXJhbGxheGVkXHJcbiAgICAgIGlmICghZGF0YSkgeyByZXR1cm47IH1cclxuICAgICAgXHJcbiAgICAgIGpRdWVyeS5yZW1vdmVEYXRhKHRoaXMsICdwYXJhbGxheCcpO1xyXG4gICAgICB1bnBhcmFsbGF4KHRoaXMsIGRhdGEucG9ydCwgZGF0YS5ldmVudHMpO1xyXG4gICAgICBpZiAoYm9vbCkgeyB1bnN0eWxlKGRhdGEucGFyYWxsYXgpOyB9XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIFxyXG4gIGpRdWVyeS5mbi5wYXJhbGxheC5vcHRpb25zID0gb3B0aW9ucztcclxuICBcclxuICAvLyBQaWNrIHVwIGFuZCBzdG9yZSBtb3VzZSBwb3NpdGlvbiBvbiBkb2N1bWVudDogSUUgZG9lcyBub3QgcmVnaXN0ZXJcclxuICAvLyBtb3VzZW1vdmUgb24gd2luZG93LlxyXG4gIGRvYy5vbignbW91c2Vtb3ZlLnBhcmFsbGF4JywgZnVuY3Rpb24oZSl7XHJcbiAgICBtb3VzZSA9IFtlLnBhZ2VYLCBlLnBhZ2VZXTtcclxuICB9KTtcclxufShqUXVlcnkpKTtcclxuXHJcbnZhciBzY3JvbGxQYWdlID0gKGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICBzZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAkKFwiYVtocmVmKj0jXVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgdmFyIGFuY2hvciA9ICQodGhpcyk7XHJcbiAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogJChhbmNob3IuYXR0cignaHJlZicpKS5vZmZzZXQoKS50b3BcclxuICAgICAgICAgIH0sIDc3Nyk7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSgpKTtcclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICQoJy5mbGlwJykuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICQoJy5jb250LWZsaXAnKS50b2dnbGVDbGFzcygnZmxpcHBlZCcpO1xyXG4gICAgJCgnLmJ1dHRvbl9fd3JhcCcpLnRvZ2dsZUNsYXNzKCdidXR0b25fX3dyYXBfaGlkZGVuJylcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9KTtcclxuXHJcbiAgalF1ZXJ5KCcucGFyYWxsYXgtbGF5ZXInKS5wYXJhbGxheCh7XHJcbiAgICAgICAgbW91c2Vwb3J0OiBqUXVlcnkoXCIjcGFyYWxsYXhcIilcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICgkKCcuc2xpZGVyJykubGVuZ3RoKSB7XHJcbiAgICAgIHNsaWRlci5pbml0KCk7ICAgXHJcbiAgICB9XHJcbiAgICBpZiAoJCgnI3NlY3Rpb24nKS5sZW5ndGgpIHtcclxuICAgICAgc2Nyb2xsUGFnZS5zZXQoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAkKCcjdG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgJCgnI292ZXJsYXknKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc3RvcC1zY3JvbGxpbmcnKTtcclxuICAgIC8vICQoJ2JvZHknKS5iaW5kKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCl9KVxyXG4gICAgLy8gJCgnYm9keScpLnVuYmluZCgndG91Y2htb3ZlJylcclxuICAgIH0pO1xyXG4gIGlmICgkKCcjbWFwJykubGVuZ3RoKSB7XHJcbiAgICAgIHltYXBzLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyDQkiDRhNGD0L3QutGG0LjRjiDQv9C+0YHRgtGD0L/QsNC10YIg0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC+INC40LzQtdC9LCDQutC+0YLQvtGA0L7QtSDRgdC+0LTQtdGA0LbQuNGCINCy0YHQtSDQt9Cw0L/RgNC+0YnQtdC90L3Ri9C1INC/0YDQuCDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQvNC+0LTRg9C70LguIFxyXG4gICAgICAgICAgdmFyIG15TWFwID0gbmV3IHltYXBzLk1hcCgnbWFwJywge1xyXG4gICAgICAgICAgICAgICAgY2VudGVyOiBbNTAuNDUxMTEwMjIsIDMwLjQ1MDYyNTQyXSxcclxuICAgICAgICAgICAgICAgIHpvb206IDEyLFxyXG4gICAgICAgICAgICAgICAgLy8g0JIg0LTQsNC90L3QvtC8INC/0YDQuNC80LXRgNC1INC60LDRgNGC0LAg0YHQvtC30LTQsNC10YLRgdGPINCx0LXQtyDQutC+0L3RgtGA0L7Qu9C+0LIsINGC0LDQuiDQutCw0Log0YLQtSDQvdC1INCx0YvQu9C4INC30LDQs9GA0YPQttC10L3RiyDQv9GA0Lgg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40LggQVBJLlxyXG4gICAgICAgICAgICAgICAgY29udHJvbHM6IFtdXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBwbGFjZW1hcmsgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKFxyXG4gICAgICAgICAgICAgICAgbXlNYXAuZ2V0Q2VudGVyKCksIHtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgIG15TWFwLmJlaGF2aW9ycy5kaXNhYmxlKCdzY3JvbGxab29tJyk7XHJcbiAgICAgICAgLy8gbXlNYXAuZ2VvT2JqZWN0cy5hZGQocGxhY2VtYXJrKTsgIFxyXG4gICAgICB9KTsgXHJcbiAgfVxyXG4gIGlmICgkKCcuZmVhZGJhY2snKS5sZW5ndGgpIHtcclxuICAgIGJsdXIuc2V0KCk7XHJcbiAgfVxyXG4gIGlmICgkKCcuYmxvZ19fbGlzdCcpLmxlbmd0aCkge1xyXG4gICAgY29uc29sZS5sb2coMjIzKTtcclxuICAgIGJsb2dNZW51LnNldCgpO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuJChkb2N1bWVudCkucmVzaXplKGZ1bmN0aW9uKCl7XHJcbiAgaWYgKCQoJy5mZWFkYmFjaycpLmxlbmd0aCkge1xyXG4gICAgYmx1ci5zZXQoKTtcclxuICB9XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
