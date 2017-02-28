'use strict'

$(function () {

	var imgs = [];

	$.each($('*'), function () {
		var
			$this = $(this),
			background = $this.css('background-image'),
			img = $this.is('img');

		if (background != 'none') {
			var path = background.replace('url("', '').replace('")', '');
			imgs.push(path);
     // console.log(path);
		}

		if (img) {
			var path = $this.attr('src');

			if (path) {
				imgs.push(path);
			}
		}

	}); 
	
	var percentsTotal = 1;

  function setPercents(total, current) {
    var percent = Math.ceil(current / total * 100);

    if (percent >= 100) {
      $('.preloader').fadeOut();
    }

    $('.preloader__percents').text(percent + '%');
  }
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
    activeHeight =  1; // высота от верха экрана при которой срабатывает переключение
  if (  $('.blog__list').length){
    var stickySidebar = $('.blog__list').offset().top;
  }

  return {
    set: function(){  
      $(window).scroll(function() { 
        //console.log($(window).scrollTop())

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
    timerDuration = 4000;

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
    blogMenu.set();
  }
});


$(document).resize(function(){
  if ($('.feadback').length) {
    blur.set();
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcblxyXG5cdHZhciBpbWdzID0gW107XHJcblxyXG5cdCQuZWFjaCgkKCcqJyksIGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhclxyXG5cdFx0XHQkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdGJhY2tncm91bmQgPSAkdGhpcy5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKSxcclxuXHRcdFx0aW1nID0gJHRoaXMuaXMoJ2ltZycpO1xyXG5cclxuXHRcdGlmIChiYWNrZ3JvdW5kICE9ICdub25lJykge1xyXG5cdFx0XHR2YXIgcGF0aCA9IGJhY2tncm91bmQucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTtcclxuXHRcdFx0aW1ncy5wdXNoKHBhdGgpO1xyXG4gICAgICBjb25zb2xlLmxvZyhwYXRoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaW1nKSB7XHJcblx0XHRcdHZhciBwYXRoID0gJHRoaXMuYXR0cignc3JjJyk7XHJcblxyXG5cdFx0XHRpZiAocGF0aCkge1xyXG5cdFx0XHRcdGltZ3MucHVzaChwYXRoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9KTsgXHJcbiAgY29uc29sZS5sb2coaW1ncyk7XHJcblx0XHJcblx0dmFyIHBlcmNlbnRzVG90YWwgPSAxO1xyXG5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGltZ3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpbWFnZSA9ICQoJzxpbWc+Jywge1xyXG5cdFx0XHRhdHRyOiB7XHJcblx0XHRcdFx0c3JjOiBpbWdzW2ldXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGltYWdlLm9uKHtcclxuXHRcdFx0bG9hZCA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRzZXRQZXJjZW50cyhpbWdzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcblx0XHRcdFx0cGVyY2VudHNUb3RhbCsrO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0ZXJyb3IgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcGVyY2VudHNUb3RhbCsrO1xyXG5cdFx0XHRcdHNldFByZWNlbnRzKGltZ3MubGVuZ3RoLCBwZXJjZW50c1RvdGFsKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQZXJjZW50cyh0b3RhbCwgY3VycmVudCkge1xyXG5cdFx0dmFyIHBlcmNlbnQgPSBNYXRoLmNlaWwoY3VycmVudCAvIHRvdGFsICogMTAwKTtcclxuXHJcblx0XHRpZiAocGVyY2VudCA+PSAxMDApIHtcclxuXHRcdFx0JCgnLnByZWxvYWRlcicpLmZhZGVPdXQoKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKCcucHJlbG9hZGVyX19wZXJjZW50cycpLnRleHQocGVyY2VudCArICclJyk7XHJcblx0fVxyXG4gIC8vICQoJy5wcmVsb2FkZXInKS5mYWRlT3V0KCk7XHJcbn0pO1xyXG5cclxudmFyIGJsdXIgPSAoZnVuY3Rpb24oKXtcclxuICAgIHZhciBcclxuICAgICAgICBibHVyID0gJCgnLmZlYWRiYWNrX19ibHVyJyksXHJcbiAgICAgICAgYmx1clNlY3Rpb24gPSAkKCcuYWJvdXQtbWUnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBcclxuICAgICAgICAgICAgaW1nV2lkdGggPSAkKCcuYWJvdXQtbWUnKS53aWR0aCgpLFxyXG4gICAgICAgICAgICBpbWdIZWlnaHQgPSAkKCcuYWJvdXQtbWUnKS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgcG9zTGVmdCA9IGJsdXJTZWN0aW9uLm9mZnNldCgpLmxlZnQgLSBibHVyLm9mZnNldCgpLmxlZnQsXHJcbiAgICAgICAgICAgIHBvc1RvcCA9IGJsdXJTZWN0aW9uLm9mZnNldCgpLnRvcCAtIGJsdXIub2Zmc2V0KCkudG9wLFxyXG4gICAgICAgICAgICBwb3NUb3BzID0gcG9zVG9wICsgKC1wb3NUb3AqLjEpO1xyXG4gICAgICAgIGJsdXIuY3NzKHtcclxuICAgICAgICAgICdiYWNrZ3JvdW5kLXNpemUnOiBpbWdXaWR0aCArICdweCcgKyAnICcgKyBpbWdIZWlnaHQgKyAncHgnLFxyXG4gICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24nOiBwb3NMZWZ0ICsgJ3B4JyArICcgJyArIHBvc1RvcHMgKyAncHgnICAgICAgICBcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbn0oKSk7XHJcblxyXG52YXIgYmxvZ01lbnUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgdmFyIFxyXG4gICAgbGlua05hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tocmVmXj1cIiNuYXZcIl0nKSxcclxuICAgIFYgPSAwLjUsIC8vINGB0LrQvtGA0L7RgdGC0Ywg0YHQutGA0L7Qu9CwINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC80LXQvdGOXHJcbiAgICBhY3RpdmVIZWlnaHQgPSAgMTsgLy8g0LLRi9GB0L7RgtCwINC+0YIg0LLQtdGA0YXQsCDRjdC60YDQsNC90LAg0L/RgNC4INC60L7RgtC+0YDQvtC5INGB0YDQsNCx0LDRgtGL0LLQsNC10YIg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNC1XHJcbiAgaWYgKCAgJCgnLmJsb2dfX2xpc3QnKS5sZW5ndGgpe1xyXG4gICAgdmFyIHN0aWNreVNpZGViYXIgPSAkKCcuYmxvZ19fbGlzdCcpLm9mZnNldCgpLnRvcDtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzZXQ6IGZ1bmN0aW9uKCl7ICBcclxuICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgY29uc29sZS5sb2coJCh3aW5kb3cpLnNjcm9sbFRvcCgpKVxyXG5cclxuICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgYWN0aXZlSGVpZ2h0ID4gc3RpY2t5U2lkZWJhcikge1xyXG4gICAgICAgICAgICAkKCcuYmxvZ19fbGlzdCcpLmFkZENsYXNzKCdibG9nX19saXN0LWZpeCcpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5ibG9nX19saXN0JykucmVtb3ZlQ2xhc3MoJ2Jsb2dfX2xpc3QtZml4Jyk7XHJcbiAgICAgICAgfSAgXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5rTmF2Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGlua05hdltpXS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHZhciB3ID0gd2luZG93LnBhZ2VZT2Zmc2V0LFxyXG4gICAgICAgICAgICAgIGhhc2ggPSB0aGlzLmhyZWYucmVwbGFjZSgvW14jXSooLiopLywgJyQxJyksXHJcbiAgICAgICAgICAgICAgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaGFzaCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wLFxyXG4gICAgICAgICAgICAgIHN0YXJ0ID0gbnVsbDtcclxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgICAgICAgIGZ1bmN0aW9uIHN0ZXAodGltZSkge1xyXG4gICAgICAgICAgICBpZiAoc3RhcnQgPT09IG51bGwpIHN0YXJ0ID0gdGltZTtcclxuICAgICAgICAgICAgdmFyIHByb2dyZXNzID0gdGltZSAtIHN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgciA9ICh0IDwgMCA/IE1hdGgubWF4KHcgLSBwcm9ncmVzcy9WLCB3ICsgdCkgOiBNYXRoLm1pbih3ICsgcHJvZ3Jlc3MvViwgdyArIHQpKTtcclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAscik7XHJcbiAgICAgICAgICAgIGlmIChyICE9IHcgKyB0KSB7cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApfSBlbHNlIHtsb2NhdGlvbi5oYXNoID0gaGFzaH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2VjdGlvbltpZF49XCJuYXZcIl0nKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXYubGVuZ3RoOyBpKyspIHsgXHJcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhW2hyZWY9XCIjJyArIG5hdltpXS5pZCArICdcIl0nKS5jbGFzc05hbWU9KCgxID49IG5hdltpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AtYWN0aXZlSGVpZ2h0ICYmIG5hdltpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPj0gYWN0aXZlSGVpZ2h0LW5hdltpXS5vZmZzZXRIZWlnaHQpID8gJ2Jsb2dfX2xpc3QtaXRlbV9hY3RpdmUnIDogJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxufSgpKTtcclxuXHJcbnZhciBzbGlkZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgLy9wcml2YXRlXHJcbiAgdmFyXHJcbiAgICBmbGFnID0gdHJ1ZSxcclxuICAgIHRpbWVyID0gMCxcclxuICAgIHRpbWVyRHVyYXRpb24gPSA0MDAwO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgLy8gY3JlYXRlIGRvdHNcclxuICAgICAgX3RoaXMuY3JlYXRlRG90cygpO1xyXG5cclxuICAgICAgLy8gdGVybiB1cCBzd2l0Y2hlclxyXG4gICAgICBfdGhpcy5hdXRvU3dpdGNoKCk7XHJcbiAgICAgICQoJy5zbGlkZXJfX2NvbnRyb2xzLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgc2xpZGVzID0gJHRoaXMuY2xvc2VzdCgnLnNsaWRlcicpLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKSxcclxuICAgICAgICAgIGFjdGl2ZVNsaWRlID0gc2xpZGVzLmZpbHRlcignLmFjdGl2ZScpLFxyXG4gICAgICAgICAgbmV4dFNsaWRlID0gYWN0aXZlU2xpZGUubmV4dCgpLFxyXG4gICAgICAgICAgcHJldlNsaWRlID0gYWN0aXZlU2xpZGUucHJldigpLFxyXG4gICAgICAgICAgZmlyc3RTbGlkZSA9c2xpZGVzLmZpcnN0KCksXHJcbiAgICAgICAgICBsYXN0U2xpZGUgPSBzbGlkZXMubGFzdCgpO1xyXG4gICAgICAgIF90aGlzLmNsZWFyVGltZXIoKTtcclxuICAgICAgICBpZiAoJHRoaXMuaGFzQ2xhc3MoJ3NsaWRlcl9fYXJyb3dzLW5leHQnKSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKG5leHRTbGlkZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZvcndhcmRcIik7XHJcbiAgICAgICAgICAgICAgX3RoaXMubW92ZVNsaWRlKG5leHRTbGlkZSwgJ2ZvcndhcmQnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgX3RoaXMubW92ZVNsaWRlKGZpcnN0U2xpZGUsICdmb3J3YXJkJyk7XHJcbiAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICBpZiAocHJldlNsaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIF90aGlzLm1vdmVTbGlkZShwcmV2U2xpZGUsICdiYWNrd2FyZCcpO1xyXG5cclxuICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIF90aGlzLm1vdmVTbGlkZShsYXN0U2xpZGUsICdiYWNrd2FyZCcpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAgIC8vIGNsaWNrIHRvIGRvdHNcclxuICAgICAgJCgnLnNsaWRlcl9fZG90cy1jdXJyZW50Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB2YXIgXHJcbiAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICBkb3RzID0gJHRoaXMuY2xvc2VzdCgnLnNsaWRlcl9fZG90cycpLmZpbmQoJy5zbGlkZXJfX2RvdHMtY3VycmVudCcpLFxyXG4gICAgICAgICAgYWN0aXZlRG90ID0gZG90cy5maWx0ZXIoJy5hY3RpdmUnKSxcclxuICAgICAgICAgIGRvdCA9ICR0aGlzLmNsb3Nlc3QoJy5zbGlkZXJfX2RvdHMtY3VycmVudCcpLFxyXG4gICAgICAgICAgY3VyRG90TnVtID1kb3QuaW5kZXgoKSxcclxuICAgICAgICAgIGRpcmVjdGlvbiA9IChhY3RpdmVEb3QuaW5kZXgoKSA8IGN1ckRvdE51bSkgPyAnZm9yd2FyZCcgOiAnYmFja3dhcmQnLFxyXG4gICAgICAgICAgcmVxU2xpZGUgPSAkdGhpcy5jbG9zZXN0KCcuc2xpZGVyJykuZmluZCgnLnNsaWRlcl9faXRlbScpLmVxKGN1ckRvdE51bSk7XHJcbiAgICAgICAgaWYgKCFkb3QuaGFzQ2xhc3MoJ2FjdGl2ZScpKXtcclxuICAgICAgICBfdGhpcy5jbGVhclRpbWVyKCk7XHJcbiAgICAgICAgX3RoaXMubW92ZVNsaWRlKHJlcVNsaWRlLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgbW92ZVNsaWRlOiBmdW5jdGlvbihzbGlkZSwgZGlyZWN0aW9uKXtcclxuICAgICAgdmFyXHJcbiAgICAgICAgX3RoaXMgPSB0aGlzLFxyXG4gICAgICAgIGNvbnRhaW5lciA9IHNsaWRlLmNsb3Nlc3QoJy5zbGlkZXInKSxcclxuICAgICAgICBzbGlkZXMgPSBjb250YWluZXIuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG4gICAgICAgIGFjdGl2ZVNsaWRlID0gc2xpZGVzLmZpbHRlcignLmFjdGl2ZScpLFxyXG4gICAgICAgIHNsaWRlV2lkdGggPSBzbGlkZXMud2lkdGgoKSxcclxuICAgICAgICBkdXJhdGlvbiA9IDUwMCxcclxuICAgICAgICByZXFDc3NQb3NpdGlvbiA9IDAsXHJcbiAgICAgICAgcmVxU2xpZGVTdHJhZmUgPSAwO1xyXG5cclxuICAgICAgaWYgKGZsYWcpIHtcclxuICAgICAgICBmbGFnID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2ZvcndhcmQnKSB7XHJcbiAgICAgICAgICAgIHJlcUNzc1Bvc2l0aW9uID0gc2xpZGVXaWR0aDtcclxuICAgICAgICAgICAgcmVxU2xpZGVTdHJhZmUgPSAtc2xpZGVXaWR0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2JhY2t3YXJkJykge1xyXG4gICAgICAgICAgICByZXFDc3NQb3NpdGlvbiA9IC1zbGlkZVdpZHRoO1xyXG4gICAgICAgICAgICByZXFTbGlkZVN0cmFmZSA9IHNsaWRlV2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNsaWRlLmNzcygnbGVmdCcsIHJlcUNzc1Bvc2l0aW9uKS5hZGRDbGFzcygnaW5zbGlkZScpO1xyXG5cclxuICAgICAgICB2YXIgbW92YWJsZVNsaWRlID0gc2xpZGVzLmZpbHRlcignLmluc2xpZGUnKTtcclxuICAgICAgICBhY3RpdmVTbGlkZS5hbmltYXRlKHtsZWZ0OiByZXFTbGlkZVN0cmFmZX0sIGR1cmF0aW9uKTtcclxuICAgICAgICBcclxuICAgICAgICBtb3ZhYmxlU2xpZGUuYW5pbWF0ZSh7bGVmdDogMH0sIGR1cmF0aW9uLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICBzbGlkZXMuY3NzKCdsZWZ0JywgJzAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgJHRoaXMudG9nZ2xlQ2xhc3MoJ2luc2xpZGUgYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgX3RoaXMuc2V0QWN0aXZlRG90KGNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19kb3RzJykpO1xyXG4gICAgICAgICAgZmxhZyA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjcmVhdGVEb3RzOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyXHJcbiAgICAgICAgX3RoaXMgPSB0aGlzLFxyXG4gICAgICAgIGNvbnRhaW5lciA9ICQoJy5zbGlkZXInKTtcclxuICAgICAgdmFyXHJcbiAgICAgICAgZG90TWFya3VwID0gJzxsaSBjbGFzcz1cInNsaWRlcl9fZG90cy1jdXJyZW50XCI+PGEgY2xhc3M9XCJzbGlkZXJfX2RvdHMtbGlua1wiIGhyZWY9XCIjXCI+PC9hPjwvbGk+JztcclxuXHJcbiAgICAgIGNvbnRhaW5lci5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICB2YXIgXHJcbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgc2xpZGVzID0gJHRoaXMuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG4gICAgICAgICAgICBkb3RDb250YWluZXIgPSAkdGhpcy5maW5kKCcuc2xpZGVyX19kb3RzJyk7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8c2xpZGVzLnNpemUoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgZG90Q29udGFpbmVyLmFwcGVuZChkb3RNYXJrdXApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgX3RoaXMuc2V0QWN0aXZlRG90KGRvdENvbnRhaW5lcilcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgc2V0QWN0aXZlRG90OiBmdW5jdGlvbihjb250YWluZXIpIHtcclxuICAgICAgdmFyXHJcbiAgICAgICAgc2xpZGVzID0gY29udGFpbmVyLmNsb3Nlc3QoJy5zbGlkZXNDb250YWluZXInKS5maW5kKCcuc2xpZGVyX19pdGVtJyk7XHJcbiAgICAgIGNvbnRhaW5lclxyXG4gICAgICAgIC5maW5kKCcuc2xpZGVyX19kb3RzLWN1cnJlbnQnKSAgICBcclxuICAgICAgICAuZXEoc2xpZGVzLmZpbHRlcignLmFjdGl2ZScpLmluZGV4KCkpXHJcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgIC5zaWJsaW5ncygpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0sXHJcbiAgICBhdXRvU3dpdGNoIDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgc2xpZGVzID0gJCgnLnNsaWRlcl9fbGlzdCAuc2xpZGVyX19pdGVtJyksXHJcbiAgICAgICAgICAgICAgYWN0aXZlU2xpZGUgPSBzbGlkZXMuZmlsdGVyKCcuYWN0aXZlJyksXHJcbiAgICAgICAgICAgICAgbmV4dFNsaWRlID0gYWN0aXZlU2xpZGUubmV4dCgpLFxyXG4gICAgICAgICAgICAgIGZpcnN0U2xpZGUgPSBzbGlkZXMuZmlyc3QoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXh0U2xpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmb3J3YXJkXCIpO1xyXG4gICAgICAgICAgICAgIF90aGlzLm1vdmVTbGlkZShuZXh0U2xpZGUsICdmb3J3YXJkJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIF90aGlzLm1vdmVTbGlkZShmaXJzdFNsaWRlLCAnZm9yd2FyZCcpO1xyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwgdGltZXJEdXJhdGlvbik7XHJcbiAgICB9LFxyXG4gICAgY2xlYXJUaW1lcjogZnVuY3Rpb24oKXtcclxuICAgICAgaWYgKHRpbWVyKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XHJcbiAgICAgICAgdGhpcy5hdXRvU3dpdGNoKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0oKSk7XHJcblxyXG4oZnVuY3Rpb24oalF1ZXJ5LCB1bmRlZmluZWQpIHtcclxuICAvLyBWQVJcclxuICB2YXIgZGVidWcgPSB0cnVlLFxyXG4gICAgICBcclxuICAgICAgb3B0aW9ucyA9IHtcclxuICAgICAgICBtb3VzZXBvcnQ6ICAgICAnYm9keScsICAvLyBqUXVlcnkgb2JqZWN0IG9yIHNlbGVjdG9yIG9mIERPTSBub2RlIHRvIHVzZSBhcyBtb3VzZXBvcnRcclxuICAgICAgICB4cGFyYWxsYXg6ICAgICB0cnVlLCAgICAvLyBib29sZWFuIHwgMC0xIHwgJ25weCcgfCAnbiUnXHJcbiAgICAgICAgeXBhcmFsbGF4OiAgICAgdHJ1ZSwgICAgLy9cclxuICAgICAgICB4b3JpZ2luOiAgICAgICAwLjUsICAgICAvLyAwLTEgLSBTZXRzIGRlZmF1bHQgYWxpZ25tZW50LiBPbmx5IGhhcyBlZmZlY3Qgd2hlbiBwYXJhbGxheCB2YWx1ZXMgYXJlIHNvbWV0aGluZyBvdGhlciB0aGFuIDEgKG9yIHRydWUsIG9yICcxMDAlJylcclxuICAgICAgICB5b3JpZ2luOiAgICAgICAwLjUsICAgICAvL1xyXG4gICAgICAgIGRlY2F5OiAgICAgICAgIDAuNTYsICAgIC8vIDAtMSAoMCBpbnN0YW50LCAxIGZvcmV2ZXIpIC0gU2V0cyByYXRlIG9mIGRlY2F5IGN1cnZlIGZvciBjYXRjaGluZyB1cCB3aXRoIHRhcmdldCBtb3VzZSBwb3NpdGlvblxyXG4gICAgICAgIGZyYW1lRHVyYXRpb246IDMwLCAgICAgIC8vIEludCAobWlsbGlzZWNvbmRzKVxyXG4gICAgICAgIGZyZWV6ZUNsYXNzOiAgICdmcmVlemUnIC8vIFN0cmluZyAtIENsYXNzIGFkZGVkIHRvIGxheWVyIHdoZW4gZnJvemVuXHJcbiAgICAgIH0sXHJcbiAgXHJcbiAgICAgIHZhbHVlID0ge1xyXG4gICAgICAgIGxlZnQ6IDEsXHJcbiAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgIG1pZGRsZTogMC41LFxyXG4gICAgICAgIGNlbnRlcjogMC41LFxyXG4gICAgICAgIHJpZ2h0OiAxLFxyXG4gICAgICAgIGJvdHRvbTogMVxyXG4gICAgICB9LFxyXG4gIFxyXG4gICAgICBycHggPSAvXlxcZCtcXHM/cHgkLyxcclxuICAgICAgcnBlcmNlbnQgPSAvXlxcZCtcXHM/JSQvLFxyXG4gICAgICBcclxuICAgICAgd2luID0galF1ZXJ5KHdpbmRvdyksXHJcbiAgICAgIGRvYyA9IGpRdWVyeShkb2N1bWVudCksXHJcbiAgICAgIG1vdXNlID0gWzAsIDBdO1xyXG4gIFxyXG4gIHZhciBUaW1lciA9IChmdW5jdGlvbigpe1xyXG4gICAgdmFyIGRlYnVnID0gZmFsc2U7XHJcbiAgICBcclxuICAgIC8vIFNoaW0gZm9yIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgZmFsbGluZyBiYWNrIHRvIHRpbWVyLiBTZWU6XHJcbiAgICAvLyBzZWUgaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cclxuICAgIHZhciByZXF1ZXN0RnJhbWUgPSAoZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICBmdW5jdGlvbihmbiwgbm9kZSl7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBmbigpO1xyXG4gICAgICAgICAgICAgIH0sIDI1KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KSgpO1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBUaW1lcigpIHtcclxuICAgICAgdmFyIGNhbGxiYWNrcyA9IFtdLFxyXG4gICAgICAgIG5leHRGcmFtZTtcclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIG5vb3AoKSB7fVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gZnJhbWUoKXtcclxuICAgICAgICB2YXIgY2JzID0gY2FsbGJhY2tzLnNsaWNlKDApLFxyXG4gICAgICAgICAgICBsID0gY2JzLmxlbmd0aCxcclxuICAgICAgICAgICAgaSA9IC0xO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChkZWJ1ZykgeyBjb25zb2xlLmxvZygndGltZXIgZnJhbWUoKScsIGwpOyB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgd2hpbGUoKytpIDwgbCkgeyBjYnNbaV0uY2FsbCh0aGlzKTsgfVxyXG4gICAgICAgIHJlcXVlc3RGcmFtZShuZXh0RnJhbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBzdGFydCgpIHtcclxuICAgICAgICBpZiAoZGVidWcpIHsgY29uc29sZS5sb2coJ3RpbWVyIHN0YXJ0KCknKTsgfVxyXG4gICAgICAgIHRoaXMuc3RhcnQgPSBub29wO1xyXG4gICAgICAgIHRoaXMuc3RvcCA9IHN0b3A7XHJcbiAgICAgICAgbmV4dEZyYW1lID0gZnJhbWU7XHJcbiAgICAgICAgcmVxdWVzdEZyYW1lKG5leHRGcmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHN0b3AoKSB7XHJcbiAgICAgICAgaWYgKGRlYnVnKSB7IGNvbnNvbGUubG9nKCd0aW1lciBzdG9wKCknKTsgfVxyXG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcclxuICAgICAgICB0aGlzLnN0b3AgPSBub29wO1xyXG4gICAgICAgIG5leHRGcmFtZSA9IG5vb3A7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHRoaXMuY2FsbGJhY2tzID0gY2FsbGJhY2tzO1xyXG4gICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XHJcbiAgICAgIHRoaXMuc3RvcCA9IHN0b3A7XHJcbiAgICB9XHJcblxyXG4gICAgVGltZXIucHJvdG90eXBlID0ge1xyXG4gICAgICBhZGQ6IGZ1bmN0aW9uKGZuKSB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuY2FsbGJhY2tzLFxyXG4gICAgICAgICAgICBsID0gY2FsbGJhY2tzLmxlbmd0aDtcclxuICAgICAgICBcclxuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhpcyBjYWxsYmFjayBpcyBhbHJlYWR5IGluIHRoZSBsaXN0LlxyXG4gICAgICAgIC8vIERvbid0IGFkZCBpdCB0d2ljZS5cclxuICAgICAgICB3aGlsZSAobC0tKSB7XHJcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzW2xdID09PSBmbikgeyByZXR1cm47IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChmbik7XHJcbiAgICAgICAgaWYgKGRlYnVnKSB7IGNvbnNvbGUubG9nKCd0aW1lciBhZGQoKScsIHRoaXMuY2FsbGJhY2tzLmxlbmd0aCk7IH1cclxuICAgICAgfSxcclxuICAgIFxyXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uKGZuKSB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuY2FsbGJhY2tzLFxyXG4gICAgICAgICAgICBsID0gY2FsbGJhY2tzLmxlbmd0aDtcclxuICAgICAgICBcclxuICAgICAgICAvLyBSZW1vdmUgYWxsIGluc3RhbmNlcyBvZiB0aGlzIGNhbGxiYWNrLlxyXG4gICAgICAgIHdoaWxlIChsLS0pIHtcclxuICAgICAgICAgIGlmIChjYWxsYmFja3NbbF0gPT09IGZuKSB7IGNhbGxiYWNrcy5zcGxpY2UobCwgMSk7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGRlYnVnKSB7IGNvbnNvbGUubG9nKCd0aW1lciByZW1vdmUoKScsIHRoaXMuY2FsbGJhY2tzLmxlbmd0aCk7IH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoY2FsbGJhY2tzLmxlbmd0aCA9PT0gMCkgeyB0aGlzLnN0b3AoKTsgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICByZXR1cm4gVGltZXI7XHJcbiAgfSkoKTtcclxuICBcclxuICBmdW5jdGlvbiBwYXJzZUNvb3JkKHgpIHtcclxuICAgIHJldHVybiAocnBlcmNlbnQuZXhlYyh4KSkgPyBwYXJzZUZsb2F0KHgpLzEwMCA6IHg7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIHBhcnNlQm9vbCh4KSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHggPT09IFwiYm9vbGVhblwiID8geCA6ICEhKCBwYXJzZUZsb2F0KHgpICkgO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBwb3J0RGF0YShwb3J0KSB7XHJcbiAgICB2YXIgZXZlbnRzID0ge1xyXG4gICAgICAgICAgJ21vdXNlZW50ZXIucGFyYWxsYXgnOiBtb3VzZWVudGVyLFxyXG4gICAgICAgICAgJ21vdXNlbGVhdmUucGFyYWxsYXgnOiBtb3VzZWxlYXZlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3aW5FdmVudHMgPSB7XHJcbiAgICAgICAgICAncmVzaXplLnBhcmFsbGF4JzogcmVzaXplXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgZWxlbTogcG9ydCxcclxuICAgICAgICAgIGV2ZW50czogZXZlbnRzLFxyXG4gICAgICAgICAgd2luRXZlbnRzOiB3aW5FdmVudHMsXHJcbiAgICAgICAgICB0aW1lcjogbmV3IFRpbWVyKClcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxheWVycywgc2l6ZSwgb2Zmc2V0O1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVQb2ludGVyKCkge1xyXG4gICAgICBkYXRhLnBvaW50ZXIgPSBnZXRQb2ludGVyKG1vdXNlLCBbdHJ1ZSwgdHJ1ZV0sIG9mZnNldCwgc2l6ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHJlc2l6ZSgpIHtcclxuICAgICAgc2l6ZSA9IGdldFNpemUocG9ydCk7XHJcbiAgICAgIG9mZnNldCA9IGdldE9mZnNldChwb3J0KTtcclxuICAgICAgZGF0YS50aHJlc2hvbGQgPSBnZXRUaHJlc2hvbGQoc2l6ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIG1vdXNlZW50ZXIoKSB7XHJcbiAgICAgIGRhdGEudGltZXIuYWRkKHVwZGF0ZVBvaW50ZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBtb3VzZWxlYXZlKGUpIHtcclxuICAgICAgZGF0YS50aW1lci5yZW1vdmUodXBkYXRlUG9pbnRlcik7XHJcbiAgICAgIGRhdGEucG9pbnRlciA9IGdldFBvaW50ZXIoW2UucGFnZVgsIGUucGFnZVldLCBbdHJ1ZSwgdHJ1ZV0sIG9mZnNldCwgc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luLm9uKHdpbkV2ZW50cyk7XHJcbiAgICBwb3J0Lm9uKGV2ZW50cyk7XHJcbiAgICBcclxuICAgIHJlc2l6ZSgpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gZ2V0RGF0YShlbGVtLCBuYW1lLCBmbikge1xyXG4gICAgdmFyIGRhdGEgPSBlbGVtLmRhdGEobmFtZSk7XHJcbiAgICBcclxuICAgIGlmICghZGF0YSkge1xyXG4gICAgICBkYXRhID0gZm4gPyBmbihlbGVtKSA6IHt9IDtcclxuICAgICAgZWxlbS5kYXRhKG5hbWUsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gZ2V0UG9pbnRlcihtb3VzZSwgcGFyYWxsYXgsIG9mZnNldCwgc2l6ZSl7XHJcbiAgICB2YXIgcG9pbnRlciA9IFtdLFxyXG4gICAgICAgIHggPSAyO1xyXG4gICAgXHJcbiAgICB3aGlsZSAoeC0tKSB7XHJcbiAgICAgIHBvaW50ZXJbeF0gPSAobW91c2VbeF0gLSBvZmZzZXRbeF0pIC8gc2l6ZVt4XSA7XHJcbiAgICAgIHBvaW50ZXJbeF0gPSBwb2ludGVyW3hdIDwgMCA/IDAgOiBwb2ludGVyW3hdID4gMSA/IDEgOiBwb2ludGVyW3hdIDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHBvaW50ZXI7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGdldFNpemUoZWxlbSkge1xyXG4gICAgcmV0dXJuIFtlbGVtLndpZHRoKCksIGVsZW0uaGVpZ2h0KCldO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBnZXRPZmZzZXQoZWxlbSkge1xyXG4gICAgdmFyIG9mZnNldCA9IGVsZW0ub2Zmc2V0KCkgfHwge2xlZnQ6IDAsIHRvcDogMH0sXHJcbiAgICAgIGJvcmRlckxlZnQgPSBlbGVtLmNzcygnYm9yZGVyTGVmdFN0eWxlJykgPT09ICdub25lJyA/IDAgOiBwYXJzZUludChlbGVtLmNzcygnYm9yZGVyTGVmdFdpZHRoJyksIDEwKSxcclxuICAgICAgYm9yZGVyVG9wID0gZWxlbS5jc3MoJ2JvcmRlclRvcFN0eWxlJykgPT09ICdub25lJyA/IDAgOiBwYXJzZUludChlbGVtLmNzcygnYm9yZGVyVG9wV2lkdGgnKSwgMTApLFxyXG4gICAgICBwYWRkaW5nTGVmdCA9IHBhcnNlSW50KGVsZW0uY3NzKCdwYWRkaW5nTGVmdCcpLCAxMCksXHJcbiAgICAgIHBhZGRpbmdUb3AgPSBwYXJzZUludChlbGVtLmNzcygncGFkZGluZ1RvcCcpLCAxMCk7XHJcbiAgICBcclxuICAgIHJldHVybiBbb2Zmc2V0LmxlZnQgKyBib3JkZXJMZWZ0ICsgcGFkZGluZ0xlZnQsIG9mZnNldC50b3AgKyBib3JkZXJUb3AgKyBwYWRkaW5nVG9wXTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gZ2V0VGhyZXNob2xkKHNpemUpIHtcclxuICAgIHJldHVybiBbMS9zaXplWzBdLCAxL3NpemVbMV1dO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBsYXllclNpemUoZWxlbSwgeCwgeSkge1xyXG4gICAgcmV0dXJuIFt4IHx8IGVsZW0ub3V0ZXJXaWR0aCgpLCB5IHx8IGVsZW0ub3V0ZXJIZWlnaHQoKV07XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGxheWVyT3JpZ2luKHhvLCB5bykge1xyXG4gICAgdmFyIG8gPSBbeG8sIHlvXSxcclxuICAgICAgaSA9IDIsXHJcbiAgICAgIG9yaWdpbiA9IFtdO1xyXG4gICAgXHJcbiAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgIG9yaWdpbltpXSA9IHR5cGVvZiBvW2ldID09PSAnc3RyaW5nJyA/XHJcbiAgICAgICAgb1tpXSA9PT0gdW5kZWZpbmVkID9cclxuICAgICAgICAgIDEgOlxyXG4gICAgICAgICAgdmFsdWVbb3JpZ2luW2ldXSB8fCBwYXJzZUNvb3JkKG9yaWdpbltpXSkgOlxyXG4gICAgICAgIG9baV0gO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gb3JpZ2luO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBsYXllclB4KHhwLCB5cCkge1xyXG4gICAgcmV0dXJuIFtycHgudGVzdCh4cCksIHJweC50ZXN0KHlwKV07XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGxheWVyUGFyYWxsYXgoeHAsIHlwLCBweCkge1xyXG4gICAgdmFyIHAgPSBbeHAsIHlwXSxcclxuICAgICAgICBpID0gMixcclxuICAgICAgICBwYXJhbGxheCA9IFtdO1xyXG4gICAgXHJcbiAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgIHBhcmFsbGF4W2ldID0gcHhbaV0gP1xyXG4gICAgICAgIHBhcnNlSW50KHBbaV0sIDEwKSA6XHJcbiAgICAgICAgcGFyYWxsYXhbaV0gPSBwW2ldID09PSB0cnVlID8gMSA6IHBhcnNlQ29vcmQocFtpXSkgO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gcGFyYWxsYXg7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGxheWVyT2Zmc2V0KHBhcmFsbGF4LCBweCwgb3JpZ2luLCBzaXplKSB7XHJcbiAgICB2YXIgaSA9IDIsXHJcbiAgICAgICAgb2Zmc2V0ID0gW107XHJcbiAgICBcclxuICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgb2Zmc2V0W2ldID0gcHhbaV0gP1xyXG4gICAgICAgIG9yaWdpbltpXSAqIChzaXplW2ldIC0gcGFyYWxsYXhbaV0pIDpcclxuICAgICAgICBwYXJhbGxheFtpXSA/IG9yaWdpbltpXSAqICggMSAtIHBhcmFsbGF4W2ldICkgOiAwIDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIG9mZnNldDtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gbGF5ZXJQb3NpdGlvbihweCwgb3JpZ2luKSB7XHJcbiAgICB2YXIgaSA9IDIsXHJcbiAgICAgICAgcG9zaXRpb24gPSBbXTtcclxuICAgIFxyXG4gICAgd2hpbGUgKGktLSkge1xyXG4gICAgICBpZiAocHhbaV0pIHtcclxuICAgICAgICAvLyBTZXQgY3NzIHBvc2l0aW9uIGNvbnN0YW50XHJcbiAgICAgICAgcG9zaXRpb25baV0gPSBvcmlnaW5baV0gKiAxMDAgKyAnJSc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgIFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBwb3NpdGlvbjtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gbGF5ZXJQb2ludGVyKGVsZW0sIHBhcmFsbGF4LCBweCwgb2Zmc2V0LCBzaXplKSB7XHJcbiAgICB2YXIgdmlld3BvcnQgPSBlbGVtLm9mZnNldFBhcmVudCgpLFxyXG4gICAgICBwb3MgPSBlbGVtLnBvc2l0aW9uKCksXHJcbiAgICAgIHBvc2l0aW9uID0gW10sXHJcbiAgICAgIHBvaW50ZXIgPSBbXSxcclxuICAgICAgaSA9IDI7XHJcbiAgICBcclxuICAgIC8vIFJldmVyc2UgY2FsY3VsYXRlIHJhdGlvIGZyb20gZWxlbSdzIGN1cnJlbnQgcG9zaXRpb25cclxuICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgcG9zaXRpb25baV0gPSBweFtpXSA/XHJcbiAgICAgICAgLy8gVE9ETzogcmV2ZXJzZSBjYWxjdWxhdGlvbiBmb3IgcGl4ZWwgY2FzZVxyXG4gICAgICAgIDAgOlxyXG4gICAgICAgIHBvc1tpID09PSAwID8gJ2xlZnQnIDogJ3RvcCddIC8gKHZpZXdwb3J0W2kgPT09IDAgPyAnb3V0ZXJXaWR0aCcgOiAnb3V0ZXJIZWlnaHQnXSgpIC0gc2l6ZVtpXSkgO1xyXG4gICAgICBcclxuICAgICAgcG9pbnRlcltpXSA9IChwb3NpdGlvbltpXSAtIG9mZnNldFtpXSkgLyBwYXJhbGxheFtpXSA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBwb2ludGVyO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBsYXllckNzcyhwYXJhbGxheCwgcHgsIG9mZnNldCwgc2l6ZSwgcG9zaXRpb24sIHBvaW50ZXIpIHtcclxuICAgIHZhciBwb3MgPSBbXSxcclxuICAgICAgICBjc3NQb3NpdGlvbixcclxuICAgICAgICBjc3NNYXJnaW4sXHJcbiAgICAgICAgeCA9IDIsXHJcbiAgICAgICAgY3NzID0ge307XHJcbiAgICBcclxuICAgIHdoaWxlICh4LS0pIHtcclxuICAgICAgaWYgKHBhcmFsbGF4W3hdKSB7XHJcbiAgICAgICAgcG9zW3hdID0gcGFyYWxsYXhbeF0gKiBwb2ludGVyW3hdICsgb2Zmc2V0W3hdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFdlJ3JlIHdvcmtpbmcgaW4gcGl4ZWxzXHJcbiAgICAgICAgaWYgKHB4W3hdKSB7XHJcbiAgICAgICAgICBjc3NQb3NpdGlvbiA9IHBvc2l0aW9uW3hdO1xyXG4gICAgICAgICAgY3NzTWFyZ2luID0gcG9zW3hdICogLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFdlJ3JlIHdvcmtpbmcgYnkgcmF0aW9cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGNzc1Bvc2l0aW9uID0gcG9zW3hdICogMTAwICsgJyUnO1xyXG4gICAgICAgICAgY3NzTWFyZ2luID0gcG9zW3hdICogc2l6ZVt4XSAqIC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBGaWxsIGluIGNzcyBvYmplY3RcclxuICAgICAgICBpZiAoeCA9PT0gMCkge1xyXG4gICAgICAgICAgY3NzLmxlZnQgPSBjc3NQb3NpdGlvbjtcclxuICAgICAgICAgIGNzcy5tYXJnaW5MZWZ0ID0gY3NzTWFyZ2luO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGNzcy50b3AgPSBjc3NQb3NpdGlvbjtcclxuICAgICAgICAgIGNzcy5tYXJnaW5Ub3AgPSBjc3NNYXJnaW47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBjc3M7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIHBvaW50ZXJPZmZUYXJnZXQodGFyZ2V0UG9pbnRlciwgcHJldlBvaW50ZXIsIHRocmVzaG9sZCwgZGVjYXksIHBhcmFsbGF4LCB0YXJnZXRGbiwgdXBkYXRlRm4pIHtcclxuICAgIHZhciBwb2ludGVyLCB4O1xyXG4gICAgXHJcbiAgICBpZiAoKCFwYXJhbGxheFswXSB8fCBNYXRoLmFicyh0YXJnZXRQb2ludGVyWzBdIC0gcHJldlBvaW50ZXJbMF0pIDwgdGhyZXNob2xkWzBdKSAmJlxyXG4gICAgICAgICghcGFyYWxsYXhbMV0gfHwgTWF0aC5hYnModGFyZ2V0UG9pbnRlclsxXSAtIHByZXZQb2ludGVyWzFdKSA8IHRocmVzaG9sZFsxXSkpIHtcclxuICAgICAgICAvLyBQb2ludGVyIGhhcyBoaXQgdGhlIHRhcmdldFxyXG4gICAgICAgIGlmICh0YXJnZXRGbikgeyB0YXJnZXRGbigpOyB9XHJcbiAgICAgICAgcmV0dXJuIHVwZGF0ZUZuKHRhcmdldFBvaW50ZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBQb2ludGVyIGlzIG5vd2hlcmUgbmVhciB0aGUgdGFyZ2V0XHJcbiAgICBwb2ludGVyID0gW107XHJcbiAgICB4ID0gMjtcclxuICAgIFxyXG4gICAgd2hpbGUgKHgtLSkge1xyXG4gICAgICBpZiAocGFyYWxsYXhbeF0pIHtcclxuICAgICAgICBwb2ludGVyW3hdID0gdGFyZ2V0UG9pbnRlclt4XSArIGRlY2F5ICogKHByZXZQb2ludGVyW3hdIC0gdGFyZ2V0UG9pbnRlclt4XSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgICAgXHJcbiAgICByZXR1cm4gdXBkYXRlRm4ocG9pbnRlcik7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIHBvaW50ZXJPblRhcmdldCh0YXJnZXRQb2ludGVyLCBwcmV2UG9pbnRlciwgdGhyZXNob2xkLCBkZWNheSwgcGFyYWxsYXgsIHRhcmdldEZuLCB1cGRhdGVGbikge1xyXG4gICAgLy8gRG9uJ3QgYm90aGVyIHVwZGF0aW5nIGlmIHRoZSBwb2ludGVyIGhhc24ndCBjaGFuZ2VkLlxyXG4gICAgaWYgKHRhcmdldFBvaW50ZXJbMF0gPT09IHByZXZQb2ludGVyWzBdICYmIHRhcmdldFBvaW50ZXJbMV0gPT09IHByZXZQb2ludGVyWzFdKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHVwZGF0ZUZuKHRhcmdldFBvaW50ZXIpO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiB1bnBvcnQoZWxlbSwgZXZlbnRzLCB3aW5FdmVudHMpIHtcclxuICAgIGVsZW0ub2ZmKGV2ZW50cykucmVtb3ZlRGF0YSgncGFyYWxsYXhfcG9ydCcpO1xyXG4gICAgd2luLm9mZih3aW5FdmVudHMpO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiB1bnBhcmFsbGF4KG5vZGUsIHBvcnQsIGV2ZW50cykge1xyXG4gICAgcG9ydC5lbGVtLm9mZihldmVudHMpO1xyXG4gICAgXHJcbiAgICAvLyBSZW1vdmUgdGhpcyBub2RlIGZyb20gbGF5ZXJzXHJcbiAgICBwb3J0LmxheWVycyA9IHBvcnQubGF5ZXJzLm5vdChub2RlKTtcclxuICAgIFxyXG4gICAgLy8gSWYgcG9ydC5sYXllcnMgaXMgZW1wdHksIGRlc3Ryb3kgdGhlIHBvcnRcclxuICAgIGlmIChwb3J0LmxheWVycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgdW5wb3J0KHBvcnQuZWxlbSwgcG9ydC5ldmVudHMsIHBvcnQud2luRXZlbnRzKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gdW5zdHlsZShwYXJhbGxheCkge1xyXG4gICAgdmFyIGNzcyA9IHt9O1xyXG4gICAgXHJcbiAgICBpZiAocGFyYWxsYXhbMF0pIHtcclxuICAgICAgY3NzLmxlZnQgPSAnJztcclxuICAgICAgY3NzLm1hcmdpbkxlZnQgPSAnJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHBhcmFsbGF4WzFdKSB7XHJcbiAgICAgIGNzcy50b3AgPSAnJztcclxuICAgICAgY3NzLm1hcmdpblRvcCA9ICcnO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBlbGVtLmNzcyhjc3MpO1xyXG4gIH1cclxuICBcclxuICBqUXVlcnkuZm4ucGFyYWxsYXggPSBmdW5jdGlvbihvKXtcclxuICAgIHZhciBvcHRpb25zID0galF1ZXJ5LmV4dGVuZCh7fSwgalF1ZXJ5LmZuLnBhcmFsbGF4Lm9wdGlvbnMsIG8pLFxyXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHMsXHJcbiAgICAgICAgZWxlbSA9IG9wdGlvbnMubW91c2Vwb3J0IGluc3RhbmNlb2YgalF1ZXJ5ID9cclxuICAgICAgICAgIG9wdGlvbnMubW91c2Vwb3J0IDpcclxuICAgICAgICAgIGpRdWVyeShvcHRpb25zLm1vdXNlcG9ydCkgLFxyXG4gICAgICAgIHBvcnQgPSBnZXREYXRhKGVsZW0sICdwYXJhbGxheF9wb3J0JywgcG9ydERhdGEpLFxyXG4gICAgICAgIHRpbWVyID0gcG9ydC50aW1lcjtcclxuICAgIFxyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICAgIHZhciBub2RlICAgICAgPSB0aGlzLFxyXG4gICAgICAgICAgZWxlbSAgICAgID0galF1ZXJ5KHRoaXMpLFxyXG4gICAgICAgICAgb3B0cyAgICAgID0gYXJnc1tpICsgMV0gPyBqUXVlcnkuZXh0ZW5kKHt9LCBvcHRpb25zLCBhcmdzW2kgKyAxXSkgOiBvcHRpb25zLFxyXG4gICAgICAgICAgZGVjYXkgICAgID0gb3B0cy5kZWNheSxcclxuICAgICAgICAgIHNpemUgICAgICA9IGxheWVyU2l6ZShlbGVtLCBvcHRzLndpZHRoLCBvcHRzLmhlaWdodCksXHJcbiAgICAgICAgICBvcmlnaW4gICAgPSBsYXllck9yaWdpbihvcHRzLnhvcmlnaW4sIG9wdHMueW9yaWdpbiksXHJcbiAgICAgICAgICBweCAgICAgICAgPSBsYXllclB4KG9wdHMueHBhcmFsbGF4LCBvcHRzLnlwYXJhbGxheCksXHJcbiAgICAgICAgICBwYXJhbGxheCAgPSBsYXllclBhcmFsbGF4KG9wdHMueHBhcmFsbGF4LCBvcHRzLnlwYXJhbGxheCwgcHgpLFxyXG4gICAgICAgICAgb2Zmc2V0ICAgID0gbGF5ZXJPZmZzZXQocGFyYWxsYXgsIHB4LCBvcmlnaW4sIHNpemUpLFxyXG4gICAgICAgICAgcG9zaXRpb24gID0gbGF5ZXJQb3NpdGlvbihweCwgb3JpZ2luKSxcclxuICAgICAgICAgIHBvaW50ZXIgICA9IGxheWVyUG9pbnRlcihlbGVtLCBwYXJhbGxheCwgcHgsIG9mZnNldCwgc2l6ZSksXHJcbiAgICAgICAgICBwb2ludGVyRm4gPSBwb2ludGVyT2ZmVGFyZ2V0LFxyXG4gICAgICAgICAgdGFyZ2V0Rm4gID0gdGFyZ2V0SW5zaWRlLFxyXG4gICAgICAgICAgZXZlbnRzID0ge1xyXG4gICAgICAgICAgICAnbW91c2VlbnRlci5wYXJhbGxheCc6IGZ1bmN0aW9uIG1vdXNlZW50ZXIoZSkge1xyXG4gICAgICAgICAgICAgIHBvaW50ZXJGbiA9IHBvaW50ZXJPZmZUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgdGFyZ2V0Rm4gPSB0YXJnZXRJbnNpZGU7XHJcbiAgICAgICAgICAgICAgdGltZXIuYWRkKGZyYW1lKTtcclxuICAgICAgICAgICAgICB0aW1lci5zdGFydCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnbW91c2VsZWF2ZS5wYXJhbGxheCc6IGZ1bmN0aW9uIG1vdXNlbGVhdmUoZSkge1xyXG4gICAgICAgICAgICAgIC8vIE1ha2UgdGhlIGxheWVyIGNvbWUgdG8gcmVzdCBhdCBpdCdzIGxpbWl0IHdpdGggaW5lcnRpYVxyXG4gICAgICAgICAgICAgIHBvaW50ZXJGbiA9IHBvaW50ZXJPZmZUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgLy8gU3RvcCB0aGUgdGltZXIgd2hlbiB0aGUgdGhlIHBvaW50ZXIgaGl0cyB0YXJnZXRcclxuICAgICAgICAgICAgICB0YXJnZXRGbiA9IHRhcmdldE91dHNpZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiB1cGRhdGVDc3MobmV3UG9pbnRlcikge1xyXG4gICAgICAgIHZhciBjc3MgPSBsYXllckNzcyhwYXJhbGxheCwgcHgsIG9mZnNldCwgc2l6ZSwgcG9zaXRpb24sIG5ld1BvaW50ZXIpO1xyXG4gICAgICAgIGVsZW0uY3NzKGNzcyk7XHJcbiAgICAgICAgcG9pbnRlciA9IG5ld1BvaW50ZXI7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIGZyYW1lKCkge1xyXG4gICAgICAgIHBvaW50ZXJGbihwb3J0LnBvaW50ZXIsIHBvaW50ZXIsIHBvcnQudGhyZXNob2xkLCBkZWNheSwgcGFyYWxsYXgsIHRhcmdldEZuLCB1cGRhdGVDc3MpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiB0YXJnZXRJbnNpZGUoKSB7XHJcbiAgICAgICAgLy8gUG9pbnRlciBoaXRzIHRoZSB0YXJnZXQgcG9pbnRlciBpbnNpZGUgdGhlIHBvcnRcclxuICAgICAgICBwb2ludGVyRm4gPSBwb2ludGVyT25UYXJnZXQ7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHRhcmdldE91dHNpZGUoKSB7XHJcbiAgICAgICAgLy8gUG9pbnRlciBoaXRzIHRoZSB0YXJnZXQgcG9pbnRlciBvdXRzaWRlIHRoZSBwb3J0XHJcbiAgICAgICAgdGltZXIucmVtb3ZlKGZyYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChqUXVlcnkuZGF0YShub2RlLCAncGFyYWxsYXgnKSkge1xyXG4gICAgICAgIGVsZW0udW5wYXJhbGxheCgpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBqUXVlcnkuZGF0YShub2RlLCAncGFyYWxsYXgnLCB7XHJcbiAgICAgICAgcG9ydDogcG9ydCxcclxuICAgICAgICBldmVudHM6IGV2ZW50cyxcclxuICAgICAgICBwYXJhbGxheDogcGFyYWxsYXhcclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBwb3J0LmVsZW0ub24oZXZlbnRzKTtcclxuICAgICAgcG9ydC5sYXllcnMgPSBwb3J0LmxheWVycz8gcG9ydC5sYXllcnMuYWRkKG5vZGUpOiBqUXVlcnkobm9kZSk7XHJcbiAgICAgIFxyXG4gICAgICAvKmZ1bmN0aW9uIGZyZWV6ZSgpIHtcclxuICAgICAgICBmcmVlemUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiB1bmZyZWV6ZSgpIHtcclxuICAgICAgICBmcmVlemUgPSBmYWxzZTtcclxuICAgICAgfSovXHJcbiAgICAgIFxyXG4gICAgICAvKmpRdWVyeS5ldmVudC5hZGQodGhpcywgJ2ZyZWV6ZS5wYXJhbGxheCcsIGZyZWV6ZSk7XHJcbiAgICAgIGpRdWVyeS5ldmVudC5hZGQodGhpcywgJ3VuZnJlZXplLnBhcmFsbGF4JywgdW5mcmVlemUpOyovXHJcbiAgICB9KTtcclxuICB9O1xyXG4gIFxyXG4gIGpRdWVyeS5mbi51bnBhcmFsbGF4ID0gZnVuY3Rpb24oYm9vbCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGRhdGEgPSBqUXVlcnkuZGF0YSh0aGlzLCAncGFyYWxsYXgnKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFRoaXMgZWxlbSBpcyBub3QgcGFyYWxsYXhlZFxyXG4gICAgICBpZiAoIWRhdGEpIHsgcmV0dXJuOyB9XHJcbiAgICAgIFxyXG4gICAgICBqUXVlcnkucmVtb3ZlRGF0YSh0aGlzLCAncGFyYWxsYXgnKTtcclxuICAgICAgdW5wYXJhbGxheCh0aGlzLCBkYXRhLnBvcnQsIGRhdGEuZXZlbnRzKTtcclxuICAgICAgaWYgKGJvb2wpIHsgdW5zdHlsZShkYXRhLnBhcmFsbGF4KTsgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuICBcclxuICBqUXVlcnkuZm4ucGFyYWxsYXgub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgXHJcbiAgLy8gUGljayB1cCBhbmQgc3RvcmUgbW91c2UgcG9zaXRpb24gb24gZG9jdW1lbnQ6IElFIGRvZXMgbm90IHJlZ2lzdGVyXHJcbiAgLy8gbW91c2Vtb3ZlIG9uIHdpbmRvdy5cclxuICBkb2Mub24oJ21vdXNlbW92ZS5wYXJhbGxheCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgbW91c2UgPSBbZS5wYWdlWCwgZS5wYWdlWV07XHJcbiAgfSk7XHJcbn0oalF1ZXJ5KSk7XHJcblxyXG52YXIgc2Nyb2xsUGFnZSA9IChmdW5jdGlvbigpIHtcclxuICByZXR1cm4ge1xyXG4gICAgc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNsaWRlcl9fYXJyb3dzID0gJCgnLnNsaWRlcl9fY29udHJvbHMtYnV0dG9uJyk7XHJcbiAgICAgICAgJChcImFbaHJlZio9I11cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgIGlmIChzbGlkZXJfX2Fycm93cyA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoYW5jaG9yLmF0dHIoJ2hyZWYnKSkub2Zmc2V0KCkudG9wXHJcbiAgICAgICAgICAgICAgIH0sIDc3Nyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn0oKSk7XHJcblxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAkKCcuZmxpcCcpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAkKCcuY29udC1mbGlwJykudG9nZ2xlQ2xhc3MoJ2ZsaXBwZWQnKTtcclxuICAgICQoJy5idXR0b25fX3dyYXAnKS50b2dnbGVDbGFzcygnYnV0dG9uX193cmFwX2hpZGRlbicpXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSk7XHJcblxyXG4gIGpRdWVyeSgnLnBhcmFsbGF4LWxheWVyJykucGFyYWxsYXgoe1xyXG4gICAgICAgIG1vdXNlcG9ydDogalF1ZXJ5KFwiI3BhcmFsbGF4XCIpXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoJCgnLnNsaWRlcicpLmxlbmd0aCkge1xyXG4gICAgICBzbGlkZXIuaW5pdCgpOyAgIFxyXG4gICAgfVxyXG4gICAgaWYgKCQoJyNzZWN0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgIHNjcm9sbFBhZ2Uuc2V0KCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgJCgnI3RvZ2dsZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICQoJyNvdmVybGF5JykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3N0b3Atc2Nyb2xsaW5nJyk7XHJcbiAgICAvLyAkKCdib2R5JykuYmluZCgndG91Y2htb3ZlJywgZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpfSlcclxuICAgIC8vICQoJ2JvZHknKS51bmJpbmQoJ3RvdWNobW92ZScpXHJcbiAgICB9KTtcclxuICBpZiAoJCgnI21hcCcpLmxlbmd0aCkge1xyXG4gICAgICB5bWFwcy5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8g0JIg0YTRg9C90LrRhtC40Y4g0L/QvtGB0YLRg9C/0LDQtdGCINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQviDQuNC80LXQvSwg0LrQvtGC0L7RgNC+0LUg0YHQvtC00LXRgNC20LjRgiDQstGB0LUg0LfQsNC/0YDQvtGJ0LXQvdC90YvQtSDQv9GA0Lgg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0LzQvtC00YPQu9C4LiBcclxuICAgICAgICAgIHZhciBteU1hcCA9IG5ldyB5bWFwcy5NYXAoJ21hcCcsIHtcclxuICAgICAgICAgICAgICAgIGNlbnRlcjogWzUwLjQ1MTExMDIyLCAzMC40NTA2MjU0Ml0sXHJcbiAgICAgICAgICAgICAgICB6b29tOiAxMixcclxuICAgICAgICAgICAgICAgIC8vINCSINC00LDQvdC90L7QvCDQv9GA0LjQvNC10YDQtSDQutCw0YDRgtCwINGB0L7Qt9C00LDQtdGC0YHRjyDQsdC10Lcg0LrQvtC90YLRgNC+0LvQvtCyLCDRgtCw0Log0LrQsNC6INGC0LUg0L3QtSDQsdGL0LvQuCDQt9Cw0LPRgNGD0LbQtdC90Ysg0L/RgNC4INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4IEFQSS5cclxuICAgICAgICAgICAgICAgIGNvbnRyb2xzOiBbXVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgcGxhY2VtYXJrID0gbmV3IHltYXBzLlBsYWNlbWFyayhcclxuICAgICAgICAgICAgICAgIG15TWFwLmdldENlbnRlcigpLCB7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICBteU1hcC5iZWhhdmlvcnMuZGlzYWJsZSgnc2Nyb2xsWm9vbScpO1xyXG4gICAgICAgIC8vIG15TWFwLmdlb09iamVjdHMuYWRkKHBsYWNlbWFyayk7ICBcclxuICAgICAgfSk7IFxyXG4gIH1cclxuICBpZiAoJCgnLmZlYWRiYWNrJykubGVuZ3RoKSB7XHJcbiAgICBibHVyLnNldCgpO1xyXG4gIH1cclxuICBpZiAoJCgnLmJsb2dfX2xpc3QnKS5sZW5ndGgpIHtcclxuICAgIGJsb2dNZW51LnNldCgpO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuJChkb2N1bWVudCkucmVzaXplKGZ1bmN0aW9uKCl7XHJcbiAgaWYgKCQoJy5mZWFkYmFjaycpLmxlbmd0aCkge1xyXG4gICAgYmx1ci5zZXQoKTtcclxuICB9XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
