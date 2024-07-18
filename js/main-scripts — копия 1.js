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
        let buttons = document.querySelectorAll(`*[data-search^="button"]`)
        if (!buttons) return
        buttons.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault()
                let type = button.dataset.search.split("::").pop()
                let container = button.closest('.container')
                switch (type) {
                    case "open":
                        container.classList.add("--is_searching")
                        break;
                    case "close":
                        container.classList.remove("--is_searching")
                        break;
                }
            })
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
        let buttons = document.querySelectorAll('*[data-mobile-nav^="button"]')
        let menu = document.querySelector('*[data-mobile-nav="menu"]')
        if (!buttons && !menu) return
        buttons.forEach((button) => {
            let action = button.dataset.mobileNav.split("::").pop()
            if (!action) return

            button.addEventListener("click", (e) => {
                e.preventDefault()

                switch (action) {
                    case "open":
                        menu.classList.add("--is_active")
                        document.documentElement.classList.add("--mn_active")
                        break;
                    case "close":
                        menu.classList.remove("--is_active")
                        document.documentElement.classList.remove("--mn_active")
                        break;
                }
            })
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
}

ready(() => {
    Site.initGlightbox()
    // Site.initAccordeon()
    Site.initInputmasks()
    Site.initModals('*[data-modal]')
    // Site.initSearch()
    // Site.initHeaderMove()
    // Site.initToggleText(".text__toggle")
    Site.initToggleTabs()
    Site.initMobileNav()
    Site.initCatalogMode()
    Site.initSelectTrigger()
    Site.initAnchorTab()
    Site.initHeaderMove()

    window.addEventListener("resize", (e) => {
        if (window.matchMedia("(max-width: 1279px)").matches) {
            Site.initCatalogMode('line')
        }
        if (window.matchMedia("(max-width: 1023px)").matches) {
            Site.initCatalogMode('grid::2')
        }
        if (window.matchMedia("(max-width: 767px)").matches) {
            Site.initCatalogMode('line')
        }
    })

    if (window.matchMedia("(max-width: 1279px)").matches) {
        Site.initCatalogMode('line')
    }
    if (window.matchMedia("(max-width: 1023px)").matches) {
        Site.initCatalogMode('grid::2')
    }
    if (window.matchMedia("(max-width: 767px)").matches) {
        Site.initCatalogMode('line')
    }

    // Catalog filter toggler
    if (window.matchMedia("(max-width: 1023px)").matches) {
        let catalogFilterToggler = document.querySelector(".catalog-filter__toggler")
        if (catalogFilterToggler) {
            catalogFilterToggler.addEventListener("click", (e) => {
                e.preventDefault()
                let catalogFilterSidebar = document.querySelector(".catalog-filter__sidebar")
                if (!catalogFilterSidebar) return
                catalogFilterSidebar.classList.toggle("--is_active")
                document.documentElement.classList.toggle("--catalog_sidebar")
            })
        }
    }

    let helloAdvantages = Site.initSplide(
        `.hello__advantages`,
        {
            speed: 2300,
            drag: false,
            // autoWidth: true,
            pagination: false,
            arrows: false,
            perPage: 3,
            breakpoints: {
                575: {
                    speed: 2500,
                    perPage: 1,
                    autoplay: true,
                    interval: 2500,
                    type: 'loop'
                }
            }
        }
    )
    if (helloAdvantages) helloAdvantages.mount()

    let helloProducts = Site.initSplide(
        `.hello__products-splide`,
        {
            speed: 2300,
            drag: false,
            // autoWidth: true,
            pagination: false,
            arrows: false,
            perPage: 5,
            gap: 16,
            breakpoints: {
                1279: {
                    gap: 8
                },
                1023: {
                    drag: true,
                    perPage: 3,
                    pagination: true
                },
                575: {
                    perPage: 2,
                    gap: 0
                }
            }
        }
    )
    if (helloProducts) helloProducts.mount()

    let aboutImages = Site.initSplide(
        `.about__images-splide`,
        {
            speed: 2300,
            pagination: false,
            perPage: 1,
            padding: {
                left: "33%",
                right: "33%"
            },
            height: "450px",
            start: 1,
            breakpoints: {
                767: {
                    height: "350px"
                },
                575: {
                    height: "200px",
                    padding: {
                        left: "20%",
                        right: "20%"
                    }
                }
            }
        }
    )
    if (aboutImages) {

        aboutImages.on("ready", function () {
            let slidePrev = aboutImages.Components.Slides.getAt(0).slide
            let slideNext = aboutImages.Components.Slides.getAt(2).slide
            if (slidePrev)
                slidePrev.classList.add("--is_prev")
            if (slideNext)
                slideNext.classList.add("--is_next")
        })

        aboutImages.on("move", function (newIndex, prevIndex, destIndex) {
            let prevSlide = aboutImages.Components.Slides.getAt(prevIndex).slide
            let nextSlide
            if (aboutImages.Components.Slides.getAt(newIndex + 1))
                nextSlide = aboutImages.Components.Slides.getAt(newIndex + 1).slide
            let currentSlide = aboutImages.Components.Slides.getAt(newIndex).slide

            prevSlide.classList.add("--is_prev")
            prevSlide.classList.remove("--is_next")
            if (aboutImages.Components.Slides.getAt(newIndex + 1)) {
                nextSlide.classList.add("--is_next")
                nextSlide.classList.remove("--is_prev")
            }
            currentSlide.classList.remove("--is_prev")
            currentSlide.classList.remove("--is_next")
        });

        aboutImages.mount()
    }

    let goodsTabs = document.querySelectorAll('.goods__tabs-splide')
    if (goodsTabs)
        goodsTabs.forEach((slider) => {
            slider = Site.initSplide(
                `#${slider.getAttribute('id')}`,
                {
                    speed: 2300,
                    perPage: 3,
                    pagination: false,
                    gap: 32,
                    breakpoints: {
                        1279: {
                            gap: 0
                        },
                        1023: {
                            perPage: 2
                        },
                        575: {
                            perPage: 1
                        }
                    }
                }
            )
            if (slider) slider.mount()
        })

    let footerAdvantages = Site.initSplide(
        `.footer__advantages-splide`,
        {
            speed: 2300,
            perPage: 5,
            pagination: false,
            drag: false,
            arrows: false,
            gap: 27,
            breakpoints: {
                1279: {
                    gap: 16
                },
                1023: {
                    pagination: true,
                    perPage: 3,
                    drag: true
                },
                767: {
                    perPage: 2
                },
                575: {
                    perPage: 1,
                    autoplay: true,
                    interval: 2500,
                    type: 'loop',
                    speed: 2500
                }
            }
        }
    )
    if (footerAdvantages) footerAdvantages.mount()

    let footerViewed = Site.initSplide(
        `.footer__viewed-splide`,
        {
            speed: 2300,
            perPage: 2,
            pagination: false,
            gap: 16,
            direction: 'ttb',
            height: "18rem",
            breakpoints: {
                1279: {
                    height: "15rem"
                }
            }
        }
    )
    if (footerViewed) footerViewed.mount()

    let productImages = Site.initSplide(
        `.product__images`,
        {
            heightRatio: 1,
            pagination: false,
            arrows: false
        }
    )
    let productImagesThumb = Site.initSplide(
        `.product__images-thumb`,
        {
            rewind: true,
            fixedWidth: 100,
            fixedHeight: 100,
            isNavigation: true,
            gap: 16,
            pagination: false,
            arrows: false,
            cover: true,
            dragMinThreshold: {
                mouse: 4,
                touch: 10,
            },
            breakpoints: {
                1023: {
                    fixedWidth: 75,
                    fixedHeight: 75,
                    pagination: true,
                },
                767: {
                    fixedWidth: 75,
                    fixedHeight: 75,
                    focus: "center"
                },
                575: {
                    fixedWidth: 60,
                    fixedHeight: 60
                }
            }
        }
    )
    if (productImages && productImagesThumb) {
        productImages.sync(productImagesThumb)
        productImages.mount()
        productImagesThumb.mount()
    }

    let productRecommended = Site.initSplide(
        `.product-recommended__splide`,
        {
            speed: 2300,
            perPage: 3,
            pagination: false,
            gap: 32,
            breakpoints: {
                1279: {
                    gap: 0
                },
                1023: {
                    perPage: 2
                },
                575: {
                    perPage: 1
                }
            }
        }
    )
    if (productRecommended) productRecommended.mount()
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