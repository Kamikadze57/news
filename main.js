const API_KEY = "cc190f7a7f954eb3b994d1a209de0d33";

const newsInput = document.querySelector("[newsInp]");
const newsBtn = document.querySelector("[newsBtn]");
const newsBox = document.querySelector("[newsBox]");
const btnBox = document.querySelector("[btnBox]");
const prevPage = document.querySelector("[prevPage]");
const pageNumber = document.querySelector("[pageNumber]");
const nextPage = document.querySelector("[nextPage]");

let page = 1;
let maxNews = 20;
let totalResults = 0; // Зберігаємо загальну кількість результатів з API

// Функція для отримання та відображення новин
function fetchNews(query, pageNum) {
  if (query === "") {
    newsBox.innerHTML = `<p class="news-error__text">Будь ласка, введіть ключове слово або назву новини.</p>`;
    btnBox.classList.add("hidden");
    return null;
  }
  pageNumber.textContent = pageNum; // Оновлюємо номер сторінки в інтерфейсі
  fetch(`https://newsapi.org/v2/everything?q=${query}&page=${pageNum}&pageSize=${maxNews}&sortBy=publishedAt&apiKey=${API_KEY}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        console.error("something wrong");
        newsBox.innerHTML = `<p class="news-error__text">На жаль, сталася помилка при завантаженні новин. Спробуйте пізніше.</p>`;
        return null;
      }
      return response.json();
    })
    .then((data) => {
      if (!data) {
        return;
      }
      newsBox.innerHTML = "";
      if (data.articles.length === 0) {
        newsBox.innerHTML = `<p class="news-error__text">На жаль, за вашим запитом новин не знайдено.</p>`;
        btnBox.classList.add("hidden");
        return;
      }
      totalResults = Math.min(data.totalResults, 100); // Обмежуємо totalResults до 100, оскільки NewsAPI має це обмеження
      const maxPages = Math.ceil(totalResults / maxNews); // Вираховуємо максимальну кількість сторінок
      data.articles.forEach((element) => {
        const imageUrl = element.urlToImage || "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg";
        const title = element.title || "Немає назви";
        const author = element.author || "Немає автора";
        const content = element.content || "Немає опису";
        const publishedAt = element.publishedAt ? new Date(element.publishedAt).toLocaleString() : "Немає дати";
        newsBox.innerHTML += `
          <article class="news__article">
            <img class="news__img" src="${imageUrl}" alt="${author}">
            <div class="news-article__box">
              <div class="news-box__box">
                <h3 class="news-art__title">${title}</h3>
                <h6 class="news__author">${author}</h6>
              </div>
              <p class="news__content">${content}</p>
              <p class="news__date">${publishedAt}</p>
            </div>
          </article>`;
      });
      btnBox.classList.remove("hidden");
      // Оновлюємо стан кнопок навігації після завантаження новин
      updatePaginationButtons(pageNum, maxPages);
    })
    .catch((error) => {
      console.error(error);
      newsBox.innerHTML = `<p class="news-error__text">На жаль, сталася помилка при завантаженні новин. Спробуйте пізніше.</p>`;
      btnBox.classList.add("hidden");
    });
}
// Функція для оновлення стану кнопок навігації
function updatePaginationButtons(currentPage, maxPages) {
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage >= maxPages;
}
// Збереження останнього запиту в localStorage при введенні
newsInput.addEventListener("input", () => {
  localStorage.setItem("lastNewsQuery", newsInput.value.trim());
});
// Обробник для кнопки пошуку
newsBtn.addEventListener("click", () => {
  const newsInp = newsInput.value.trim();
  page = 1; // При новому пошуку завжди починаємо з першої сторінки
  fetchNews(newsInp, page);
});

// Обробники для кнопок "Попередня" та "Наступна" сторінка
prevPage.addEventListener("click", () => {
  const currentQuery = newsInput.value.trim(); // Отримуємо поточний запит
  if (page > 1) {
    page--;
    fetchNews(currentQuery, page);
  }
});
nextPage.addEventListener("click", () => {
  const currentQuery = newsInput.value.trim(); // Отримуємо поточний запит
  page++;
  fetchNews(currentQuery, page);
});
// --- Ініціалізація при завантаженні сторінки ---
document.addEventListener("DOMContentLoaded", () => {
  const lastQuery = localStorage.getItem("lastNewsQuery");
  if (lastQuery) {
    newsInput.value = lastQuery; // Встановлюємо збережене значення в інпут
    page = 1; // Починаємо з першої сторінки для збереженого запиту
    fetchNews(lastQuery, page); // Виконуємо пошук
  } else {
    // Якщо немає збереженого запиту, ховаємо кнопки навігації
    btnBox.classList.add("hidden");
  }
});
