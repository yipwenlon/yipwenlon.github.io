/* ============================================
   文学性极简 · 求职作品集网站
   JavaScript 交互逻辑 (模块化)
   ============================================ */

(function () {
  'use strict';

  /* Force scroll to top on every page load — prevent browser from restoring position */
  window.scrollTo(0, 0);
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  /* Double-enforce: some browsers restore after a slight delay */
  window.addEventListener('beforeunload', () => { window.scrollTo(0, 0); });
  setTimeout(() => { window.scrollTo(0, 0); }, 0);

  /* ========== Loading Screen (打字机效果) ========== */
  const Loader = {
    init() {
      const loader = document.getElementById('loader');
      const loaderText = loader?.querySelector('.loader-text');
      if (!loader || !loaderText) return;

      const text = loaderText.getAttribute('data-text') || '叶 文 龙';
      let index = 0;

      loaderText.textContent = '';

      function typeNext() {
        if (index < text.length) {
          loaderText.textContent += text[index];
          index++;
          setTimeout(typeNext, 100 + Math.random() * 80);
        } else {
          setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            // After loader fades, reveal hero content
            setTimeout(() => {
              document.querySelector('.hero-content')?.classList.add('visible');
            }, 400);
          }, 600);
        }
      }

      setTimeout(typeNext, 300);
    }
  };

  /* ========== Navigation ========== */
  const Navigation = {
    init() {
      this.nav = document.getElementById('nav');
      this.menuBtn = document.querySelector('.nav-menu-btn');
      this.navLinks = document.querySelector('.nav-links');
      this.links = document.querySelectorAll('.nav-links a');
      this.sections = document.querySelectorAll('.section[id]');

      this.bindScroll();
      this.bindMenu();
      this.bindSmoothScroll();
    },

    bindScroll() {
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            // Sticky nav style
            if (window.scrollY > 60) {
              this.nav?.classList.add('scrolled');
            } else {
              this.nav?.classList.remove('scrolled');
            }

            // Active link tracking
            let currentId = '';
            this.sections.forEach((section) => {
              const rect = section.getBoundingClientRect();
              if (rect.top <= 120) {
                currentId = section.id;
              }
            });

            this.links.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
            });

            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
    },

    bindMenu() {
      this.menuBtn?.addEventListener('click', () => {
        this.navLinks?.classList.toggle('open');
      });

      // Close menu on link click
      this.links.forEach((link) => {
        link.addEventListener('click', () => {
          this.navLinks?.classList.remove('open');
        });
      });
    },

    bindSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            const offset = 60;
            const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
          }
        });
      });
    }
  };

  /* ========== Scroll Reveal (Intersection Observer) ========== */
  const Reveal = {
    init() {
      const elements = document.querySelectorAll('.reveal');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      elements.forEach((el) => observer.observe(el));
    }
  };

  /* ========== Photography Gallery ========== */
  const Photography = {
    currentIndex: 0,
    filteredItems: [],

    init() {
      this.gallery = document.getElementById('photo-gallery');
      this.lightbox = document.getElementById('lightbox');
      this.lightboxImg = document.getElementById('lightbox-img');
      this.lightboxCaption = document.getElementById('lightbox-caption');
      this.filters = document.querySelectorAll('.photo-filter');

      if (!this.gallery) return;

      this.items = [...this.gallery.querySelectorAll('.photo-item')];
      this.filteredItems = this.items.map((_, i) => i);
      this.currentIndex = 0;

      this.bindFilters();
      this.bindLightbox();
    },

    bindFilters() {
      this.filters.forEach((btn) => {
        btn.addEventListener('click', () => {
          this.filters.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const series = btn.getAttribute('data-filter');
          this.filteredItems = [];

          // Animate out first
          this.items.forEach((item) => {
            if (series !== 'all' && item.getAttribute('data-series') !== series) {
              item.classList.add('filtering-out');
            }
          });

          // After transition, hide and rebuild
          setTimeout(() => {
            this.items.forEach((item, i) => {
              item.classList.remove('filtering-out');
              if (series === 'all' || item.getAttribute('data-series') === series) {
                item.style.display = '';
                this.filteredItems.push(i);
              } else {
                item.style.display = 'none';
              }
            });
            this.currentIndex = 0;
          }, 350);
        });
      });
    },

    bindLightbox() {
      this.gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.photo-item');
        if (!item) return;

        const visibleIndex = this.filteredItems.indexOf(this.items.indexOf(item));
        if (visibleIndex >= 0) {
          this.currentIndex = visibleIndex;
          this.openLightbox();
        }
      });

      document.getElementById('lightbox-close')?.addEventListener('click', () => this.closeLightbox());
      document.getElementById('lightbox-prev')?.addEventListener('click', () => this.prevImage());
      document.getElementById('lightbox-next')?.addEventListener('click', () => this.nextImage());
      this.lightbox?.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });

      document.addEventListener('keydown', (e) => {
        if (!this.lightbox?.classList.contains('active')) return;
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.prevImage();
        if (e.key === 'ArrowRight') this.nextImage();
      });
    },

    openLightbox() {
      const realIndex = this.filteredItems[this.currentIndex];
      const item = this.items[realIndex];
      const img = item.querySelector('img');
      const title = item.querySelector('.photo-caption-title')?.textContent || '';
      const desc = item.querySelector('.photo-caption-desc')?.textContent || '';

      if (img) {
        this.lightboxImg.src = img.src;
        this.lightboxImg.alt = title;
      }
      this.lightboxCaption.textContent = `${title} — ${desc}`;
      this.lightbox?.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
      this.lightbox?.classList.remove('active');
      document.body.style.overflow = '';
    },

    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
      this.openLightbox();
    },

    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.filteredItems.length;
      this.openLightbox();
    }
  };

  /* ========== Script Tabs ========== */
  const Scripts = {
    init() {
      this.tabs = document.querySelectorAll('.script-tab');
      this.panels = document.querySelectorAll('.script-panel');

      this.tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const target = tab.getAttribute('data-script');
          this.tabs.forEach((t) => t.classList.remove('active'));
          this.panels.forEach((p) => p.classList.remove('active'));

          tab.classList.add('active');
          document.getElementById(`script-${target}`)?.classList.add('active');
        });
      });
    }
  };

  /* ========== Poetry Carousel + Theme Toggle ========== */
  const Poetry = {
    currentIndex: 0,
    poems: [],

    init() {
      this.display = document.getElementById('poem-display');
      this.counter = document.getElementById('poem-counter');
      this.themeToggle = document.getElementById('theme-toggle');

      if (!this.display) return;

      this.poems = JSON.parse(this.display.getAttribute('data-poems') || '[]');
      this.currentIndex = 0;
      this.renderPoem(false);

      document.getElementById('poem-prev')?.addEventListener('click', () => this.prev());
      document.getElementById('poem-next')?.addEventListener('click', () => this.next());

      this.themeToggle?.addEventListener('click', () => this.toggleTheme());

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && this.isVisible()) this.prev();
        if (e.key === 'ArrowRight' && this.isVisible()) this.next();
      });
    },

    isVisible() {
      const rect = document.getElementById('poetry')?.getBoundingClientRect();
      return rect && rect.top < window.innerHeight && rect.bottom > 0;
    },

    renderPoem(shouldScroll) {
      const poem = this.poems[this.currentIndex];
      if (!poem) return;

      this.display.style.opacity = '0';
      this.display.style.transform = 'translateY(20px)';

      setTimeout(() => {
        const hasMeta = poem.meta && poem.meta.trim();
        const isLongTitle = poem.title && poem.title.length > 10;
        const titleClass = isLongTitle ? 'poem-title poem-title-long' : 'poem-title';
        const linesHtml = poem.lines.map((l) => {
          if (l === '' || l.trim() === '') return '<p class="poem-line-break"></p>';
          return `<p>${l}</p>`;
        }).join('');

        this.display.innerHTML = `
          <h2 class="${titleClass}">${poem.title}</h2>
          <div class="poem-accent-dot"></div>
          <div class="poem-body">${linesHtml}</div>
          ${hasMeta ? `<div class="poem-divider"></div><p class="poem-meta">${poem.meta}</p>` : ''}
        `;
        this.display.style.opacity = '1';
        this.display.style.transform = 'translateY(0)';

        // Only scroll when user explicitly navigates (prev/next)
        if (shouldScroll) {
          this.display.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);

      if (this.counter) {
        this.counter.textContent = `${this.currentIndex + 1} / ${this.poems.length}`;
      }
    },

    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.poems.length) % this.poems.length;
      this.renderPoem(true);
    },

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.poems.length;
      this.renderPoem(true);
    },

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', current === 'dark' ? '' : 'dark');
    }
  };

  /* ========== Easter Egg ========== */
  const EasterEgg = {
    init() {
      this.trigger = document.getElementById('easter-egg-trigger');
      this.display = document.getElementById('easter-egg');
      this.closeBtn = document.getElementById('easter-egg-close');

      this.trigger?.addEventListener('click', () => {
        this.display?.classList.add('show');
        setTimeout(() => {
          this.display?.classList.remove('show');
        }, 6000);
      });

      this.closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.display?.classList.remove('show');
      });

      // Click outside to dismiss
      this.display?.addEventListener('click', (e) => {
        if (e.target === this.display) {
          this.display.classList.remove('show');
        }
      });
    }
  };

  /* ========== Image Lazy Loading ========== */
  const LazyLoad = {
    init() {
      if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading - just set attribute
        document.querySelectorAll('img[data-src]').forEach((img) => {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
        });
        return;
      }

      // Fallback for browsers without native support
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.getAttribute('data-src');
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: '200px' }
      );

      document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
    }
  };

  /* ========== Reading Progress Bar ========== */
  const ProgressBar = {
    init() {
      const bar = document.createElement('div');
      bar.id = 'progress-bar';
      document.body.prepend(bar);
      this.bar = bar;

      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        this.bar.style.width = `${Math.min(100, progress)}%`;
      }, { passive: true });
    }
  };

  /* ========== Back to Top Button ========== */
  const BackToTop = {
    init() {
      const btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.setAttribute('aria-label', '回到顶部');
      document.body.appendChild(btn);
      this.btn = btn;

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      window.addEventListener('scroll', () => {
        const heroBottom = document.getElementById('hero')?.getBoundingClientRect().bottom || 0;
        if (heroBottom < 0) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      }, { passive: true });
    }
  };

  /* ========== AI Video Modal (B 站播放) ========== */
  const AIVideo = {
    init() {
      this.grid = document.getElementById('ai-video-grid');
      this.modal = document.getElementById('video-modal');
      this.frame = document.getElementById('video-modal-frame');
      this.caption = document.getElementById('video-modal-caption');

      if (!this.grid || !this.modal) return;

      this.grid.addEventListener('click', (e) => {
        const card = e.target.closest('.ai-video-card');
        if (card) this.open(card);
      });

      document.getElementById('video-modal-close')?.addEventListener('click', () => this.close());

      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (!this.modal.classList.contains('active')) return;
        if (e.key === 'Escape') this.close();
      });
    },

    open(card) {
      const src = card.getAttribute('data-src');
      const bvid = card.getAttribute('data-bvid');
      if (!src && !bvid) return;

      const title = card.querySelector('.ai-video-title')?.textContent.trim() || '';
      const meta = card.querySelector('.ai-video-meta')?.textContent.trim() || '';

      /* 播放器只在点击时才注入：
         1) 首屏不加载视频，页面更快
         2) 关闭时会清空，彻底停掉播放与声音 */
      if (src) {
        /* 本地视频：原画质直出，不经过任何平台的二次转码 */
        const poster = card.getAttribute('data-poster');
        const posterAttr = poster ? ' poster="' + poster + '"' : '';
        this.frame.innerHTML =
          '<video src="' + src + '"' + posterAttr +
          ' controls autoplay playsinline preload="metadata"></video>';

        /* 显式触发播放：放在同步流程里，让浏览器把它关联到这次点击手势，
           提高「带声音自动播放」的成功率。被拦截时静默失败，
           原生控件仍在，用户可手动播放。 */
        const video = this.frame.querySelector('video');
        if (video) {
          const p = video.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        }
      } else {
        /* B 站嵌入（备用方案：未登录访问会被平台限制清晰度） */
        this.frame.innerHTML =
          `<iframe src="https://player.bilibili.com/player.html?bvid=${bvid}` +
          `&page=1&high_quality=1&danmaku=0&autoplay=1"` +
          ` scrolling="no" frameborder="0" framespacing="0"` +
          ` allow="autoplay; fullscreen" allowfullscreen="true"></iframe>`;
      }

      this.caption.textContent = meta ? `${title} · ${meta}` : title;
      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.frame.innerHTML = '';
    }
  };

  /* ========== Init All Modules ========== */
  document.addEventListener('DOMContentLoaded', () => {
    Loader.init();
    Navigation.init();
    Reveal.init();
    Photography.init();
    AIVideo.init();
    Scripts.init();
    Poetry.init();
    EasterEgg.init();
    LazyLoad.init();
    ProgressBar.init();
    BackToTop.init();
  });

})();
