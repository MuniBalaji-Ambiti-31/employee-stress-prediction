$(document).ready(function(){
    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
        // scroll-up button show/hide script
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // typing text animation script
    var typed = new Typed(".typing", {
        strings: ["Detect Stress Before it Affects Your Team: Use Our Employee Stress Detection Tool Today!","Say Goodbye to Burnout: Our Employee Stress Detection Tool Can Help You Identify and Prevent Burnout in Your Team","Stress Less, Work Better: Improve Employee Well-Being with Our Stress Detection Tool","Get Ahead of Stress: Our Employee Stress Detection Tool Helps You Identify Early Warning Signs and Take Action","Empower Your Team to Thrive: Use Our Employee Stress Detection Tool to Create a More Productive, Happier Workplace"],
        typeSpeed: 40,
        backSpeed: 10,
        loop: true
    });

    
   

    // owl carousel script
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: false,
        autoplayTimeOut: 30,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
                nav: true
            },
            333:{
                items: 2,
                nav: true
            },
            666:{
                items: 3,
                nav: true
            },
            1000:{
                items: 4,
                nav: true
            }
        }
    });
});


