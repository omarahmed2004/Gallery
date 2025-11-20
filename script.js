document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('hero-title');
    const text = "Maram Gallery";
    title.innerHTML = text.split("").map((char, i) => 
        `<span style="display:inline-block; animation: fadeUpChar 0.8s forwards; animation-delay: ${4.5 + (i * 0.05)}s; opacity:0; transform:translateY(20px); color: ${i < 5 ? '#E57373' : '#2C3E50'}">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join("");
    
    // TITLE INTERACTION
    title.addEventListener('click', (e) => {
        const rect = title.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const s = window.innerWidth < 768 ? 2 : 3; 
        const points = [
            {x: 60*s, y: -5*s}, {x: 65*s, y: -10*s}, {x: 70*s, y: -5*s}, {x: 65*s, y: 0}, {x: 60*s, y: 0}, 
            {x: 50*s, y: 0}, 
            {x: 40*s, y: 2*s}, {x: 30*s, y: 8*s}, {x: 20*s, y: 18*s}, {x: 15*s, y: 25*s},
            {x: -5*s, y: -25*s}, {x: -5*s, y: -15*s}, {x: -5*s, y: -5*s}, {x: -5*s, y: 5*s}, {x: -5*s, y: 15*s},
            {x: -35*s, y: 0}, {x: -40*s, y: -5*s}, {x: -45*s, y: 0}, {x: -40*s, y: 5*s}, 
            {x: -45*s, y: 5*s}, {x: -45*s, y: 15*s}, {x: -45*s, y: 25*s}, {x: -45*s, y: 35*s} 
        ];

        points.forEach(pt => {
            createFormationButterfly(centerX, centerY, pt.x, pt.y);
        });
    });

    createNatureElements();
    
    setTimeout(() => {
        const intro = document.getElementById('intro-overlay');
        intro.style.opacity = '0'; intro.style.visibility = 'hidden';
        document.getElementById('main-content').classList.add('fade-in-visible');
        initMasonryObserver();
    }, 5800); 
});

function createFormationButterfly(startX, startY, targetOffsetX, targetOffsetY) {
    const b = document.createElement('div');
    b.classList.add('formation-butterfly');
    b.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C12 2 10 6 6 6C2 6 2 4 2 8C2 11 4 12 6 12C4 12 2 13 2 16C2 20 5 22 8 22C10 22 12 18 12 18C12 18 14 22 16 22C19 22 22 20 22 16C22 13 20 12 18 12C20 12 22 11 22 8C22 4 22 6 18 6C14 6 12 2 12 2Z"/></svg>`;
    
    b.style.left = startX + 'px';
    b.style.top = startY + 'px';
    
    const hue = Math.random() > 0.5 ? 340 : 45; 
    b.querySelector('svg').style.fill = `hsl(${hue}, 80%, 60%)`;
    
    b.style.setProperty('--tx', `${targetOffsetX}px`);
    b.style.setProperty('--ty', `${targetOffsetY}px`);

    let dirX = targetOffsetX;
    let dirY = targetOffsetY;
    if (dirX === 0 && dirY === 0) { dirX = Math.random() - 0.5; dirY = Math.random() - 0.5; }
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 300 + Math.random() * 300; 
    
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;
    const rot = Math.random() * 720 - 360;

    b.style.setProperty('--dx', `${destX}px`);
    b.style.setProperty('--dy', `${destY}px`);
    b.style.setProperty('--rot', `${rot}deg`);
    
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 4000); 
}

