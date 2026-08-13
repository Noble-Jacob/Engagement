/* =============================================
   WEDDING INVITATION — JavaScript
   Floating petals, sparkle trail, countdown,
   scroll reveals, RSVP form, navigation
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    //  1. FLOATING PETALS — Canvas Animation
    // ==========================================
    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');
    let petals = [];
    const PETAL_COUNT = 35;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Petal colors — soft romantic tones
    const petalColors = [
        'rgba(245, 198, 208, 0.6)',  // blush
        'rgba(232, 160, 176, 0.5)',  // deep blush
        'rgba(197, 179, 217, 0.5)',  // lavender
        'rgba(232, 223, 245, 0.5)',  // light lavender
        'rgba(201, 169, 110, 0.35)', // gold
        'rgba(255, 255, 255, 0.6)',  // white
    ];

    class Petal {
        constructor() {
            this.reset();
            // Start at random position on first load
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 12 + 6;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = Math.random() * 1 - 0.5;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.03;
            this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.amplitude = Math.random() * 40 + 20;
            this.frequency = Math.random() * 0.02 + 0.01;
            this.phase = Math.random() * Math.PI * 2;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * this.frequency + this.phase) * 0.5 + this.speedX * 0.3;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            // Draw petal shape
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.bezierCurveTo(
                this.size / 2, -this.size / 2,
                this.size / 2, this.size / 2,
                0, this.size
            );
            ctx.bezierCurveTo(
                -this.size / 2, this.size / 2,
                -this.size / 2, -this.size / 2,
                0, -this.size / 2
            );
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize petals
    for (let i = 0; i < PETAL_COUNT; i++) {
        petals.push(new Petal());
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animatePetals);
    }
    animatePetals();


    // ==========================================
    //  2. SPARKLE CURSOR TRAIL
    // ==========================================
    const trail = document.getElementById('cursor-trail');
    let lastSparkle = 0;
    const SPARKLE_INTERVAL = 60; // ms between sparkles

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkle < SPARKLE_INTERVAL) return;
        lastSparkle = now;

        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = (e.clientX - 3) + 'px';
        sparkle.style.top = (e.clientY - 3) + 'px';

        // Random drift direction
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 20 + 10;
        sparkle.style.setProperty('--sx', `${Math.cos(angle) * dist}px`);
        sparkle.style.setProperty('--sy', `${Math.sin(angle) * dist}px`);

        // Vary size and color
        const size = Math.random() * 4 + 3;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';

        const colors = ['#c9a96e', '#f5c6d0', '#e8a0b0', '#c5b3d9', '#e8d5a8'];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];

        trail.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 800);
    });


    // ==========================================
    //  3. NAVIGATION
    // ==========================================
    const nav = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    // Scroll-based nav background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile nav toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });


    // ==========================================
    //  4. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    //  5. COUNTDOWN TIMER
    // ==========================================
    const weddingDate = new Date('2026-08-31T15:00:00').getTime();

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        if (diff <= 0) {
            daysEl.textContent = '0';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Animate number changes
        animateNumber(daysEl, days.toString());
        animateNumber(hoursEl, hours.toString().padStart(2, '0'));
        animateNumber(minutesEl, minutes.toString().padStart(2, '0'));
        animateNumber(secondsEl, seconds.toString().padStart(2, '0'));
    }

    function animateNumber(el, newValue) {
        if (el.textContent !== newValue) {
            el.style.transform = 'scale(1.05)';
            el.textContent = newValue;
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 150);
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    // ==========================================
    //  6. RSVP FORM
    // ==========================================
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    const rsvpSubmit = document.getElementById('rsvp-submit');

    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Button loading state
        const btnText = rsvpSubmit.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Sending...';
        rsvpSubmit.disabled = true;
        rsvpSubmit.style.opacity = '0.7';

        try {
            const response = await fetch(rsvpForm.action, {
                method: 'POST',
                body: new FormData(rsvpForm),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('RSVP submission failed');
            }

            rsvpForm.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            rsvpForm.style.opacity = '0';
            rsvpForm.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                rsvpForm.style.display = 'none';
                rsvpSuccess.classList.remove('hidden');

                // Launch celebration confetti
                launchCelebration();
            }, 400);
        } catch (error) {
            btnText.textContent = originalText;
            rsvpSubmit.disabled = false;
            rsvpSubmit.style.opacity = '1';
            alert('Sorry, your RSVP could not be sent. Please try again.');
        }
    });

    // Mini celebration effect on RSVP success
    function launchCelebration() {
        const colors = ['#f5c6d0', '#e8a0b0', '#c5b3d9', '#c9a96e', '#e8d5a8', '#b5c9b0'];
        const container = document.querySelector('.rsvp-section');

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 8 + 4}px;
                    height: ${Math.random() * 8 + 4}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                    top: 50%;
                    left: ${Math.random() * 100}%;
                    pointer-events: none;
                    z-index: 10;
                    animation: confetti-fall ${Math.random() * 2 + 1.5}s ease-out forwards;
                `;
                container.style.position = 'relative';
                container.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }

    // Add confetti animation to document
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confetti-fall {
            0% {
                opacity: 1;
                transform: translateY(0) rotate(0deg) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(${-200 + Math.random() * 400}px) 
                           translateX(${(Math.random() - 0.5) * 200}px)
                           rotate(${Math.random() * 720}deg) 
                           scale(0);
            }
        }
    `;
    document.head.appendChild(confettiStyle);


    // ==========================================
    //  7. SMOOTH SECTION PARALLAX (subtle)
    // ==========================================
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const parallaxAmount = scrolled * -0.12;
            heroContent.style.transform = `translateY(${parallaxAmount}px)`;
            heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.8;
        }
    });


    // ==========================================
    //  8. ACTIVE NAV LINK HIGHLIGHT
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksAll.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--color-gold-dark)';
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });

    sections.forEach(section => sectionObserver.observe(section));

});
