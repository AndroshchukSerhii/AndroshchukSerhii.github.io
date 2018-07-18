function openTab(evt, Name) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("course__tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(Name).style.display = "flex";
    evt.currentTarget.className += " active";
}
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

var blogMenu = (function() {
  var 
    linkNav = document.querySelectorAll('[href^="#nav"]'),
    V = 0.5, // скорость скрола при нажатии на меню
    activeHeight =  50; // высота от верха экрана при которой срабатывает переключение
  // var 
    // stickySidebar = $('.header-wrap').offset().top + 300;
    
    var navFixed = $(".header-wrap"),
        navHeight = $('.header-wrap').height();

  return {
    set: function(){  
        var nav = $('.header-wrap');
    
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            nav.addClass("header-wrap-fix");
        } else {
            nav.removeClass("header-wrap-fix");
        }
    });
      window.addEventListener('scroll', function(e) {
        var 
          nav = document.querySelectorAll('[id^="nav"]');

        // for (var i = 0; i < nav.length; i++) { 
        //   // document.querySelector('a[href="#' + nav[i].id + '"]').className=((1 >= nav[i].getBoundingClientRect().top-activeHeight && nav[i].getBoundingClientRect().top >= activeHeight-nav[i].offsetHeight) ? 'blog__list-item_active' : '');
        // }
      }, false);
    }
  }
}());