function createNatureElements() {
    const container = document.getElementById('nature-container');
    const petalCount = window.innerWidth < 768 ? 30 : 60; 
    
    for(let i=0; i<petalCount; i++) {
        const el = document.createElement('div');
        el.classList.add('nature-item', Math.random() > 0.7 ? 'leaf' : 'petal');
        el.style.left = Math.random() * 100 + '%';
        el.style.width = el.style.height = (Math.random() * 12 + 15) + 'px'; 
        el.style.animationDuration = (Math.random() * 8 + 8) + 's';
        el.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(el);
    }
    
    const butterflyCount = window.innerWidth < 768 ? 10 : 25; 
    for(let i=0; i<butterflyCount; i++) {
        const b = document.createElement('div');
        b.classList.add('bg-butterfly');
        b.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C12 2 10 6 6 6C2 6 2 4 2 8C2 11 4 12 6 12C4 12 2 13 2 16C2 20 5 22 8 22C10 22 12 18 12 18C12 18 14 22 16 22C19 22 22 20 22 16C22 13 20 12 18 12C20 12 22 11 22 8C22 4 22 6 18 6C14 6 12 2 12 2Z"/></svg>`;
        b.style.top = Math.random() * 80 + 10 + '%'; b.style.left = '-10%';
        b.style.animationDuration = (Math.random() * 15 + 15) + 's';
        b.style.animationDelay = (Math.random() * 10) + 's';
        b.querySelector('svg').style.fill = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
        container.appendChild(b);
    }
}

function createClickEffects(e) {
    let x, y;
    if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    
    const nameEl = document.createElement('div');
    nameEl.classList.add('click-name'); nameEl.innerText = 'Maram';
    nameEl.style.left = `${x}px`; nameEl.style.top = `${y}px`;
    document.body.appendChild(nameEl);
    setTimeout(() => nameEl.remove(), 1500);

    const count = window.innerWidth < 768 ? 4 : 6;
    for (let i = 0; i < count; i++) {
        const tooth = document.createElement('div');
        tooth.classList.add('click-tooth'); tooth.innerHTML = '🦷'; 
        tooth.style.left = `${x}px`; tooth.style.top = `${y}px`;
        const randomX = (Math.random() - 0.5) * 120; 
        const randomRot = (Math.random() - 0.5) * 360;
        tooth.style.setProperty('--tx', `${randomX}px`);
        tooth.style.setProperty('--rot', `${randomRot}deg`);
        tooth.style.animationDuration = `${0.5 + Math.random() * 0.4}s`; 
        document.body.appendChild(tooth);
        setTimeout(() => tooth.remove(), 1000);
    }
}

function initMasonryObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                const rotation = entry.target.dataset.rotation || 0;
                entry.target.style.transform = `translateY(0) scale(1) rotate(${rotation}deg)`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, i) => {
        const randomRot = (Math.random() * 6) - 3;
        item.dataset.rotation = randomRot;
        if(window.innerWidth > 768) { item.style.transitionDelay = (i % 3) * 0.1 + 's'; }
        observer.observe(item);
        
        // --- CLICK/TAP EFFECTS ---
        item.addEventListener('click', (e) => {
            item.classList.remove('clicked'); 
            void item.offsetWidth; 
            item.classList.add('clicked');
            createClickEffects(e);
        });

        // --- HOLD CINEMATIC EFFECT START ---
        const startHold = () => { item.classList.add('holding'); };
        const endHold = () => { item.classList.remove('holding'); };

        item.addEventListener('mousedown', startHold);
        item.addEventListener('touchstart', startHold, {passive: true});
        
        item.addEventListener('mouseup', endHold);
        item.addEventListener('mouseleave', endHold);
        item.addEventListener('touchend', endHold);
        item.addEventListener('touchcancel', endHold);
        // --- HOLD EFFECT END ---
    });
}
if (window.matchMedia("(min-width: 769px)").matches) {
    document.body.addEventListener('mousemove', (e) => {
        if(Math.random() > 0.85) return;
        let t = document.createElement('div');
        t.style.position = 'fixed'; t.style.left = e.clientX + 'px'; t.style.top = e.clientY + 'px';
        t.style.width = '6px'; t.style.height = '6px';
        t.style.background = 'rgba(229, 115, 115, 0.4)';
        t.style.borderRadius = '50%'; t.style.pointerEvents = 'none'; t.style.zIndex = '9999';
        t.style.transition = 'all 0.5s ease-out';
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'scale(2)'; }, 10);
        setTimeout(() => t.remove(), 510);
    });
}
