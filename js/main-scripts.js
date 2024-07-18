const ready = (callback) => {
  if (document.readyState !== "loading") callback()
  else document.addEventListener("DOMContentLoaded", callback)
}

class Site {
  /**
   * Функция инициализации слайдера Splide
   * @param {String|Object} slider Селектор или объект слайдера 
   * @param {*} options Опции для слайдера
   * @param {*} syncSlider Слайдер для синхронизации
   * @returns {Object} Splide слайдер
   */
  static initSplide(slider, options, syncSlider = null) {
    if (typeof slider === "string")
      slider = document.querySelector(slider)

    if (!slider) return

    slider = new Splide(slider, options)

    if (syncSlider)
      slider.sync(syncSlider)

    return slider
  }

  /**
   * Функция инициализации gLightBox
   */
  static initGlightbox() {
    try {
      let glightbox = GLightbox({
        touchNavigation: true,
        loop: false,
        autoplayVideos: true
      });
      return true;
    } catch {
      return false
    }
  }

  static initAccordeon() {
    let parents = document.querySelectorAll("*[data-accordion-parent]")
    if (parents) {
      parents.forEach((parent) => {
        let togglers = parent.querySelectorAll("*[data-accordion-toggler]")

        togglers.forEach((toggler) => {
          let card = toggler.closest(`${toggler.dataset.accordionToggler}`)
          let body = card.querySelector("*[data-accordion-body]")
          if (toggler.classList.contains("--is_initialized")) return
          toggler.classList.add("--is_initialized")

          toggler.addEventListener("click", (e) => {
            e.preventDefault()

            if (!card.classList.contains("--is_active")) {
              card.classList.add("--is_active")
              toggler.classList.add("--is_active")
              body.style.maxHeight = `${body.scrollHeight}px`
            } else {
              card.classList.remove("--is_active")
              toggler.classList.remove("--is_active")
              body.style.maxHeight = `${body.scrollHeight}px`
              setTimeout(() => {
                body.style.maxHeight = '0px'
              }, 1)
            }
          })

          body.addEventListener("transitionend", (e) => {
            if (card.classList.contains("--is_active")) {
              body.style.maxHeight = 'none'
            }
          })
        })
      })
    }
  }

  static initInputmasks() {
    let inputsPhone = document.querySelectorAll("input[data-maskphone]")
    if (inputsPhone)
      inputsPhone.forEach((input) => {
        let mask = new Inputmask("+7 (999) 999-99-99")
        mask.mask(input)
      })
    let inputsEmail = document.querySelectorAll("input[data-maskemail]")
    if (inputsEmail)
      inputsEmail.forEach((input) => {
        let mask = new Inputmask({
          mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
          greedy: false,
          onBeforePaste: function (pastedValue, opts) {
            pastedValue = pastedValue.toLowerCase();
            return pastedValue.replace("mailto:", "");
          },
          definitions: {
            '*': {
              validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
              casing: "lower"
            }
          }
        })
        mask.mask(input)
      })
  }
  static initModals(selector) {
    let btns = document.querySelectorAll(selector);
    if (btns && typeof btns !== false) {
      btns.forEach(btn => {
        btn.addEventListener('click', event => {
          event.preventDefault();
          let mdl_target = btn.getAttribute('data-modal');
          if (mdl_target != null) {
            let goal = btn.dataset.modalGoal
            mdl_target = document.querySelector(mdl_target);

            if (goal) {
              let goalInput = mdl_target.querySelector('input[data-modal-field-hidden="goal"]')
              if (goalInput)
                goalInput.value = goal
            }

            mdl_target.classList.add('--is_show');
            mdl_target.classList.remove('--is_fade');
            document.documentElement.classList.add('--modal_showed')
          }
        });
      });
    }
    let mdl_close = document.querySelectorAll('*[data-modal-close]');
    if (mdl_close && typeof mdl_close !== false) {
      mdl_close.forEach(mlc => {
        mlc.addEventListener('click', e => {
          e.preventDefault();
          let _mdl = mlc.closest('.modal');

          let _mdls = document.querySelectorAll('.modal.--is_show')

          if (_mdls.length < 2)
            document.documentElement.classList.remove('--modal_showed')

          _mdl.classList.remove('--is_show');
          _mdl.classList.add('--is_fade');

        });
      });
    }
    document.body.addEventListener('click', event => {
      let el = event ? event.target : window.event.srcElement;
      if (el.classList.contains('modal') && el.classList.contains('--is_show')) {
        el.classList.remove('--is_show')
        el.classList.add('--is_fade')

        let swd_mdls = document.querySelectorAll('.modal.--is_show');
        if (swd_mdls.length < 2)
          document.documentElement.classList.remove('--modal_showed')
      }
    });
  }

