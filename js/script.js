
      /* ===== ИСПРАВЛЕНИЕ ОШИБКИ (Практика) + Вызов поп-апа ===== */
      function getSpecialOffer() {
        const overlay = document.getElementById("promoPopupOverlay");
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("popup-open");
        document.getElementById("promoPopupOk").focus();
      }

      (function () {
        try {
          const header = document.getElementById("siteHeader");
        const burger = document.getElementById("burger");
        const menu = document.getElementById("mobileMenu");
        const menuClose = document.getElementById("menuClose");
        const overlay = document.getElementById("menuOverlay");

        /* ===== Header hide / show on scroll ===== */
        let lastY = window.scrollY;
        window.addEventListener(
          "scroll",
          function () {
            const y = window.scrollY;
            const diff = y - lastY;
            if (diff < -2) {
              header.classList.remove("is-hidden");
            } else if (diff > 4 && y > 100) {
              header.classList.add("is-hidden");
            }
            if (y > 10) {
              header.classList.add("is-scrolled");
            } else {
              header.classList.remove("is-scrolled");
            }
            lastY = y;
          },
          { passive: true },
        );

        /* ===== Mobile menu ===== */
        function openMenu() {
          header.classList.remove("is-hidden");
          menu.classList.add("is-open");
          overlay.classList.add("is-open");
          burger.setAttribute("aria-expanded", "true");
          menu.setAttribute("aria-hidden", "false");
          document.body.classList.add("menu-open");
        }

        function closeMenu() {
          menu.classList.remove("is-open");
          overlay.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
          menu.setAttribute("aria-hidden", "true");
          document.body.classList.remove("menu-open");
        }

        burger.addEventListener("click", openMenu);
        menuClose.addEventListener("click", closeMenu);
        overlay.addEventListener("click", closeMenu);

        menu.querySelectorAll("a").forEach(function (link) {
          link.addEventListener("click", closeMenu);
        });

        /* ===== Gallery slider ===== */
        const track = document.getElementById("galleryTrack");
        const slides = Array.prototype.slice.call(track.children);
        const prevBtn = document.getElementById("galleryPrev");
        const nextBtn = document.getElementById("galleryNext");
        const dotsWrap = document.getElementById("galleryDots");

        let gIndex = 0;
        let lastPerView = 0;

        function perView() {
          return window.matchMedia("(max-width: 768px)").matches ? 1 : 2;
        }
        function stepSize() {
          return perView();
        }
        function maxIndex() {
          return Math.max(0, slides.length - perView());
        }
        function pageCount() {
          return Math.floor(maxIndex() / stepSize()) + 1;
        }

        function buildDots() {
          dotsWrap.innerHTML = "";
          const total = pageCount();
          for (let i = 0; i < total; i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "gallery-dot";
            dot.setAttribute("aria-label", "Страница галереи " + (i + 1));
            dot.addEventListener(
              "click",
              (function (idx) {
                return function () {
                  gIndex = Math.min(idx * stepSize(), maxIndex());
                  render(true);
                };
              })(i),
            );
            dotsWrap.appendChild(dot);
          }
        }

        function render(animate) {
          if (!slides.length) return;
          const gapStyle = getComputedStyle(track).gap;
          const gap = parseFloat(gapStyle) || 16;
          const step = slides[0].getBoundingClientRect().width + gap;

          if (animate === false) {
            track.style.transition = "none";
          } else {
            track.style.transition = "";
          }

          track.style.transform = "translateX(" + -gIndex * step + "px)";

          if (animate === false) {
            void track.offsetHeight;
            track.style.transition = "";
          }

          prevBtn.disabled = gIndex <= 0;
          nextBtn.disabled = gIndex >= maxIndex();

          const activeDot = Math.round(gIndex / stepSize());
          Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
            dot.classList.toggle("is-active", i === activeDot);
          });
        }

        prevBtn.addEventListener("click", function () {
          if (gIndex > 0) {
            gIndex = Math.max(0, gIndex - stepSize());
            render(true);
          }
        });

        nextBtn.addEventListener("click", function () {
          if (gIndex < maxIndex()) {
            gIndex = Math.min(maxIndex(), gIndex + stepSize());
            render(true);
          }
        });

        let touchStartX = null;
        track.addEventListener(
          "touchstart",
          function (e) {
            touchStartX = e.touches[0].clientX;
          },
          { passive: true },
        );
        track.addEventListener(
          "touchend",
          function (e) {
            if (touchStartX === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(delta) > 40) {
              if (delta < 0 && gIndex < maxIndex()) {
                gIndex = Math.min(maxIndex(), gIndex + stepSize());
              } else if (delta > 0 && gIndex > 0) {
                gIndex = Math.max(0, gIndex - stepSize());
              }
              render(true);
            }
            touchStartX = null;
          },
          { passive: true },
        );

        let resizeTimer;
        window.addEventListener("resize", function () {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            const pv = perView();
            if (pv !== lastPerView) {
              lastPerView = pv;
              gIndex = 0;
              buildDots();
            }
            gIndex = Math.min(gIndex, maxIndex());
            render(false);
          }, 120);
        });

        lastPerView = perView();
        buildDots();
        render(false);

        /* ===== POPUPS ===== */
        const popupOverlay = document.getElementById("popupOverlay");
        const popupClose = document.getElementById("popupClose");
        const popupOk = document.getElementById("popupOk");

        const promoPopupOverlay = document.getElementById("promoPopupOverlay");
        const promoPopupClose = document.getElementById("promoPopupClose");
        const promoPopupOk = document.getElementById("promoPopupOk");
        const demoPopupOverlay = document.getElementById("demoPopupOverlay");
        const demoPopupClose = document.getElementById("demoPopupClose");
        const demoPopupOk = document.getElementById("demoPopupOk");

        // Открытие поп-апа по клику на иконку MAX
        document.querySelectorAll(".js-demo-link").forEach(function (link) {
          link.addEventListener("click", function (e) {
            e.preventDefault();
            openPopup(demoPopupOverlay, demoPopupOk);
          });
        });

        // Закрытие поп-апа демонстрационного сайта
        demoPopupClose.addEventListener("click", function () {
          closePopup(demoPopupOverlay);
        });
        demoPopupOk.addEventListener("click", function () {
          closePopup(demoPopupOverlay);
        });
        demoPopupOverlay.addEventListener("click", function (e) {
          if (e.target === demoPopupOverlay) closePopup(demoPopupOverlay);
        });


        let lastFocused = null;

        function openPopup(overlayEl, focusEl) {
          lastFocused = document.activeElement;
          overlayEl.classList.add("is-open");
          overlayEl.setAttribute("aria-hidden", "false");
          document.body.classList.add("popup-open");
          focusEl.focus();
        }

        function closePopup(overlayEl) {
          overlayEl.classList.remove("is-open");
          overlayEl.setAttribute("aria-hidden", "true");
          if (
            !document.querySelector(".popup-overlay.is-open") &&
            !document.getElementById("lightbox").classList.contains("is-open")
          ) {
            document.body.classList.remove("popup-open");
          }
          if (lastFocused && typeof lastFocused.focus === "function") {
            lastFocused.focus();
          }
        }

        // Закрытие обычного поп-апа
        popupClose.addEventListener("click", function () {
          closePopup(popupOverlay);
        });
        popupOk.addEventListener("click", function () {
          closePopup(popupOverlay);
        });
        popupOverlay.addEventListener("click", function (e) {
          if (e.target === popupOverlay) closePopup(popupOverlay);
        });

        // Закрытие поп-апа спецпредложения
        promoPopupClose.addEventListener("click", function () {
          closePopup(promoPopupOverlay);
        });
        promoPopupOk.addEventListener("click", function () {
          closePopup(promoPopupOverlay);
        });
        promoPopupOverlay.addEventListener("click", function (e) {
          if (e.target === promoPopupOverlay) closePopup(promoPopupOverlay);
        });

        /* ===== LIGHTBOX ===== */
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightboxImg");
        const lightboxClose = document.getElementById("lightboxClose");

        slides.forEach(function (slide) {
          slide.addEventListener("click", function () {
            const img = this.querySelector("img");
            if (img) {
              lightboxImg.src = img.src;
              lightbox.classList.add("is-open");
              lightbox.setAttribute("aria-hidden", "false");
              document.body.classList.add("popup-open");
              lightboxClose.focus();
            }
          });
        });

        function closeLightbox() {
          lightbox.classList.remove("is-open");
          lightbox.setAttribute("aria-hidden", "true");
          setTimeout(function () {
            lightboxImg.src = "";
          }, 300);
          if (!document.querySelector(".popup-overlay.is-open")) {
            document.body.classList.remove("popup-open");
          }
        }

        lightboxClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", function (e) {
          if (e.target === lightbox) closeLightbox();
        });

        /* ESC закрывает всё */
        document.addEventListener("keydown", function (e) {
          if (e.key !== "Escape") return;
          if (lightbox.classList.contains("is-open")) {
            closeLightbox();
          } else if (promoPopupOverlay.classList.contains("is-open")) {
            closePopup(promoPopupOverlay);
          } else if (demoPopupOverlay.classList.contains("is-open")) {
            closePopup(demoPopupOverlay);
          } else if (popupOverlay.classList.contains("is-open")) {
            closePopup(popupOverlay);
          } else {
            closeMenu();
          }
        });

        /* ===== Delivery cards alignment ===== */
        const deliveryHead = document.querySelector(".delivery-head");
        const deliveryCardsAlign = document.querySelector(".delivery-cards");
        if (deliveryHead && deliveryCardsAlign) {
          function alignDeliveryCards() {
            if (window.matchMedia("(max-width: 900px)").matches) {
              // На мобильных/планшетах карточки идут под фото — отступ не нужен
              deliveryCardsAlign.style.marginTop = "0px";
              // Фиксация карточек за фото: top = верхний край фото
              const headStyle = window.getComputedStyle(deliveryHead);
              const marginBottom = parseFloat(headStyle.marginBottom) || 0;
              const photoTop = 62 + 24 + deliveryHead.offsetHeight + marginBottom;
              document.querySelectorAll(".delivery-card").forEach(function (card) {
                card.style.position = "sticky";
                card.style.top = photoTop + "px";
                card.style.zIndex = "1";
              });
              return;
            }
            // На десктопе сбрасываем возможные инлайн-стили от мобильного режима
            document.querySelectorAll(".delivery-card").forEach(function (card) {
              card.style.position = "";
              card.style.top = "";
              card.style.zIndex = "";
            });
            const headStyle = window.getComputedStyle(deliveryHead);
            const marginBottom = parseFloat(headStyle.marginBottom) || 0;
            deliveryCardsAlign.style.marginTop = (deliveryHead.offsetHeight + marginBottom) + "px";
          }
          alignDeliveryCards();
          window.addEventListener("resize", alignDeliveryCards);
        }
/* ===== Form validation & submit ===== */

        /* ===== Form validation & submit ===== */
        const form = document.getElementById("contactForm");

        form.addEventListener("submit", function (e) {
          e.preventDefault();

          const name = form.querySelector("#name");
          const phone = form.querySelector("#phone");
          const consent = form.querySelector("#consent");
          let valid = true;

          [name, phone].forEach(function (field) {
            if (!field.value.trim()) {
              field.classList.add("is-invalid");
              valid = false;
            } else {
              field.classList.remove("is-invalid");
            }
          });

          if (!consent.checked) {
            valid = false;
            consent.parentElement.classList.add("is-invalid");
          } else {
            consent.parentElement.classList.remove("is-invalid");
          }

          if (!valid) return;

          form.reset();
          openPopup(popupOverlay, popupOk);
        });

        /* ===== Очистка инлайн-стилей карточек доставки (на случай старых) ===== */
        document.querySelectorAll(".delivery-card").forEach(function (card) {
          card.style.opacity = "";
          card.style.visibility = "";
          card.style.transform = "";
        });

        /* ===== Smooth scroll ===== */
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
          link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
        });
        } catch (e) {
          console.warn("Script initialization skipped on this page:", e.message);
        }
      })();
  