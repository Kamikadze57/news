const API_KEY = "cc190f7a7f954eb3b994d1a209de0d33";

const newsInput = document.querySelector("[newsInp]");
const newsBtn = document.querySelector("[newsBtn]");
const sortSel = document.querySelector("[sortSel]");
const newsBox = document.querySelector("[newsBox]");
const btnBox = document.querySelector("[btnBox]");
const prevPage = document.querySelector("[prevPage]");
const nextPage = document.querySelector("[nextPage]");

const frPage = document.querySelector("[frPage]");
const secPage = document.querySelector("[secPage]");
const thirdPage = document.querySelector("[thirdPage]");
const fourthPage = document.querySelector("[fourthPage]");
const fifthPage = document.querySelector("[fifthPage]");

let page = 1;
let maxNews = 20;
let totalResults = 0; // Зберігаємо загальну кількість результатів з API

// Функція для отримання та відображення новин
function fetchNews(query, pageNum, sort) {
  if (query === "") {
    newsBox.innerHTML = `<p class="news-error__text">Будь ласка, введіть ключове слово або назву новини.</p>`;
    btnBox.classList.add("hidden");
    return null;
  }
  fetch(`https://newsapi.org/v2/everything?q=${query}&page=${pageNum}&pageSize=${maxNews}&sortBy=${sort}&apiKey=${API_KEY}`, {
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
        const url = element.url || "#";
        const imageUrl = element.urlToImage || "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg";
        const title = element.title || "Немає назви";
        const author = element.author || "Немає автора";
        const content = element.content || "Немає опису";
        const publishedAt = element.publishedAt ? new Date(element.publishedAt).toLocaleString() : "Немає дати";
        newsBox.innerHTML += `
          <a class="news__link" href="${url}" target="_blank">
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
            </article>
          </a>`;
        console.log(data);
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
  frPage.disabled = currentPage === 1;
  secPage.disabled = currentPage === 2;
  thirdPage.disabled = currentPage === 3;
  fourthPage.disabled = currentPage === 4;
  fifthPage.disabled = currentPage === 5;
}
// Збереження останнього запиту в localStorage при введенні
newsInput.addEventListener("input", () => {
  localStorage.setItem("lastNewsQuery", newsInput.value.trim());
});
// Обробник для кнопки пошуку
newsBtn.addEventListener("click", () => {
  const newsInp = newsInput.value.trim();
  page = 1; // При новому пошуку завжди починаємо з першої сторінки
  const selectedSort = sortSel.value;
  fetchNews(newsInp, page, selectedSort);
});
sortSel.addEventListener("change", () => {
  const currentQuery = newsInput.value.trim(); // Отримуємо поточний запит
  page = 1; // При зміні сортування повертаємося на першу сторінку
  const selectedSort = sortSel.value;
  fetchNews(currentQuery, page, selectedSort); // Викликаємо функцію з новим сортуванням
});
// Обробники для кнопок "Попередня" та "Наступна" сторінка
prevPage.addEventListener("click", () => {
  const currentQuery = newsInput.value.trim();
  const selectedSort = sortSel.value; // Отримуємо поточне значення сортування
  if (page > 1) {
    page--;
    fetchNews(currentQuery, page, selectedSort); // Передаємо значення сортування
  }
});
nextPage.addEventListener("click", () => {
  const currentQuery = newsInput.value.trim();
  const selectedSort = sortSel.value; // Отримуємо поточне значення сортування
  page++;
  fetchNews(currentQuery, page, selectedSort); // Передаємо значення сортування
});

// Збираємо усі кнопки в один масив
const pageButtons = [frPage, secPage, thirdPage, fourthPage, fifthPage];

// Пройдемося по кожній кнопці в масиві та додамо обробник події
pageButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const currentQuery = newsInput.value.trim();
    const page = index + 1;
    const selectedSort = sortSel.value; // Отримуємо поточне значення сортування
    fetchNews(currentQuery, page, selectedSort); // Передаємо значення сортування
  });
});
// --- Ініціалізація при завантаженні сторінки ---
document.addEventListener("DOMContentLoaded", () => {
  const lastQuery = localStorage.getItem("lastNewsQuery");
  const initialSort = sortSel.value;
  if (lastQuery) {
    newsInput.value = lastQuery; // Встановлюємо збережене значення в інпут
    page = 1; // Починаємо з першої сторінки для збереженого запиту
    fetchNews(lastQuery, page, initialSort); // Виконуємо пошук з початковим сортуванням
  } else {
    // Якщо немає збереженого запиту, ховаємо кнопки навігації
    btnBox.classList.add("hidden");
  }
});
