document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-slider');
  if (hero) {
    const slides = hero.dataset.slides.split(',');
    let currentSlide = Number(hero.dataset.start) || 0;
    const setHeroImage = (image) => {
      hero.style.setProperty('--hero-image', `url("${new URL(image, document.baseURI).href}")`);
    };
    setHeroImage(slides[currentSlide]);
    window.setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      hero.classList.add('is-changing');
      window.setTimeout(() => {
        setHeroImage(slides[currentSlide]);
        hero.classList.remove('is-changing');
      }, 350);
    }, 5000);
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const siteMenu = document.querySelector('#site-menu');
  menuToggle?.addEventListener('click', () => {
    const isOpen = siteMenu.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  siteMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteMenu.classList.remove('is-open');
      menuToggle?.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const modalBackdrop = document.querySelector('.modal-backdrop');
  const cartItems = document.querySelector('.cart-items');
  const totalAmount = document.querySelector('.total-amount');
  const cartCount = document.querySelector('.cart-count');
  const cart = [];

  const renderCart = () => {
    if (!cartItems || !totalAmount) return;
    cartItems.innerHTML = cart.length
      ? cart.map((item, index) => `<div class="cart-item"><span>${item.name}</span><strong>$${item.price.toFixed(2)}</strong><button type="button" data-remove="${index}" aria-label="Eliminar ${item.name}">×</button></div>`).join('')
      : '<p class="empty-cart">Tu carrito está vacío. Elige una causa para empezar.</p>';
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalAmount.textContent = total.toFixed(2);
    if (cartCount) cartCount.textContent = cart.length;
  };

  const openCart = () => {
    if (!modalBackdrop) return;
    renderCart();
    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
  };
  const closeCart = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      cart.push({ name: button.dataset.name, price: Number(button.dataset.price) });
      openCart();
    });
  });
  document.querySelector('.cart-trigger')?.addEventListener('click', openCart);
  document.querySelector('.modal-close')?.addEventListener('click', closeCart);
  modalBackdrop?.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) closeCart();
    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) {
      cart.splice(Number(removeButton.dataset.remove), 1);
      renderCart();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeCart();
  });
  document.querySelector('.pay-button')?.addEventListener('click', () => {
    const message = document.querySelector('.payment-message');
    if (!cart.length) {
      message.textContent = 'Añade un producto antes de pagar.';
      message.classList.remove('success');
      return;
    }
    message.textContent = '¡Transacción realizada con éxito! Gracias por apoyar al océano.';
    message.classList.add('success');
  });

  document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = document.querySelector('.form-message');
    message.textContent = 'Mensaje enviado correctamente';
    message.classList.add('is-visible');
    event.currentTarget.reset();
  });
});
