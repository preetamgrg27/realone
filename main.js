document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper for Events
    const eventsSwiper = new Swiper('.events-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        }
    });

    // Scroll Animation Trigger
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                if (entry.target.dataset.delay) {
                    entry.target.style.animationDelay = entry.target.dataset.delay;
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => {
        animateOnScroll.observe(el);
    });

    // Parallax Effect
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const yPos = -(scrollPosition * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // DJ Carousel Animation
    const djContainer = document.querySelector('.dj-container');
    if (djContainer) {
        let angle = 0;
        
        function rotateDJs() {
            angle = (angle + 0.2) % 360;
            const radius = 200;
            const djs = document.querySelectorAll('.dj-item');
            
            djs.forEach((dj, index) => {
                const itemAngle = angle + (index * (360 / djs.length));
                const x = radius * Math.cos(itemAngle * Math.PI / 180);
                const z = radius * Math.sin(itemAngle * Math.PI / 180);
                
                dj.style.transform = `rotateY(${itemAngle}deg) translateZ(${z}px)`;
                dj.style.opacity = 1 - (Math.abs(z) / radius) * 0.8;
            });
            
            requestAnimationFrame(rotateDJs);
        }
        
        rotateDJs();
    }

    // Reels Swipe Functionality
    const reelsContainer = document.querySelector('.reels-container');
    if (reelsContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        reelsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - reelsContainer.offsetLeft;
            scrollLeft = reelsContainer.scrollLeft;
        });
        
        reelsContainer.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        reelsContainer.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        reelsContainer.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - reelsContainer.offsetLeft;
            const walk = (x - startX) * 2;
            reelsContainer.scrollLeft = scrollLeft - walk;
        });
    }

    // Video Play on Hover for Reels
    const reelItems = document.querySelectorAll('.reel-item');
    reelItems.forEach(item => {
        const video = item.querySelector('video');
        
        item.addEventListener('mouseenter', () => {
            video.play();
        });
        
        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });

    // Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Current Year for Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});