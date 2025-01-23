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

