// ─── Navigation scroll behavior ──────────────
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      nav.classList.toggle('scrolled', scrollY > 60);
      lastScroll = scrollY;
    }, { passive: true });

    // ─── Hamburger / Mobile Menu ─────────────────
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu   = document.getElementById('mobile-menu');
    let menuOpen = false;

    hamburgerBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      hamburgerBtn.classList.toggle('open', menuOpen);
      mobileMenu.classList.toggle('open', menuOpen);
      hamburgerBtn.setAttribute('aria-expanded', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        hamburgerBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    // ─── Hero parallax watermark ─────────────────
    const watermark = document.getElementById('hero-watermark');
    window.addEventListener('scroll', () => {
      if (watermark) {
        const offset = window.scrollY * 0.35;
        watermark.style.transform = `translateY(calc(-50% + ${offset}px))`;
      }
    }, { passive: true });

    // ─── Scroll reveal ────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ─── Counter animation for stats ─────────────
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 1800;
          const startTime = performance.now();

          const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(eased * target);
            el.textContent = prefix + value + suffix;
            if (progress < 1) requestAnimationFrame(update);
          };

          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

    // ─── Filter buttons ───────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        productCards.forEach(card => {
          const cat = card.dataset.category;
          const show = filter === 'all' || cat === filter;
          card.style.transition = 'opacity 0.35s, transform 0.35s';
          card.style.opacity = show ? '1' : '0.2';
          card.style.pointerEvents = show ? 'auto' : 'none';
          card.style.transform = show ? '' : 'scale(0.97)';
        });
      });
    });

    // ─── Add to cart ──────────────────────────────
    let cartCount = 2;

    function addToCart(productName) {
      cartCount++;
      document.querySelector('.cart-badge').textContent = cartCount;
      showToast(`"${productName}" sepete eklendi.`);
    }

    // ─── Toast ────────────────────────────────────
    let toastTimer;
    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ─── Order Form Submit ────────────────────────
    const orderForm    = document.getElementById('order-form');
    const formSuccess  = document.getElementById('form-success');

    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name  = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!name || !email) {
        showToast('Lütfen ad ve e-posta alanlarını doldurun.');
        return;
      }

      // Simulate API call
      const submitBtn = orderForm.querySelector('[type="submit"]');
      submitBtn.textContent = 'Gönderiliyor...';
      submitBtn.disabled = true;

      setTimeout(() => {
        orderForm.style.display = 'none';
        formSuccess.classList.add('visible');
        showToast('Formunuz başarıyla alındı!');
      }, 1200);
    });

    // ─── Early Access ─────────────────────────────
    function subscribeEarlyAccess() {
      const input = document.getElementById('access-email');
      const email = input.value.trim();
      if (!email || !email.includes('@')) {
        showToast('Geçerli bir e-posta adresi girin.');
        return;
      }
      input.value = '';
      showToast('Erken erişim listenize eklendi! 🎉');
    }

    // Allow Enter key on access form
    document.getElementById('access-email').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') subscribeEarlyAccess();
    });

    // ─── Smooth scroll for anchor links ──────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // ─── Active nav link on scroll ────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(section => sectionObserver.observe(section));