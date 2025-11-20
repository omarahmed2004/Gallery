document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Text Animation
    const title = document.getElementById('hero-title');
    const text = "Maram Gallery";
    title.innerHTML = text.split("").map((char, i) => 
        `<span style="display:inline-block; animation: fadeUpChar 0.8s forwards; animation-delay: ${3.8 + (i * 0.05)}s; opacity:0; transform:translateY(20px); color: ${i < 5 ? '#E57373' : '#2C3E50'}">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join("");

    // 2. Initialize Nature Elements
    createNatureElements();
    
    // 3. Handle Intro & Content Reveal
    setTimeout(() => {
        const intro = document.getElementById('intro-overlay');
        intro.style.opacity = '0'; intro.style.visibility = 'hidden';
        document.getElementById('main-content').classList.add('fade-in-visible');
        
        // Start Masonry Observer only after intro is done
        initMasonryObserver();
    }, 6500);
});

// Function to create falling petals and butterflies
function createNatureElements() {
    const container = document.getElementById('nature-container');
    const petalCount = window.innerWidth < 768 ? 15 : 30;

    // Create Petals/Leaves
    for(let i=0; i<petalCount; i++) {
        const el = document.createElement('div');
        el.classList.add('nature-item', Math.random() > 0.7 ? 'leaf' : 'petal');
        el.style.left = Math.random() * 100 + '%';
        el.style.width = el.style.height = (Math.random() * 15 + 10) + 'px';
        el.style.animationDuration = (Math.random() * 10 + 10) + 's';
        el.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(el);
    }

    // Create Butterflies
    const butterflyCount = window.innerWidth < 768 ? 4 : 8;
    for(let i=0; i<butterflyCount; i++) {
        const b = document.createElement('div');
        b.classList.add('butterfly');
        b.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C12 2 10 6 6 6C2 6 2 4 2 8C2 11 4 12 6 12C4 12 2 13 2 16C2 20 5 22 8 22C10 22 12 18 12 18C12 18 14 22 16 22C19 22 22 20 22 16C22 13 20 12 18 12C20 12 22 11 22 8C22 4 22 6 18 6C14 6 12 2 12 2Z"/></svg>`;
        b.style.top = Math.random() * 80 + 10 + '%'; b.style.left = '-10%';
        b.style.animationDuration = (Math.random() * 20 + 20) + 's';
        b.style.animationDelay = (Math.random() * 15) + 's';
        b.querySelector('svg').style.fill = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
        container.appendChild(b);
    }
}

// Function to create click effects (Name + Teeth)
function createClickEffects(e) {
    // Support both Mouse and Touch events
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    // 1. Pop up "Maram" Name
    const nameEl = document.createElement('div');
    nameEl.classList.add('click-name'); 
    nameEl.innerText = 'Maram';
    nameEl.style.left = `${x}px`; 
    nameEl.style.top = `${y}px`;
    document.body.appendChild(nameEl);
    setTimeout(() => nameEl.remove(), 1500);

    // 2. Pop up Teeth Emojis
    for (let i = 0; i < 6; i++) {
        const tooth = document.createElement('div');
        tooth.classList.add('click-tooth'); 
        tooth.innerHTML = '🦷'; 
        tooth.style.left = `${x}px`; 
        tooth.style.top = `${y}px`;
        
        // Random scatter direction
        const randomX = (Math.random() - 0.5) * 120; 
        const randomRot = (Math.random() - 0.5) * 360;
        tooth.style.setProperty('--tx', `${randomX}px`);
        tooth.style.setProperty('--rot', `${randomRot}deg`);
        tooth.style.animationDuration = `${0.6 + Math.random() * 0.4}s`;
        
        document.body.appendChild(tooth);
        setTimeout(() => tooth.remove(), 1100);
    }
}

// Intersection Observer for Masonry Layout & Click Listeners
function initMasonryObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Apply random rotation only when visible
                const rotation = entry.target.dataset.rotation || 0;
                // Note: We keep scale(1) here, hover/active effects in CSS handle the zoom
                entry.target.style.transform = `translateY(0) scale(1) rotate(${rotation}deg)`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, i) => {
        // 1. Assign Random Rotation (-3 to 3 deg for subtle messy look)
        const randomRot = (Math.random() * 6) - 3;
        item.dataset.rotation = randomRot;
        
        // 2. Stagger delay for desktop
        if(window.innerWidth > 768) {
            item.style.transitionDelay = (i % 3) * 0.1 + 's';
        }
        
        observer.observe(item);
        
        // 3. Click/Touch Event
        // We use 'click' which works for both, but for mobile "tactile" feel
        // we added :active in CSS. This JS adds the Bounce class after release.
        item.addEventListener('click', (e) => {
            // Remove class to restart animation if clicked rapidly
            item.classList.remove('clicked'); 
            void item.offsetWidth; // Force reflow
            item.classList.add('clicked');
            
            createClickEffects(e);
        });
    });
}

// Mouse Trail (Desktop Only)
if (window.matchMedia("(min-width: 769px)").matches) {
    document.body.addEventListener('mousemove', (e) => {
        if(Math.random() > 0.85) return; // Optimization: don't draw every frame
        let t = document.createElement('div');
        t.style.position = 'fixed'; 
        t.style.left = e.clientX + 'px'; 
        t.style.top = e.clientY + 'px';
        t.style.width = '6px'; 
        t.style.height = '6px';
        t.style.background = 'rgba(229, 115, 115, 0.4)';
        t.style.borderRadius = '50%'; 
        t.style.pointerEvents = 'none'; 
        t.style.zIndex = '9999';
        t.style.transition = 'all 0.5s ease-out';
        document.body.appendChild(t);
        
        setTimeout(() => { 
            t.style.opacity = '0'; 
            t.style.transform = 'scale(2)'; 
        }, 10);
        setTimeout(() => t.remove(), 510);
    });
}
