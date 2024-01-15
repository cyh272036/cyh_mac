document.addEventListener("DOMContentLoaded", function () {
    //3d 입체 텍스트 , intro
    console.clear();

    select = e => document.querySelector(e);
    selectAll = e => document.querySelectorAll(e);

    const container = select('.container');
    const cuboid = selectAll('.hi__cuboid');
    const hiWords = selectAll('.hi__word');
    let winW = 0;
    let winH = 0;
    let pointer = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };

    function init() {

        setWinDimensions();

        gsap.set(container, { autoAlpha: 1 });

        gsap.timeline({ delay: 0.5 })
            .from(cuboid, {
                y: winH,
                duration: 3,
                stagger: 0.14,
                ease: 'elastic(0.4,0.3)'
            }, 0);

        gsap.to(cuboid, {
            rotateX: -360,
            duration: 8,
            repeat: -1,
            ease: 'none'
        });

        gsap.fromTo(cuboid, {
            rotateY: 8,
            rotate: -10
        }, {
            rotateY: -8,
            rotate: 10,
            duration: 2.2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });
    }

    function setWinDimensions() {
        winW = window.innerWidth;
        winH = window.innerHeight;
    }

    function calcOffset(xPos, yPos) {
        let dX = 2 * (xPos - winW / 2) / winW;
        let dY = -2 * (yPos - winH / 2) / winH;
        return [dX, dY];
    }

    function followPointer(pX, pY) {
        let nPos = calcOffset(pX, pY); // get cursor position from center
        let nX = nPos[0];
        let nY = nPos[1];
        let positiveX = Math.sqrt(nX * nX);
        let positiveY = Math.sqrt(nY * nY);
        let deltaS = 450 * positiveX;
        let deltaW = 600 * positiveY;
        gsap.to(hiWords, {
            fontStretch: `${(550 - deltaS)}%`,
            fontWeight: 800 - deltaW,
            duration: 2
        });
    }

    window.addEventListener("mousemove", function (event) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        followPointer(pointer.x, pointer.y);
    });

    window.addEventListener('touchmove', function (event) {
        pointer.x = event.touches[0].clientX;
        pointer.y = event.touches[0].clientY;
        followPointer(pointer.x, pointer.y);
    });

    window.addEventListener('touchstart', function (event) {
        pointer.x = event.touches[0].clientX;
        pointer.y = event.touches[0].clientY;
        followPointer(pointer.x, pointer.y);
    });

    window.onload = () => {
        init();
    };

    window.onresize = setWinDimensions;


    /// 페이지 스크롤
    // const elm = document.querySelectorAll('.div');
    // const elmCount = elm.length;
    // elm.forEach(function (item, index) {
    //     item.addEventListener('mousewheel', function (event) {
    //         event.preventDefault();
    //         let delta = 0;

    //         if (!event) event = window.event;
    //         if (event.wheelDelta) {
    //             delta = event.wheelDelta / 120;
    //             if (window.opera) delta = -delta;
    //         }
    //         else if (event.detail)
    //             delta = -event.detail / 3;

    //         let moveTop = window.scrollY;
    //         let elmSelector = elm[index];

    //         // wheel down : move to next section
    //         if (delta < 0) {
    //             if (elmSelector !== elmCount - 1) {
    //                 try {
    //                     moveTop = window.pageYOffset + elmSelector.nextElementSibling.getBoundingClientRect().top;
    //                 } catch (e) { }
    //             }
    //         }
    //         // wheel up : move to previous section
    //         else {
    //             if (elmSelector !== 0) {
    //                 try {
    //                     moveTop = window.pageYOffset + elmSelector.previousElementSibling.getBoundingClientRect().top;
    //                 } catch (e) { }
    //             }
    //         }

    //         const body = document.querySelector('html');
    //         window.scrollTo({ top: moveTop, left: 0, behavior: 'smooth' });     
    //     });
    // });

    const elm = document.querySelectorAll('.div');
    const elmCount = elm.length;

    let isScrolling = false;

    elm.forEach(function (item, index) {
        item.addEventListener('wheel', function (event) {
            event.preventDefault();

            if (isScrolling) return;

            isScrolling = true;
            requestAnimationFrame(function () {
                isScrolling = false;
            });

            let delta = event.deltaY || event.detail || -event.wheelDelta;

            let moveTop = window.scrollY;
            let elmSelector = elm[index];

            // wheel down : move to next section
            if (delta > 0) {
                if (elmSelector !== elmCount - 1) {
                    try {
                        moveTop = window.pageYOffset + elmSelector.nextElementSibling.getBoundingClientRect().top;
                    } catch (e) { }
                }
            }
            // wheel up : move to previous section
            else {
                if (elmSelector !== 0) {
                    try {
                        moveTop = window.pageYOffset + elmSelector.previousElementSibling.getBoundingClientRect().top;
                    } catch (e) { }
                }
            }

            window.scrollTo({ top: moveTop, left: 0, behavior: 'smooth' });
        });
    });


    //page button
    const divElements = document.querySelectorAll('.div');
    const navDots = document.querySelectorAll('.nav-dot');
    const navList = document.querySelectorAll('.nav ul li a');

    const initialActiveIndex = 0;
    setActiveClass(initialActiveIndex);
    
    // 함수를 만들어 현재 액티브 클래스를 설정하고 스크롤 이벤트에 연결
    function setActiveClass(index) {
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[index].classList.add('active');
        navList.forEach(li => li.classList.remove('active'));
        navList[index].classList.add('active');
    }
    
    // 스크롤 이벤트 핸들러
    window.addEventListener('scroll', function () {
        const sc = window.scrollY;
    
        divElements.forEach((div, index) => {
            const position = div.getBoundingClientRect();
            if (position.top <= 150 && position.bottom >= 150) {
                setActiveClass(index);
            }
        });
    
        if (sc > 3600) {
            $('.drawing path').css({ animation: 'dash 3s ease-in-out forwards' });
        } else {
            $('.drawing path').css({ animation: 'none' });
        }
    });
    
    // 페이지 로드 시 첫 번째 요소에 액티브 클래스 설정
    document.addEventListener('DOMContentLoaded', function () {
        // 페이지에 처음 들어왔을 때, 원하는 인덱스에 해당하는 액티브 클래스 설정
        const initialActiveIndex = 0;  // 여기에 원하는 초기 인덱스를 설정
        setActiveClass(initialActiveIndex);
    });
    

    //scrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    //section02 scroll event
    var t2 = gsap.timeline({
        defaults: {
            autoAlpha: 0,
            ease: "power2",
            duration: 1
        }
    });

    t2.from(".big", { y: 30 }, 0.5)
        .from(".works", { y: 30 }, 0.7)
        .from(".profile", { y: 0 }, 0.5)
        .from(".act", { y: 0 }, 0.5)
        .from(".develop", { y: 0 }, 0.5);

    ScrollTrigger.create({
        trigger: '.s_02',
        start: "top 80%",
        end: "bottom 20%",
        animation: t2,
        once: false,
        toggleActions: "restart restart restart restart",
    });

    //section03 scroll event
    var t3 = gsap.timeline({
        defaults: {
            autoAlpha: 0,
            ease: "power2",
            duration: 1
        }
    });

    t3.from(".project_wrap", { y: 30 }, 0.2)

    ScrollTrigger.create({
        trigger: '.s_03',
        start: "top 80%",
        end: "bottom 20%",
        animation: t3,
        once: false,
        toggleActions: "restart restart restart restart",
    });

    //section04 scroll event
    var t4 = gsap.timeline({
        defaults: {
            autoAlpha: 0,
            ease: "power2",
            duration: 1
        }
    });

    t4.from(".index", { y: 30 }, 0.5)
        .from(".index_list", { y: 30 }, 0.7)
        .from(".animated-title", { y: 30 }, 0.7);

    ScrollTrigger.create({
        trigger: '.s_04',
        start: "top 80%",
        end: "bottom 20%",
        animation: t4,
        once: false,
        toggleActions: "restart restart restart restart",
    });


    //project text event
    const textElements = document.querySelectorAll('.text');
    const triggerOffset = 100; // 요소가 다시 효과를 진행시킬 트리거 오프셋

    function handleScroll() {
        textElements.forEach(text => {
            const rect = text.getBoundingClientRect();
            const scrollTop = window.scrollY || window.pageYOffset;

            if (rect.top + triggerOffset < window.innerHeight && rect.bottom - triggerOffset > 0) {
                text.style.backgroundSize = '100%';
            } else {
                text.style.backgroundSize = '0%';
            }
        });
    }

    window.addEventListener('scroll', handleScroll);

    handleScroll();


    //project text hover
    $('.project_container').mouseover(
        function () {
            $(this).find('.text-img').show();
            $(this).siblings().find('.text-img').hide();
        }
    );


});