  static initSearch() {
    let searchBtn = document.querySelector('.search__toggler');
    let controls = document.querySelector(`#${searchBtn.getAttribute('aria-controls')}`);
    let nav = document.querySelector(`#${searchBtn.getAttribute('aria-selected')}`);

    if (!searchBtn) return;
    if (!controls) return;
    searchBtn.addEventListener('click', (e) => {
      let expanded = searchBtn.getAttribute('aria-expanded') === 'true' || false;
      searchBtn.setAttribute('aria-expanded', !expanded);
      searchBtn.classList.toggle('search__toggler--open');
      controls.classList.toggle('search__form--open');

      if (window.innerWidth <= 1440) {
        nav.classList.toggle('nav--search');
      }
    })
  }

  static initHeaderMove() {
    // Function for check and transform header
    const slicky = function (header, main, padding) {
      let currentScrollPos = window.pageYOffset;
      if (window.scrollY > 70) {
        // main.style.paddingTop = padding + "px";
        header.classList.add("--is_fixed");
      } else {
        // main.style.paddingTop = `0px`;
        header.classList.remove("--is_fixed");
      }
      // if (window.location.pathname != "/" && window.scrollY < 90) {
      // header.classList.add("--is_fixed");
      // }
      prevScrollPos = currentScrollPos;
    };

    // Main Element
    let header = document.querySelector(".header");

    // Set height variable
    // header.style.cssText = `--headerHeight: ${header.scrollHeight}px`;

    // Check header
    if (!header) return;

    // Set header height on Main tag for padding in other pages
    let mainTag = document.querySelector(".main");
    // if (window.location.pathname != "/")
    // mainTag.style.setProperty("--hHeight", `${header.offsetHeight}px`);

    let padding = 0;
    setTimeout(() => {
      padding = header.offsetHeight;
    }, 200);
    window.addEventListener("resize", function () {
      padding = header.offsetHeight;
    });

    // Set prev position
    let prevScrollPos = window.pageYOffset;

    // Active first time function
    slicky(header, mainTag, padding);

    //Events
    window.addEventListener("scroll", function () {
      if (window.innerWidth < 1025)
        slicky(header, mainTag, padding)
      else {
        header.classList.remove('--is_fixed')
        // mainTag.style.paddingTop = `0px`;
      }
    });
  }

