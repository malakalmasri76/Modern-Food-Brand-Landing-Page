# Tropiko – Fresh Fruits Shop

A responsive landing page for a small fruit shop, with a working cart and WhatsApp ordering.

**Live demo:** _add your link here after deploying_

## About this project
I rebuilt this page from a template design to practice front-end fundamentals, then extended it with my own features. The layout was reworked to be fully responsive, and everything interactive was written from scratch in plain JavaScript (no frameworks).

## Features
- Responsive layout (desktop, tablet, mobile) with an accessible hamburger menu
- Shopping cart saved in `localStorage`, with quantity controls and a running total
- Checkout that opens WhatsApp with the order already written
- Scroll animations, hover effects, and a testimonial slider (all respect `prefers-reduced-motion`)
- Sticky navbar that highlights the current section
- FAQ accordion built with native `<details>` elements
- Semantic HTML, keyboard focus styles, and ARIA labels

## Tech
HTML5, CSS3 (Grid, Flexbox, custom properties), vanilla JavaScript (ES6+)

## Run locally
Open `index.html` in a browser, or use any static server:

```bash
npx serve .
```

## Before you use it
- Set your own number in `js/script.js` (`WHATSAPP_NUMBER`)
- Replace the placeholder prices, testimonials, and contact details
- The contact and subscribe forms are front-end only; connect them to a service like Formspree to receive messages

## Structure
```
index.html
css/mystyle.css
js/script.js
img/
```