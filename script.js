document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".details__item");

    items.forEach(item => {
        const button = item.querySelector(".details__button");
        const info = item.querySelector(".details__info");
        const icon = item.querySelector(".details__icon svg");

        button.addEventListener("click", () => {
            // Проверяем, открыт ли текущий элемент
            const isOpen = item.classList.contains("is-open");

            // Закрываем все элементы
            items.forEach(el => {
                el.classList.remove("is-open");
                const elInfo = el.querySelector(".details__info");
                const elIcon = el.querySelector(".details__icon svg");

                if (elInfo) {
                    elInfo.style.maxHeight = "0";
                    elInfo.style.paddingTop = "0";
                    elInfo.style.paddingBottom = "0";
                }
                if (elIcon) {
                    elIcon.style.transform = "rotate(45deg)"; // Возвращаем иконку в исходное состояние
                }
            });

            // Если текущий элемент не был открыт, открываем его
            if (!isOpen) {
                item.classList.add("is-open");

                if (info) {
                    // Сбрасываем max-height для расчёта
                    info.style.maxHeight = `${info.scrollHeight}px`;
                    info.style.marginTop = "16px";
                }

                if (icon) {
                    icon.style.transform = "rotate(90deg)"; // Поворачиваем иконку
                }
            }
        });
    });
});

// слайдер галлереии
document.addEventListener("DOMContentLoaded", () => {
    const galleryContent = document.querySelector(".gallery__content");
    const prevButton = document.querySelector(".gallery__nav_prev");
    const nextButton = document.querySelector(".gallery__nav_next");

    const ITEMS_PER_PAGE = 6; // Количество изображений на одной "странице"
    const totalItems = galleryContent.children.length; // Общее количество изображений
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE); // Количество страниц
    let currentPage = 0;

    function updateButtons() {
        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage >= totalPages - 1;
    }
    let lastPage = 0; // Переменная для отслеживания предыдущей страницы

    function showPage(page) {
        const start = page * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        // Определяем направление переключения
        const direction = page > lastPage ? "next" : "prev";

        // Скрываем текущие изображения с правильным эффектом
        Array.from(galleryContent.children).forEach((img, index) => {
            if (index >= start && index < end) {
                img.classList.remove("fade-out-left", "fade-out-right");
                img.classList.add(direction === "next" ? "fade-in-right" : "fade-in-left");
                img.style.display = "block"; // Показываем картинку
            } else {
                if (img.style.display === "block") {
                    img.classList.remove("fade-in-right", "fade-in-left");
                    img.classList.add(direction === "next" ? "fade-out-left" : "fade-out-right");
                    setTimeout(() => {
                        img.style.display = "none"; // Полностью скрываем после анимации
                    }, 500); // Задержка совпадает с длительностью анимации
                }
            }
        });

        lastPage = page; // Обновляем последнюю страницу
    }


    // Обработчик для кнопки "Назад"
    prevButton.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            showPage(currentPage);
            updateButtons();
        }
    });

    // Обработчик для кнопки "Вперёд"
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            showPage(currentPage);
            updateButtons();
        }
    });

    // Открытие изображения в полноэкранном режиме
    galleryContent.addEventListener("click", (event) => {
        if (event.target.tagName === "IMG") {
            const src = event.target.src;
            openFullscreenImage(src);
        }
    });

    function openFullscreenImage(src) {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = 1000;

        const img = document.createElement("img");
        img.src = src;
        img.style.maxWidth = "95%";
        img.style.maxHeight = "95%";
        img.style.objectFit = "contain";
        img.style.borderRadius = "10px";

        overlay.appendChild(img);
        document.body.appendChild(overlay);

        overlay.addEventListener("click", () => {
            document.body.removeChild(overlay);
        });
    }

    // Показ первой страницы
    showPage(currentPage);
    updateButtons();
});

document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector(".header__burger");
    const header = document.querySelector(".header");

    burger.addEventListener("click", () => {
        header.classList.toggle("menu-open");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const speakersContainer = document.querySelector(".speakers__container"); // Изначальный контейнер с карточками
    const speakers = Array.from(speakersContainer.querySelectorAll(".speaker")); // Все карточки спикеров
    const speakersSlider = document.querySelector(".speakers__slider");

    // Конфигурация для разных экранов
    const breakpoints = {
        desktop: { slidesPerGroup: 8, columns: 4 }, // 8 карточек, 4 колонки
        tabletLandscape: { slidesPerGroup: 6, columns: 3 }, // 6 карточек, 3 колонки
        tabletPortrait: { slidesPerGroup: 4, columns: 2 }, // 4 карточки, 2 колонки
        mobile: { slidesPerGroup: 1, columns: 1 }, // 1 карточка, частично видна следующая
    };

    // Функция получения настроек для текущего экрана
    const getBreakpointSettings = () => {
        const width = window.innerWidth;
        if (width >= 1024) return breakpoints.desktop;
        if (width >= 768) return breakpoints.tabletLandscape;
        if (width >= 480) return breakpoints.tabletPortrait;
        return breakpoints.mobile;
    };

    // Создание структуры для Swiper
    const createSwiperStructure = () => {
        const { slidesPerGroup, columns } = getBreakpointSettings();

        // Удаляем старую структуру
        speakersSlider.innerHTML = '<div class="swiper-wrapper"></div>';
        const swiperWrapper = speakersSlider.querySelector(".swiper-wrapper");

        // Разбиваем карточки на группы
        for (let i = 0; i < speakers.length; i += slidesPerGroup) {
            const group = speakers.slice(i, i + slidesPerGroup);

            // Создаём слайд
            const slide = document.createElement("div");
            slide.classList.add("swiper-slide", "speakers__container");
            slide.style.display = "grid";
            slide.style.gridTemplateColumns = `repeat(${columns}, 1fr)`; // Количество колонок
            slide.style.gap = "24px";

            // Для мобильного: все карточки в 1 колонку
            if (columns === 1) {
                slide.style.gridTemplateColumns = "1fr";
                slide.style.justifyItems = "center"; // Центрируем карточки
            }

            // Добавляем карточки в слайд
            group.forEach((speaker) => {
                slide.appendChild(speaker.cloneNode(true));
            });

            // Добавляем слайд в swiper-wrapper
            swiperWrapper.appendChild(slide);
        }
    };

    // Инициализация Swiper
    const initSwiper = () => {
        new Swiper(".speakers__slider", {
            slidesPerView: 1.2, // На мобильных частично виден следующий слайд
            spaceBetween: 16, // Отступы между карточками
            navigation: {
                nextEl: ".speakers__nav_next",
                prevEl: ".speakers__nav_prev",
            },
            breakpoints: {
                480: {
                    slidesPerView: 2, // На планшетах показываем 2 карточки
                    spaceBetween: 16,
                },
                768: {
                    slidesPerView: 3, // На планшетах в альбомной ориентации — 3 карточки
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 1, // На десктопе слайды создаются по группам (управляет JS)
                },
            },
        });
    };

    // Основная функция: пересоздание структуры и инициализация Swiper
    const rebuildSwiper = () => {
        createSwiperStructure(); // Создаём слайды
        initSwiper(); // Инициализируем Swiper
    };

    // Изначальная сборка
    rebuildSwiper();

    // Пересоздаём структуру при изменении размера окна
    window.addEventListener("resize", rebuildSwiper);
});

