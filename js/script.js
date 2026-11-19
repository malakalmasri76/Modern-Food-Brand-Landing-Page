// Placeholder links (href="#") shouldn't jump to the top of the page
document.querySelectorAll('a[href="#"]').forEach((a) =>
    a.addEventListener('click', (e) => e.preventDefault())
);

// ---------- Mobile menu ----------
const nav = document.querySelector('nav');
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');

function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
}
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
window.matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));

// ---------- Testimonial slider ----------
const slides = document.querySelectorAll('.Testimonial .client');
const prev = document.querySelector('.testimonial-arrows .prev a');
const next = document.querySelector('.testimonial-arrows .next a');
let current = 0;
let timer;

function show(i) {
    slides[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
}
function autoplay() {
    clearInterval(timer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => show(current + 1), 6000);
}
prev.addEventListener('click', () => { show(current - 1); autoplay(); });
next.addEventListener('click', () => { show(current + 1); autoplay(); });
autoplay();


// ---------- Scroll reveal ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll(`
        main section > h2, main section > h3, main section > p,
        .Our-Services .item, .Our-Services .read-more,
        .Fresh-Fruits .fruit,
        .How-It-Works .step, .FAQ details,
        .Testimonial .slides, .Testimonial .testimonial-arrows,
        .Contact-Us form > *,
        .info .col, .info .Follow-Us
    `);
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach((el) => {
        // stagger siblings inside the same grid/row (0s, .12s, .24s ...)
        const index = [...el.parentElement.children].filter((c) => c.matches('.item, .col, .fruit, .step')).indexOf(el);
        if (index > 0) el.style.setProperty('--d', `${(index % 4) * 0.12}s`);
        el.classList.add('reveal');
        io.observe(el);
    });
}

// ---------- Highlight current section in the nav ----------
const navLinks = document.querySelectorAll('#nav-menu a[href^="#"]:not([href="#"])');
const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    });
}, { rootMargin: '-40% 0px -55% 0px' });
navLinks.forEach((a) => {
    const section = document.querySelector(a.getAttribute('href'));
    if (section) spy.observe(section);
});

// ---------- Back to top ----------
const toTop = document.querySelector('.to-top');
window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600), { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

// ---------- Forms (front-end only: replace the setTimeout with a real request later) ----------
document.querySelectorAll('form').forEach((form) => {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const label = button.textContent;
        button.disabled = true;
        button.textContent = 'Sending...';
        status.textContent = '';
        setTimeout(() => {
            form.reset();
            button.disabled = false;
            button.textContent = label;
            status.textContent = form.closest('.Contact-Us') ? 'Thanks! We will get back to you soon.' : 'You are subscribed!';
            setTimeout(() => { status.textContent = ''; }, 5000);
        }, 900);
    });
});


// ---------- Sticky nav shadow ----------
const siteNav = document.querySelector('.site-nav');
window.addEventListener('scroll', () => siteNav.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

// ---------- Cart + WhatsApp checkout ----------
const WHATSAPP_NUMBER = '15551234567'; // TODO: replace with your number, country code first, no + or spaces
const CURRENCY = '$';
const CART_KEY = 'tropiko-cart';

const drawer = document.getElementById('cart');
const overlay = document.querySelector('.cart-overlay');
const itemsEl = drawer.querySelector('.cart-items');
const totalEl = drawer.querySelector('.cart-total strong');
const checkout = drawer.querySelector('.checkout');
const countEl = document.querySelector('.cart-count');
const toastEl = document.querySelector('.toast');
const money = (n) => `${CURRENCY}${n.toFixed(2)}`;

let cart = [];
try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    if (Array.isArray(saved)) {
        cart = saved.filter((i) => typeof i.id === 'string' && typeof i.name === 'string'
            && Number.isFinite(i.price) && Number.isInteger(i.qty) && i.qty > 0);
    }
} catch { cart = []; }

function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ }
}

function renderCart() {
    const count = cart.reduce((n, i) => n + i.qty, 0);
    const total = cart.reduce((n, i) => n + i.qty * i.price, 0);

    countEl.textContent = count;
    totalEl.textContent = money(total);
    drawer.classList.toggle('has-items', cart.length > 0);

    itemsEl.replaceChildren(...cart.map((item) => {
        const li = document.createElement('li');
        const make = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text) el.textContent = text; return el; };
        const info = make('div');
        info.append(make('div', 'name', item.name), make('div', 'unit', `${money(item.price)} / kg`));
        const line = make('div', 'line', money(item.price * item.qty));

        const qty = make('div', 'qty');
        const minus = make('button', '', '−'); minus.type = 'button'; minus.dataset.action = 'dec'; minus.setAttribute('aria-label', `Decrease ${item.name}`);
        const plus = make('button', '', '+'); plus.type = 'button'; plus.dataset.action = 'inc'; plus.setAttribute('aria-label', `Increase ${item.name}`);
        qty.append(minus, make('span', '', `${item.qty} kg`), plus);
        const remove = make('button', 'remove', 'Remove'); remove.type = 'button'; remove.dataset.action = 'remove';

        li.dataset.id = item.id;
        li.append(info, line, qty, remove);
        return li;
    }));

    if (cart.length) {
        const lines = cart.map((i) => `- ${i.qty} kg ${i.name} (${money(i.price * i.qty)})`).join('\n');
        const msg = `Hello Tropiko! I'd like to order:\n${lines}\nTotal: ${money(total)}`;
        checkout.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
        checkout.setAttribute('aria-disabled', 'false');
    } else {
        checkout.href = '#';
        checkout.setAttribute('aria-disabled', 'true');
    }
    saveCart();
}

let toastTimer;
function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000);
}

function addToCart({ id, name, price }) {
    const existing = cart.find((i) => i.id === id);
    if (existing) existing.qty += 1; else cart.push({ id, name, price, qty: 1 });
    renderCart();
    countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump');
    toast(`${name} added to cart`);
}

document.querySelectorAll('[data-add]').forEach((btn) =>
    btn.addEventListener('click', () => addToCart({ id: btn.dataset.id, name: btn.dataset.name, price: Number(btn.dataset.price) }))
);

itemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.closest('li').dataset.id;
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    if (btn.dataset.action === 'inc') item.qty += 1;
    if (btn.dataset.action === 'dec') item.qty -= 1;
    if (btn.dataset.action === 'remove' || item.qty < 1) cart = cart.filter((i) => i.id !== id);
    renderCart();
});

// open / close drawer
let lastFocused;
function openCart() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('show'));
    drawer.inert = false;
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    drawer.querySelector('.cart-close').focus();
}
function closeCart() {
    overlay.classList.remove('show');
    drawer.classList.remove('open');
    drawer.inert = true;
    document.body.style.overflow = '';
    setTimeout(() => { overlay.hidden = true; }, 300);
    if (lastFocused) lastFocused.focus();
}
document.querySelector('.cart-btn').addEventListener('click', openCart);
drawer.querySelector('.cart-close').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
checkout.addEventListener('click', (e) => { if (checkout.getAttribute('aria-disabled') === 'true') e.preventDefault(); });
document.addEventListener('keydown', (e) => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') closeCart();
    if (e.key === 'Tab') { // keep focus inside the drawer
        const f = [...drawer.querySelectorAll('button, a[href]')].filter((el) => el.getAttribute('aria-disabled') !== 'true');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
});

renderCart();