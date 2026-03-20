document.addEventListener('DOMContentLoaded', () => {
    // Target Birthday: March 22, 2026, 00:00:00
    // Note: Month is 0-indexed in JS (January is 0, March is 2)
    const birthdayYear = 2026;
    const birthdayMonth = 2; // March
    const birthdayDate = 22;
    
    // We can also allow it to be the NEXT March 22nd if the date has passed,
    // but the prompt strictly says 2026-03-22 in my perspective.
    const countDownDate = new Date(birthdayYear, birthdayMonth, birthdayDate, 0, 0, 0).getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    
    const preSection = document.getElementById("pre-birthday-section");
    const bdaySection = document.getElementById("birthday-section");
    const memSection = document.getElementById("memory-section");
    const surpriseBtn = document.getElementById("surpriseBtn");

    let isBirthday = false;

    // --- Dynamic Media Gallery Injection ---
    // If you want to add more images later, simply add the file names to this array!
    const mediaFiles = [
        { type: 'image', src: 'images/IMG_20260320_100853.jpg.jpeg', caption: 'Little Cutie', textClass: 'text-info' },
        { type: 'image', src: 'images/IMG_20260320_100228.jpg.jpeg', caption: 'Childhood Sweetness', textClass: 'text-warning' },
        { type: 'image', src: 'images/IMG_20260320_100945.jpg.jpeg', caption: 'Adorable Moments', textClass: 'text-danger' },
        { type: 'image', src: 'images/IMG20251011141707.jpg.jpeg', caption: 'Beautiful Smile', textClass: 'text-warning' },
        { type: 'image', src: 'images/IMG20251020141006.jpg.jpeg', caption: 'Unforgettable Days', textClass: 'text-info' },
        { type: 'image', src: 'images/IMG20251020204719.jpg.jpeg', caption: 'Always Shining', textClass: 'text-danger' },
        { type: 'image', src: 'images/IMG20251020204721.jpg.jpeg', caption: 'Precious Memories', textClass: 'text-warning' },
        { type: 'image', src: 'images/IMG20251020204727.jpg.jpeg', caption: 'Looking Gorgeous', textClass: 'text-info' },
        { type: 'image', src: 'images/IMG20251115151346.jpg.jpeg', caption: 'Stunning Look', textClass: 'text-danger' },
        { type: 'image', src: 'images/IMG_20251117_195919.jpg.jpeg', caption: 'Cherished Times', textClass: 'text-info' },
        { type: 'image', src: 'images/IMG_20251117_200006.jpg.jpeg', caption: 'Sisterly Love', textClass: 'text-danger' },
        { type: 'image', src: 'images/IMG_20251117_200305.jpg.jpeg', caption: 'Happiness', textClass: 'text-warning' }
    ];

    function populateCarousel() {
        const indicators = document.getElementById('carousel-indicators');
        const inner = document.getElementById('carousel-inner');
        
        // Ensure elements exist
        if(!indicators || !inner) return;

        mediaFiles.forEach((item, index) => {
            // Indicator
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.bsTarget = '#birthdayCarousel';
            btn.dataset.bsSlideTo = index;
            btn.ariaLabel = `Slide ${index + 1}`;
            if (index === 0) {
                btn.classList.add('active');
                btn.ariaCurrent = 'true';
            }
            indicators.appendChild(btn);

            // Inner Item
            const div = document.createElement('div');
            div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            div.dataset.bsInterval = item.type === 'video' ? '10000' : '3000'; // Videos play longer before sliding

            let mediaHtml = '';
            if (item.type === 'image') {
                mediaHtml = `<img src="${item.src}" class="d-block w-100 object-fit-contain carousel-img-height" alt="Memory">`;
            } else if (item.type === 'video') {
                mediaHtml = `<video class="d-block w-100 object-fit-contain carousel-img-height" autoplay muted loop controls><source src="${item.src}" type="video/mp4"></video>`;
            }

            div.innerHTML = `
                ${mediaHtml}
                <div class="carousel-caption d-none d-md-block glass-caption rounded-3">
                    <h5 class="font-dancing fs-3 ${item.textClass}">${item.caption}</h5>
                </div>
            `;
            inner.appendChild(div);
        });
    }
    populateCarousel();
    // ------------------------------------------

    // Update the countdown every 1 second
    const x = setInterval(function() {

        // Get today's date and time
        const now = new Date().getTime();

        // Find the distance between now and the countdown date
        const distance = countDownDate - now;

        // If the count down is finished, show birthday mode!
        // We will also keep it in birthday mode if it's the day of March 22nd.
        // Let's assume if distance <= 0, we flip the switch.
        if (distance <= 0) {
            clearInterval(x);
            triggerBirthdayMode();
        } else {
            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result
            daysEl.innerHTML = days < 10 ? '0' + days : days;
            hoursEl.innerHTML = hours < 10 ? '0' + hours : hours;
            minutesEl.innerHTML = minutes < 10 ? '0' + minutes : minutes;
            secondsEl.innerHTML = seconds < 10 ? '0' + seconds : seconds;
        }
    }, 1000);

    // Initial check in case it's already past the date
    if (new Date().getTime() >= countDownDate) {
        clearInterval(x);
        triggerBirthdayMode();
    }
    
    // Testing mechanism: Add double click on body to force birthday mode for preview
    document.body.addEventListener('dblclick', function() {
        if(!isBirthday) {
            clearInterval(x);
            triggerBirthdayMode();
        }
    });

    function triggerBirthdayMode() {
        if (isBirthday) return;
        isBirthday = true;

        // Try to play pre-surprise music
        const bgMusic1 = document.getElementById("bgMusic1");
        if (bgMusic1) {
            bgMusic1.play().catch(e => console.log("Audio 1 playback prevented:", e));
            
            // Fallback: If blocked, try playing on the next click anywhere on the page
            const playOnInteract = () => {
                const memSection = document.getElementById("memory-section");
                // Only if the surprise hasn't been clicked
                if (memSection && memSection.classList.contains("hide-section") && bgMusic1.paused) {
                    bgMusic1.play().catch(e => {});
                }
                document.removeEventListener('click', playOnInteract);
            };
            document.addEventListener('click', playOnInteract);
        }
        
        // Hide countdown section
        preSection.classList.remove("show-section");
        preSection.classList.add("hide-section");
        
        // Use timeout to allow CSS transition
        setTimeout(() => {
            preSection.style.display = "none";
            
            // Show birthday section
            bdaySection.classList.remove("hide-section");
            bdaySection.classList.add("show-section");
            
            // Fire initial confetti
            fireConfetti();
            
        }, 500); // Wait for fade out
    }

    // Surprise Button Click
    surpriseBtn.addEventListener('click', () => {
        
        // Switch Background Music (Pause Music 1, Play Music 2)
        const bgMusic1 = document.getElementById("bgMusic1");
        const bgMusic2 = document.getElementById("bgMusic2");
        if (bgMusic1) {
            bgMusic1.pause();
            bgMusic1.currentTime = 0;
        }
        if (bgMusic2) {
            bgMusic2.play().catch(e => console.log("Audio 2 playback was prevented:", e));
        }

        // Apply visual blast effect to the button
        surpriseBtn.classList.add('blast-animation');
        setTimeout(() => {
            surpriseBtn.classList.remove('blast-animation');
        }, 600);

        // Huge central confetti blasts (Blast Effect)
        confetti({
            particleCount: 200,
            spread: 160,
            origin: { y: 0.5 },
            colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#1dd1a1', '#ffffff']
        });
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 120,
                origin: { y: 0.5 },
                colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#1dd1a1', '#ffffff']
            });
        }, 200);

        // Show memory section
        if (memSection.classList.contains("hide-section")) {
            memSection.classList.remove("hide-section");
            memSection.classList.add("show-section");
            
            // Scroll to memory section smoothly so user explicitly sees the images
            setTimeout(() => {
                memSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }

        // Continuous Confetti Shower
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, { particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
        
        // Change button text briefly
        const originalText = surpriseBtn.innerHTML;
        surpriseBtn.innerHTML = '<i class="fas fa-heart"></i> Love you!';
        setTimeout(() => {
            surpriseBtn.innerHTML = originalText;
        }, 5000);
    });

    function fireConfetti() {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    }
});