  static initToggleText(selector) {
    let buttons = document.querySelectorAll(selector);
    if (!buttons) return
    buttons.forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        btn.classList.toggle("--is_active");
        let tabBody = document.querySelector(btn.getAttribute("data-target-block"));
        if (!tabBody) return
        if (tabBody.style.maxHeight) {
          tabBody.style.maxHeight = null;
          tabBody.classList.remove("--is_open");
          if (btn.querySelector("p"))
            btn.querySelector("p").textContent = "Читать далее";
          else
            btn.textContent = "Раскрыть"

        } else {
          tabBody.classList.add("--is_open");
          tabBody.style.maxHeight = `${tabBody.scrollHeight}px`;
          if (btn.querySelector("p"))
            btn.querySelector("p").textContent = "Скрыть";
          else
            btn.textContent = "Скрыть"
        }
      });
    });
  }

  static initLazyLoadImages() {
    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(function (entry) {
        if (entry.intersectionRatio > 0 || entry.isIntersecting) {
          const image = entry.target;
          observer.unobserve(image);
          if (image.hasAttribute("src")) {
            // Image has been loaded already
            return;
          }

          // Image has not been loaded so load it
          const sourceUrl = image.getAttribute("data-src");
          image.setAttribute("src", sourceUrl);
          image.onload = () => {
            // Do stuff
          };

          // Removing the observer
          observer.unobserve(image);
        }
      });
    });
    document.querySelectorAll(".lazyload").forEach(el => {
      observer.observe(el);
    });
  }

  static initToggleTabs(tab = "") {
    if (!tab) {
      let tabs = document.querySelectorAll("*[data-tab-toggle]");
      if (!tabs) return
      tabs.forEach(tab => {
        let tabsParent = tab.closest("*[data-tab-container]");
        let targetTab = tabsParent.querySelector(tab.dataset.tabToggle)
        if (!targetTab) return
        setTimeout(() => {
          targetTab.style.setProperty("--height", `${targetTab.scrollHeight}px`)
        }, 300)
        tab.addEventListener("click", e => {
          e.preventDefault();
          tabs.forEach(_tab => {
            _tab.classList.remove("--is_active");
            let _tar = tabsParent.querySelector(_tab.dataset.tabToggle)
            if (_tar)
              _tar.classList.remove("--is_active");
          });
          tab.classList.add("--is_active");
          targetTab.style.setProperty("--height", `${targetTab.scrollHeight}px`)
          targetTab.classList.add("--is_active");
        });
      });
    } else {
      let tabToggler = document.querySelector(`*[data-tab-toggle="${tab}"]`)
      tab = document.querySelector(tab)
      if (!tab) return
      if (!tabToggler) return
      let tabsParent = tab.closest('*[data-tab-container]')
      if (!tabsParent) return

      let tabs = tabsParent.querySelectorAll('*[data-tab-toggle]')
      if (!tabs) return
      tabs.forEach(_tab => {
        _tab.classList.remove("--is_active");
        let _tar = tabsParent.querySelector(_tab.dataset.tabToggle)
        if (_tar)
          _tar.classList.remove("--is_active");
      });

      tab.style.setProperty("--height", `${tab.scrollHeight}px`)
      tabToggler.classList.add("--is_active")
      tab.classList.add("--is_active")
    }
  }

  static initMobileNav() {
    let navBtn = document.querySelector('.nav__toggler');
    if (!navBtn) return;
    let controls = document.querySelector(`#${navBtn.getAttribute('aria-controls')}`);
    if (!controls) return;
    navBtn.addEventListener('click', (e) => {
      let expanded = navBtn.getAttribute('aria-expanded') === 'true' || false;
      navBtn.setAttribute('aria-expanded', !expanded);
      navBtn.classList.toggle('nav__toggler--open');
      controls.classList.toggle('nav--open');
    })
  }

  static initFilterMobile() {
    let filterToggle = document.querySelector('.catalog__filter-toggle');
    let filterClose = document.querySelector('.catalog__filter-close');
    if (!filterToggle) return;
    if (!filterClose) return;
    let controls = document.querySelector(`#${filterToggle.getAttribute('aria-controls')}`);
    let html = document.documentElement
    if (!controls) return;
    filterToggle.addEventListener('click', (e) => {
      let expanded = filterToggle.getAttribute('aria-expanded') === 'true' || false;
      filterToggle.setAttribute('aria-expanded', !expanded);
      filterToggle.classList.toggle('catalog__filter-toggle--open');
      controls.classList.toggle('catalog__aside--open');
      filterClose.setAttribute('aria-expanded', !expanded);
      filterClose.classList.toggle('catalog__filter-toggle--open');
      html.classList.toggle('filter--open')
    })
    filterClose.addEventListener('click', (e) => {
      let expanded = filterClose.getAttribute('aria-expanded') === 'true' || false;
      filterClose.setAttribute('aria-expanded', !expanded);
      filterClose.classList.toggle('catalog__filter-toggle--open');
      controls.classList.toggle('catalog__aside--open');
      filterToggle.setAttribute('aria-expanded', !expanded);
      filterToggle.classList.toggle('catalog__filter-toggle--open');
      html.classList.toggle('filter--open')
    })
  }

  static initCatalogMode(mode = "") {
    let buttons = document.querySelectorAll('*[data-catalog-items-mode^="mode"]')
    if (!buttons) return
    let container = document.querySelector('*[data-catalog-items-mode="container"]')
    if (!container) return

    if (!mode) {
      buttons.forEach((button) => {
        let mode = button.dataset.catalogItemsMode.split("::").pop()
        if (!mode) return
        button.addEventListener("click", (e) => {
          e.preventDefault()
          container.classList.remove(...[...container.classList].filter(n => n.indexOf('_mode') != -1))
          let count = Number.parseInt(button.dataset.catalogItemsMode.split("::")[1])
          let classMode = `--${mode}_mode`
          if (!isNaN(count))
            classMode += "-" + count
          buttons.forEach((_button) => _button.classList.remove('--is_active'))
          container.classList.add(classMode)
          button.classList.add("--is_active")
        })
      })
    }

    if (mode) {
      mode = mode.split("::")
      buttons.forEach((button) => {
        button.classList.remove("--is_active")
        if (button.dataset.catalogItemsMode.indexOf(mode) != -1) {
          button.classList.add("--is_active")
        }
      })
      container.classList.remove(...[...container.classList].filter(n => n.indexOf('_mode') != -1))
      let classMode = `--${mode[0]}_mode`
      if (mode.length > 1)
        classMode += "-" + mode[1]
      container.classList.add(classMode)
    }
  }

  static initSelectTrigger() {
    let selects = document.querySelectorAll('*[data-select-trigger="select"]')
    if (!selects) return
    selects.forEach((select) => {
      let options = select.querySelectorAll('*[data-select-trigger="option"]')
      if (!options) return
      options.forEach((option) => {
        option.addEventListener("click", () => {
          if (!option.value) return
          window.location = option.value
        })
      })
    })
  }

  static initAnchorTab() {
    let elements = document.querySelectorAll('*[data-anchor]');
    if (elements && typeof elements) {
      elements.forEach(el => {
        el.addEventListener('click', e => {
          e.preventDefault();
          let altLink = el.dataset.anchorAltLink
          let target = document.querySelector(el.dataset.anchor);
          if (altLink && window.location.pathname != altLink) {
            window.location.href = altLink + el.dataset.anchor
          } else {
            if (!target) return;
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });

            let tabTarget = el.dataset.anchorTabTarget
            if (tabTarget) {
              Site.initToggleTabs(tabTarget)
            }
          }
        });
      });
    }
  }

  static initHeaderMove() {
    // Function for check and transform header
    const slicky = function (header, main, padding) {
      let currentScrollPos = window.pageYOffset;
      if (window.scrollY > 0) {
        if (window.location.pathname != "/")
          main.style.paddingTop = padding + "px";
        header.classList.add("--is_fixed");
      } else {
        if (window.location.pathname != "/")
          main.style.paddingTop = `0px`;
        header.classList.remove("--is_fixed");
      }
      // if (window.location.pathname != "/" && window.scrollY < 90) {
      // header.classList.add("--is_fixed");
      // }
      prevScrollPos = currentScrollPos;
    };

    // Main Element
    let header = document.querySelector(".header");

    // Set height variable
    // header.style.cssText = `--headerHeight: ${header.scrollHeight}px`;

    // Check header
    if (!header) return;

    // Set header height on Main tag for padding in other pages
    let mainTag = document.querySelector(".main");
    // if (window.location.pathname != "/")
    // mainTag.style.setProperty("--hHeight", `${header.offsetHeight}px`);

    let padding = 0;
    setTimeout(() => {
      padding = header.offsetHeight;
    }, 200);
    window.addEventListener("resize", function () {
      padding = header.offsetHeight;
    });

    // Set prev position
    let prevScrollPos = window.pageYOffset;

    // Active first time function
    slicky(header, mainTag, padding);

    //Events
    window.addEventListener("scroll", function () {
      // padding = header.offsetHeight
      slicky(header, mainTag, padding);
    });
  }

  static initDropdowns() {
    let items = document.querySelectorAll('.dropdown')
    if (!items) return

    if (window.innerWidth >= 1420) return

    items.forEach((item) => {
      let toggler = item.querySelector('.dropdown__toggle');
      let menu = item.querySelector('.dropdown__menu');

      toggler.addEventListener('click', (e) => {
        e.preventDefault();
        toggler.classList.toggle('dropdown__toggle--open')
        menu.classList.toggle('dropdown__menu--open')
        item.classList.toggle('dropdown--open')

        if (menu.classList.contains('dropdown__menu--open')) {
          menu.style.maxHeight = `${menu.scrollHeight}px`
        } else {
          menu.style.maxHeight = null
        }
      })

    })
  }
}

