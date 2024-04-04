console.log(window.location.pathname);

const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 1,
  },
  api: {
    key: "4d078d6b8dd671acf8c3ab4ed275756a",
    url: "https://api.themoviedb.org/3/",
  },
};

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);

async function displayPopularMovies() {
  const { results } = await fetchApiData("movie/popular");
  console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
      />`
          : `<img
      src="../images/no-image.jpg"
      class="card-img-top"
      alt="${movie.title}"
    />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>`;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

async function displayPopularTv() {
  const { results } = await fetchApiData("tv/popular");
  console.log(results);
  results.forEach((tv) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="tv-details.html?id=${tv.id}">
      ${
        tv.poster_path
          ? `<img
        src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
        class="card-img-top"
        alt="${tv.name}"
      />`
          : `<img
      src="../images/no-image.jpg"
      class="card-img-top"
      alt="${tv.name}"
    />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${tv.name}</h5>
      <p class="card-text">
        <small class="text-muted">Air date: ${tv.first_air_date}</small>
      </p>
    </div>`;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  const movie = await fetchApiData(`movie/${movieId}`);
  displaybackgroundImage("movie", movie.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
  <div>
  ${
    movie.poster_path
      ? `<img
    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    class="card-img-top"
    alt="${movie.name}"
  />`
      : `<img
  src="../images/no-image.jpg"
  class="card-img-top"
  alt="${movie.name}"
/>`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> ${formatCurrency(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> ${formatCurrency(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
  ${movie.production_companies
    .map((company) => `<apan>${company.name}</span>`)
    .join(", ")}
  </div>
</div>`;

  document.getElementById("movie-details").appendChild(div);
}

async function displayTvDetails() {
  const tvId = window.location.search.split("=")[1];
  const tv = await fetchApiData(`tv/${tvId}`);
  displaybackgroundImage("tv", tv.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
  <div>
  ${
    tv.poster_path
      ? `<img
    src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
    class="card-img-top"
    alt="${tv.name}"
  />`
      : `<img
  src="../images/no-image.jpg"
  class="card-img-top"
  alt="${tv.name}"
/>`
  }
  </div>
  <div>
    <h2>${tv.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${tv.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last air date: ${tv.last_air_date}</p>
    <p>
      ${tv.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${tv.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${tv.homepage}" target="_blank" class="btn">Visit tv Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>tv Info</h2>
  <ul>
    <li><span class="text-secondary">Number of episodes:</span> ${
      tv.number_of_episodes
    }</li>
    <li><span class="text-secondary">Status:</span> ${tv.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
  ${tv.production_companies
    .map((company) => `<apan>${company.name}</span>`)
    .join(", ")}
  </div>
</div>`;

  document.querySelector("#show-details").appendChild(div);
}

function displaybackgroundImage(type, backgroundImage) {
  const overlay = document.createElement("div");
  overlay.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundImage})`;
  overlay.style.backgroundSize = "cover";
  overlay.style.backgroundPosition = "center";
  overlay.style.backgroundRepeat = "no-repeat";
  overlay.style.height = "100vh";
  overlay.style.width = "100vw";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.bottom = "0";
  overlay.style.zIndex = "-1";
  overlay.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlay);
  } else {
    document.querySelector("#show-details").appendChild(overlay);
  }
}

async function displayslider() {
  const { results } = await fetchApiData("movie/now_playing");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
        1
      )} / 10
    </h4>`;
    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

async function fetchApiData(endpoint) {
  const API_KEY = global.api.key;
  const API_URL = global.api.url;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();
  hideSpinner();
  return data;
}

async function searchApiData() {
  const API_KEY = global.api.key;
  const API_URL = global.api.url;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&include_adult=false&language=id-ID&query=${global.search.term}&page=${global.search.page}`
  );

  const data = await response.json();
  hideSpinner();
  return data;
}

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    // display search result
    const { results, total_pages, page, total_results } = await searchApiData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results === 0) {
      showAlert("No results found");
      return;
    }

    displaySearchResults(results);
    document.querySelector("#search-term").value = "";
  } else {
    // display alert
    showAlert("Please input a search term");
  }
}

function showSpinner() {
  const spinnerEl = document.querySelector(".spinner");
  spinnerEl.classList.add("show");
}

function hideSpinner() {
  const spinnerEl = document.querySelector(".spinner");
  spinnerEl.classList.remove("show");
}

function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

function displaySearchResults(results) {
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
      ${
        result.poster_path
          ? `<img
        src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
        class="card-img-top"
        alt="${global.search.type === "movie" ? result.title : result.name}"
      />`
          : `<img
      src="../images/no-image.jpg"
      class="card-img-top"
      alt="${global.search.type === "movie" ? result.title : result.name}"
    />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${
        global.search.type === "movie" ? result.title : result.name
      }</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${
          global.search.type === "movie"
            ? result.release_date
            : result.first_air_date
        }</small>
      </p>
    </div>`;
    document.querySelector("#search-results-heading").innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`;
    document.querySelector("#search-results").appendChild(div);
  });
  displayPagination();
}

function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `<button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

  document.querySelector("#pagination").appendChild(div);
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });

  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });
}

function showAlert(message, className = "alert-error") {
  const alertElement = document.createElement("div");
  alertElement.classList.add("alert", className);
  alertText = document.createTextNode(message);
  alertElement.appendChild(alertText);
  document.querySelector("#alert").appendChild(alertElement);

  setTimeout(() => alertElement.remove(), 2000);
}

function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayslider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularTv();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayTvDetails();
      break;
    case "/search.html":
      search();
      break;

    default:
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