$(document).ready(function(){
    if ($('#section').length) {
      scrollPage.set();
    }
    if ($('.header-wrap').length) {
    blogMenu.set();
    }
    $('.slider-one').owlCarousel({
    loop:true,
    margin:30,
    nav:true,
    center: false,
    stagePadding: 0,
    dots: false,
    // autoWidthClass: 'thems__auto',
    autoplay: false,
    navText: ["<img src=\"assets/img/arrow2.png\"</img>","<img src=\"assets/img/arrow2.png\"</img>"],
    autoplayHoverPause: true,
    responsive:{
        0:{
            items:1
        },
        480:{
            items:2
        },
        770:{
            items:3
        },
        1770:{
            items:5
        }
    }
})
$('.slider-two').owlCarousel({
    loop:true,
    margin:30,
    nav:true,
    smartSpeed:2000,
    center: false,
    stagePadding: 0,
    dots: true,
    autoplay: true,
    autoplayTimeout:4000,
    startPosition: 2,
    navText: ["&#10096;","&#10097;"],
    autoplayHoverPause: true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
})
$('.slider-three').owlCarousel({
    loop:true,
    margin:30,
    nav:true,
    smartSpeed:500,
    center: false,
    stagePadding: 0,
    dots: false,
    autoplay: true,
    autoplayTimeout:6000,
    startPosition: 2,
    navText: ["&#10096;","&#10097;"],
    autoplayHoverPause: true,
    responsive:{
        0:{
            items:2
        },
        600:{
            items:4
        },
        900:{
            items:5
        },
        1239:{
            items:6
        }
    }
})
$(window).scroll(function (){
    $(' .mov').each(function (){
            var imagePos = $(this).offset().top;
            var topOfWindow = $(window).scrollTop();
            if (imagePos < topOfWindow+350) {
                $(this).addClass($(this).data('animation'));
                // alert("lox")
            }
        });
    });﻿
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBvcGVuVGFiKGV2dCwgTmFtZSkge1xyXG4gICAgLy8gRGVjbGFyZSBhbGwgdmFyaWFibGVzXHJcbiAgICB2YXIgaSwgdGFiY29udGVudCwgdGFibGlua3M7XHJcblxyXG4gICAgLy8gR2V0IGFsbCBlbGVtZW50cyB3aXRoIGNsYXNzPVwidGFiY29udGVudFwiIGFuZCBoaWRlIHRoZW1cclxuICAgIHRhYmNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY291cnNlX190YWJjb250ZW50XCIpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHRhYmNvbnRlbnQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0YWJjb250ZW50W2ldLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXQgYWxsIGVsZW1lbnRzIHdpdGggY2xhc3M9XCJ0YWJsaW5rc1wiIGFuZCByZW1vdmUgdGhlIGNsYXNzIFwiYWN0aXZlXCJcclxuICAgIHRhYmxpbmtzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRhYmxpbmtzXCIpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHRhYmxpbmtzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGFibGlua3NbaV0uY2xhc3NOYW1lID0gdGFibGlua3NbaV0uY2xhc3NOYW1lLnJlcGxhY2UoXCIgYWN0aXZlXCIsIFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNob3cgdGhlIGN1cnJlbnQgdGFiLCBhbmQgYWRkIGFuIFwiYWN0aXZlXCIgY2xhc3MgdG8gdGhlIGJ1dHRvbiB0aGF0IG9wZW5lZCB0aGUgdGFiXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChOYW1lKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc05hbWUgKz0gXCIgYWN0aXZlXCI7XHJcbn1cclxudmFyIHNjcm9sbFBhZ2UgPSAoZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHNldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICQoXCJhW2hyZWYqPSNdXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICB2YXIgYW5jaG9yID0gJCh0aGlzKTtcclxuICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKGFuY2hvci5hdHRyKCdocmVmJykpLm9mZnNldCgpLnRvcFxyXG4gICAgICAgICAgfSwgNzc3KTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59KCkpO1xyXG5cclxudmFyIGJsb2dNZW51ID0gKGZ1bmN0aW9uKCkge1xyXG4gIHZhciBcclxuICAgIGxpbmtOYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbaHJlZl49XCIjbmF2XCJdJyksXHJcbiAgICBWID0gMC41LCAvLyDRgdC60L7RgNC+0YHRgtGMINGB0LrRgNC+0LvQsCDQv9GA0Lgg0L3QsNC20LDRgtC40Lgg0L3QsCDQvNC10L3RjlxyXG4gICAgYWN0aXZlSGVpZ2h0ID0gIDUwOyAvLyDQstGL0YHQvtGC0LAg0L7RgiDQstC10YDRhdCwINGN0LrRgNCw0L3QsCDQv9GA0Lgg0LrQvtGC0L7RgNC+0Lkg0YHRgNCw0LHQsNGC0YvQstCw0LXRgiDQv9C10YDQtdC60LvRjtGH0LXQvdC40LVcclxuICAvLyB2YXIgXHJcbiAgICAvLyBzdGlja3lTaWRlYmFyID0gJCgnLmhlYWRlci13cmFwJykub2Zmc2V0KCkudG9wICsgMzAwO1xyXG4gICAgXHJcbiAgICB2YXIgbmF2Rml4ZWQgPSAkKFwiLmhlYWRlci13cmFwXCIpLFxyXG4gICAgICAgIG5hdkhlaWdodCA9ICQoJy5oZWFkZXItd3JhcCcpLmhlaWdodCgpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2V0OiBmdW5jdGlvbigpeyAgXHJcbiAgICAgICAgdmFyIG5hdiA9ICQoJy5oZWFkZXItd3JhcCcpO1xyXG4gICAgXHJcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IDApIHtcclxuICAgICAgICAgICAgbmF2LmFkZENsYXNzKFwiaGVhZGVyLXdyYXAtZml4XCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5hdi5yZW1vdmVDbGFzcyhcImhlYWRlci13cmFwLWZpeFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgXHJcbiAgICAgICAgICBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbaWRePVwibmF2XCJdJyk7XHJcblxyXG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2Lmxlbmd0aDsgaSsrKSB7IFxyXG4gICAgICAgIC8vICAgLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYVtocmVmPVwiIycgKyBuYXZbaV0uaWQgKyAnXCJdJykuY2xhc3NOYW1lPSgoMSA+PSBuYXZbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wLWFjdGl2ZUhlaWdodCAmJiBuYXZbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wID49IGFjdGl2ZUhlaWdodC1uYXZbaV0ub2Zmc2V0SGVpZ2h0KSA/ICdibG9nX19saXN0LWl0ZW1fYWN0aXZlJyA6ICcnKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcbn0oKSk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgaWYgKCQoJyNzZWN0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgIHNjcm9sbFBhZ2Uuc2V0KCk7XHJcbiAgICB9XHJcbiAgICBpZiAoJCgnLmhlYWRlci13cmFwJykubGVuZ3RoKSB7XHJcbiAgICBibG9nTWVudS5zZXQoKTtcclxuICAgIH1cclxuICAgICQoJy5zbGlkZXItb25lJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgbG9vcDp0cnVlLFxyXG4gICAgbWFyZ2luOjMwLFxyXG4gICAgbmF2OnRydWUsXHJcbiAgICBjZW50ZXI6IGZhbHNlLFxyXG4gICAgc3RhZ2VQYWRkaW5nOiAwLFxyXG4gICAgZG90czogZmFsc2UsXHJcbiAgICAvLyBhdXRvV2lkdGhDbGFzczogJ3RoZW1zX19hdXRvJyxcclxuICAgIGF1dG9wbGF5OiBmYWxzZSxcclxuICAgIG5hdlRleHQ6IFtcIjxpbWcgc3JjPVxcXCJhc3NldHMvaW1nL2Fycm93Mi5wbmdcXFwiPC9pbWc+XCIsXCI8aW1nIHNyYz1cXFwiYXNzZXRzL2ltZy9hcnJvdzIucG5nXFxcIjwvaW1nPlwiXSxcclxuICAgIGF1dG9wbGF5SG92ZXJQYXVzZTogdHJ1ZSxcclxuICAgIHJlc3BvbnNpdmU6e1xyXG4gICAgICAgIDA6e1xyXG4gICAgICAgICAgICBpdGVtczoxXHJcbiAgICAgICAgfSxcclxuICAgICAgICA0ODA6e1xyXG4gICAgICAgICAgICBpdGVtczoyXHJcbiAgICAgICAgfSxcclxuICAgICAgICA3NzA6e1xyXG4gICAgICAgICAgICBpdGVtczozXHJcbiAgICAgICAgfSxcclxuICAgICAgICAxNzcwOntcclxuICAgICAgICAgICAgaXRlbXM6NVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSlcclxuJCgnLnNsaWRlci10d28nKS5vd2xDYXJvdXNlbCh7XHJcbiAgICBsb29wOnRydWUsXHJcbiAgICBtYXJnaW46MzAsXHJcbiAgICBuYXY6dHJ1ZSxcclxuICAgIHNtYXJ0U3BlZWQ6MjAwMCxcclxuICAgIGNlbnRlcjogZmFsc2UsXHJcbiAgICBzdGFnZVBhZGRpbmc6IDAsXHJcbiAgICBkb3RzOiB0cnVlLFxyXG4gICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICBhdXRvcGxheVRpbWVvdXQ6NDAwMCxcclxuICAgIHN0YXJ0UG9zaXRpb246IDIsXHJcbiAgICBuYXZUZXh0OiBbXCImIzEwMDk2O1wiLFwiJiMxMDA5NztcIl0sXHJcbiAgICBhdXRvcGxheUhvdmVyUGF1c2U6IHRydWUsXHJcbiAgICByZXNwb25zaXZlOntcclxuICAgICAgICAwOntcclxuICAgICAgICAgICAgaXRlbXM6MVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgNjAwOntcclxuICAgICAgICAgICAgaXRlbXM6MVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgMTAwMDp7XHJcbiAgICAgICAgICAgIGl0ZW1zOjFcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pXHJcbiQoJy5zbGlkZXItdGhyZWUnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICBsb29wOnRydWUsXHJcbiAgICBtYXJnaW46MzAsXHJcbiAgICBuYXY6dHJ1ZSxcclxuICAgIHNtYXJ0U3BlZWQ6NTAwLFxyXG4gICAgY2VudGVyOiBmYWxzZSxcclxuICAgIHN0YWdlUGFkZGluZzogMCxcclxuICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICBhdXRvcGxheVRpbWVvdXQ6NjAwMCxcclxuICAgIHN0YXJ0UG9zaXRpb246IDIsXHJcbiAgICBuYXZUZXh0OiBbXCImIzEwMDk2O1wiLFwiJiMxMDA5NztcIl0sXHJcbiAgICBhdXRvcGxheUhvdmVyUGF1c2U6IHRydWUsXHJcbiAgICByZXNwb25zaXZlOntcclxuICAgICAgICAwOntcclxuICAgICAgICAgICAgaXRlbXM6MlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgNjAwOntcclxuICAgICAgICAgICAgaXRlbXM6NFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgOTAwOntcclxuICAgICAgICAgICAgaXRlbXM6NVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgMTIzOTp7XHJcbiAgICAgICAgICAgIGl0ZW1zOjZcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pXHJcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24gKCl7XHJcbiAgICAkKCcgLm1vdicpLmVhY2goZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICAgIHZhciBpbWFnZVBvcyA9ICQodGhpcykub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICB2YXIgdG9wT2ZXaW5kb3cgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgIGlmIChpbWFnZVBvcyA8IHRvcE9mV2luZG93KzM1MCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygkKHRoaXMpLmRhdGEoJ2FuaW1hdGlvbicpKTtcclxuICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwibG94XCIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO++7v1xyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