ready(() => {
  Site.initSearch()
  Site.initMobileNav()
  Site.initAccordeon()
  Site.initModals('*[data-modal]')
  Site.initDropdowns()
  Site.initFilterMobile()
  Site.initInputmasks()
  Site.initGlightbox()
  // Site.initHeaderMove()
  // Site.initToggleText(".text__toggle")
  // Site.initToggleTabs()
  // Site.initCatalogMode()
  // Site.initSelectTrigger()
  // Site.initAnchorTab()
  // Site.initHeaderMove()

  // Hello slider
  let helloSlider = Site.initSplide(
    '.hello__splide',
    {
      height: '680px',
      type: 'fade',
      rewind: true,
      autoplay: true,
      interval: 4000,
      cover: true,
      lazyLoad: 'nearby',
      pagination: false,
      // breakpoints: {
      //   1200: {
      //     height: '500px',
      //   }
      // }
    },
    null
  )
  if (helloSlider) {
    // Включение прогресс бара с расчетом растояния точек
    // let progressBarBanner = helloSlider.root.querySelector('.banner--splide--progress--bar')
    let progressCountBanner = helloSlider.root.querySelector('.splide__progress-count')

    helloSlider.on('mounted move', function () {
      let end = helloSlider.Components.Controller.getEnd() + 1

      progressCountBanner.innerHTML = `${helloSlider.index + 1}<small>|${end}</small>`
      // progressBarBanner.setAttribute('style', `--bar--left: ${String(100 * (bannerSlider.index) / (end - 1))}%`)
    });

    helloSlider.mount()
  }

  // Categories sliders
  let categoriesSliders = document.querySelectorAll('.categories__splide')
  if (categoriesSliders)
    categoriesSliders.forEach((slider) => {
      slider = Site.initSplide(
        `#${slider.id}`,
        {
          perPage: 4,
          rewind: true,
          lazyLoad: 'nearby',
          pagination: false,
          gap: 20,
          breakpoints: {
            1023: {
              perPage: 3
            },
            767: {
              perPage: 2
            },
            575: {
              perPage: 1
            }
          }
        },
        null
      )
      if (slider) slider.mount()
    })

  // Products sliders
  let productsSliders = document.querySelectorAll('.products__splide')
  if (productsSliders)
    productsSliders.forEach((slider) => {
      slider = Site.initSplide(
        `#${slider.id}`,
        {
          perPage: 5,
          rewind: true,
          lazyLoad: 'nearby',
          pagination: false,
          gap: 20,
          breakpoints: {
            1279: {
              perPage: 4
            },
            1023: {
              perPage: 3
            },
            767: {
              perPage: 2
            },
            575: {
              perPage: 1
            }
          }
        },
        null
      )
      if (slider) slider.mount()
    })

  // Sale slider
  let saleSlider = Site.initSplide(
    `.sale__splide`,
    {
      height: '469px',
      type: 'fade',
      rewind: true,
      autoplay: true,
      interval: 4000,
      cover: true,
      lazyLoad: 'nearby',
      pagination: true,
      arrows: false
    },
    null
  )
  if (saleSlider) saleSlider.mount()

  // Articles slider
  let articlesSlider = Site.initSplide(
    `.articles__splide`,
    {
      perPage: 3,
      lazyLoad: 'nearby',
      pagination: false,
      arrows: false,
      drag: false,
      gap: 20,
      breakpoints: {
        1023: {
          perPage: 2,
          drag: true
        },
        575: {
          perPage: 1
        }
      }
    },
    null
  )
  if (articlesSlider) articlesSlider.mount()

  // Makers slider
  let makersSlider = Site.initSplide(
    `.makers__splide`,
    {
      height: '50px',
      lazyLoad: 'nearby',
      pagination: false,
      arrows: false,
      type: 'loop',
      perPage: 10,
      perMove: 1,
      gap: 60,
      breakpoints: {
        1023: {
          perPage: 5
        },
        575: {
          perPage: 3
        }
      }
    },
    null
  )
  if (makersSlider) makersSlider.mount()

  let formPrice = document.querySelector('#form__price')
  if (formPrice) {
    let formatForSlider = {
      from: function (formattedValue) {
        return Number(formattedValue);
      },
      to: function (numericValue) {
        return Math.round(numericValue);
      }
    };
    noUiSlider.create(formPrice, {
      start: [+formPrice.dataset.startval, formPrice.dataset.endval],
      connect: true,
      format: formatForSlider,
      range: {
        'min': +formPrice.dataset.minval,
        'max': +formPrice.dataset.maxval
      }
    })
    let inputStart = document.querySelector('*[data-noui-input="start"]')
    let inputEnd = document.querySelector('*[data-noui-input="end"]')

    inputStart.addEventListener('input', function () {
      formPrice.noUiSlider.set([inputStart.value, null])
    })

    inputEnd.addEventListener('input', function () {
      formPrice.noUiSlider.set([null, inputEnd.value])
    })

    formPrice.noUiSlider.on('update', function (values, handle) {
      console.log("🚀 ~ formPrice.noUiSlider.on ~ handle:", handle)
      // console.log(values);
      if (handle != null) {
        switch (handle) {
          case 0:
            inputStart.value = values[handle]
            break;
          case 1:
            inputEnd.value = values[handle]
            break;
        }
      }
    })
  }

  // Product page thumb
  let productThumbSlider = Site.initSplide(
    `.product-page__thumb`,
    {
      rewind: true,
      fixedWidth: 105,
      fixedHeight: 105,
      isNavigation: true,
      gap: 15,
      arrows: false,
      focus: 'center',
      pagination: false,
      cover: true,
      dragMinThreshold: {
        mouse: 4,
        touch: 10,
      },
      breakpoints: {
        767: {
          fixedHeight: 85,
          fixedWidth: 85
        },
        575: {
          fixedHeight: 55,
          fixedWidth: 55
        }
      }
    },
    null
  )

  // Product page gallery
  let productGallerySlider = Site.initSplide(
    `.product-page__gallery`,
    {
      type: 'fade',
      height: '470px',
      heightRatio: 0.5,
      pagination: false,
      arrows: false,
      // cover: true,
      breakpoints: {
        767: {
          height: '400px'
        },
        575: {
          height: '280px'
        }
      }
    },
    productThumbSlider
  )

  if (productThumbSlider && productGallerySlider) {
    productGallerySlider.mount()
    productThumbSlider.mount()
  }

  // Design thumb slider
  let designThumbSlider = Site.initSplide(
    `.design__thumb`,
    {
      rewind: true,
      fixedWidth: 49,
      fixedHeight: 49,
      isNavigation: true,
      gap: 30,
      arrows: false,
      // focus: 'center',
      pagination: false,
      // cover: true,
      dragMinThreshold: {
        mouse: 4,
        touch: 10,
      },
      breakpoints: {
        1279: {
          fixedHeight: 44,
          fixedWidth: 44,
          gap: 15
        },
        575: {
          fixedHeight: 35,
          fixedWidth: 35,
          gap: 10
        }
      }
    },
    null
  )

  // Design preview slider
  let designPreviewSlider = Site.initSplide(
    `.design__splide`,
    {
      type: 'fade',
      height: '626px',
      heightRatio: 0.5,
      pagination: false,
      arrows: false,
      // cover: true,
      breakpoints: {
        // 767: {
        //   height: '400px'
        // },
        575: {
          height: '440px'
        }
      }
    },
    designThumbSlider
  )

  if (designThumbSlider && designPreviewSlider) {
    designPreviewSlider.mount()
    designThumbSlider.mount()
  }

  /*
     [Отложенная яндекс карта]
 */
  var section_contacts = document.querySelector(".contacts");
  if (section_contacts == null) {
    section_contacts = document.querySelector(".contacts_page");
  }
  var ymapInit = function () {
    if (typeof ymaps === "undefined") {
      return;
    }

    ymaps.ready(function () {
      var ymap = document.querySelector("#ya_map");
      var coordinates = ymap.getAttribute("data-coordinates");
      var address = ymap.getAttribute("data-address");
      var center = ymap.getAttribute("data-center");

      if (window.innerWidth < 768) center = coordinates;
      if (!center) center = coordinates;
      var myMap = new ymaps.Map(
        ymap,
        {
          center: center.split(","),
          zoom: 17,
          controls: ["zoomControl"],
        },
        {
          searchControlProvider: "yandex#search",
        }
      ),
        myGeoObject = new ymaps.GeoObject(
          {
            geometry: {
              type: "Point",
              coordinates: coordinates.split(","),
            },
            // properties: {
            //     hintContent: address,
            //     balloonContent: address
            // }
          },
          {
            // preset: 'islands#orangeDeliveryIcon'
            iconLayout: "default#image",
            iconImageHref: "img/marker.png",
            iconImageSize: [55, 55],
            iconImageOffset: [-25, -30],
          }
        );

      myMap.behaviors.disable("scroll");
      myMap.geoObjects.add(myGeoObject);
    });
  };

  var ymapLoad = function () {
    var script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    var body = document.querySelector("body");
    body.appendChild(script);
    script.addEventListener("load", ymapInit);
  };

  var checkYmapInit = function () {
    var section_contacts_top = section_contacts.getBoundingClientRect().top;
    var scroll_top = window.pageYOffset;
    var section_contacts_offset_top = scroll_top + section_contacts_top;
    // console.log(section_contacts_top); console.log(scroll_top); console.log(section_contacts_offset_top);
    if (scroll_top + window.innerHeight > section_contacts_offset_top) {
      ymapLoad();
      window.removeEventListener("scroll", checkYmapInit);
    }
  };

  if (section_contacts != null) {
    window.addEventListener("scroll", checkYmapInit);
    checkYmapInit();
  }
})