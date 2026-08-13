/* =============================================
   WEDDING INVITATION — JavaScript
   Floating petals, sparkle trail, countdown,
   scroll reveals, navigation
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    //  0. OPENING INVITATION + SOFT BGM
    // ==========================================
    const invitationGate = document.getElementById('invitation-gate');
    const openInvitationBtn = document.getElementById('open-invitation');
    const musicToggle = document.getElementById('music-toggle');
    let audioContext;
    let masterGain;
    let musicTimer;
    let musicPlaying = false;

    const melody = [
        { note: 392.0, length: 0.9 },
        { note: 493.88, length: 0.9 },
        { note: 587.33, length: 1.2 },
        { note: 523.25, length: 0.9 },
        { note: 493.88, length: 1.1 },
        { note: 440.0, length: 0.9 },
        { note: 392.0, length: 1.4 },
    ];

    function initAudio() {
        if (audioContext) return;

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.08;
        masterGain.connect(audioContext.destination);
    }

    function playTone(frequency, startTime, duration) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.8, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.connect(gain);
        gain.connect(masterGain);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.04);
    }

    function playMelodyLoop() {
        if (!musicPlaying || !audioContext) return;

        let time = audioContext.currentTime + 0.05;
        melody.forEach(({ note, length }) => {
            playTone(note, time, length);
            playTone(note / 2, time, length * 1.05);
            time += length;
        });

        musicTimer = setTimeout(playMelodyLoop, 7400);
    }

    function startMusic() {
        initAudio();

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        if (musicPlaying) return;
        musicPlaying = true;
        musicToggle.classList.add('is-playing');
        musicToggle.setAttribute('aria-pressed', 'true');
        playMelodyLoop();
    }

    function stopMusic() {
        musicPlaying = false;
        clearTimeout(musicTimer);
        musicToggle.classList.remove('is-playing');
        musicToggle.setAttribute('aria-pressed', 'false');
    }

    function createInvitationBurst() {
        const sparkColors = ['#c9a96e', '#e8a0b0', '#f5c6d0', '#c5b3d9', '#e8d5a8'];

        for (let i = 0; i < 34; i++) {
            const spark = document.createElement('span');
            const angle = (Math.PI * 2 * i) / 34;
            const distance = 120 + Math.random() * 190;

            spark.className = 'invitation-spark';
            spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
            spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
            spark.style.setProperty('--spark-size', `${Math.random() * 5 + 4}px`);
            spark.style.setProperty('--spark-color', sparkColors[Math.floor(Math.random() * sparkColors.length)]);
            invitationGate.appendChild(spark);

            setTimeout(() => spark.remove(), 1300);
        }

        for (let i = 0; i < 18; i++) {
            const petal = document.createElement('span');
            petal.className = 'invitation-petal';
            petal.style.setProperty('--petal-x', `${(Math.random() - 0.5) * 520}px`);
            petal.style.setProperty('--petal-y', `${80 + Math.random() * 280}px`);
            petal.style.setProperty('--petal-rotate', `${Math.random() * 520 - 260}deg`);
            petal.style.animationDelay = `${Math.random() * 0.18}s`;
            invitationGate.appendChild(petal);

            setTimeout(() => petal.remove(), 1700);
        }
    }

    openInvitationBtn.addEventListener('click', () => {
        if (invitationGate.classList.contains('is-opening')) return;

        startMusic();
        createInvitationBurst();
        invitationGate.classList.add('is-opening');
        openInvitationBtn.disabled = true;

        setTimeout(() => {
            invitationGate.classList.add('is-opened');
            document.body.classList.remove('invitation-locked');
            document.body.classList.add('site-entering');
        }, 680);

        musicToggle.classList.add('visible');

        setTimeout(() => {
            invitationGate.remove();
            document.body.classList.remove('site-entering');
        }, 1750);
    });

    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    });

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
    //  6. SMOOTH SECTION PARALLAX (subtle)
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
    //  7. ACTIVE NAV LINK HIGHLIGHT
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
