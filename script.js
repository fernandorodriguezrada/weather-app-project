const app = document.getElementById("app");
const cityInput = document.getElementById("city");
const searchButton = document.getElementById("search");
const weatherContainer = document.getElementById("weather");
const forecastSection = document.getElementById("forecast");
const searchEmoji = document.querySelector(".search-emoji");
forecastSection.style.display = "none";

cityInput.addEventListener("keydown", async (event) => {
  if (event.keyCode === 13) {
    const city = cityInput.value;

    forecastSection.innerHTML = "";

    document.activeElement.blur();

    const weatherData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bf37dce17aeb52a65d2320ff7cb20783&units=metric`
    );
    const weatherInfo = await weatherData.json();

    weatherContainer.innerHTML = `
      <div class="weather-info">
        <div class="weather-icon">
          <img src="./resources/icons/${
            weatherInfo.weather[0].icon
          }.png" alt="${weatherInfo.weather[0].main}">
        </div>
        <div class="weather-data">
          <div class="weather-temperature">
            <div class="temperature">${Math.round(
              weatherInfo.main.temp
            )}°C</div>
          </div>
          <div class="weather-description">${
            weatherInfo.weather[0].description
          }</div>
          <div class="weather-forecast">
            <ul>
              <li> humidity: ${weatherInfo.main.humidity}%</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    const forecastData = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherInfo.coord.lat}&lon=${weatherInfo.coord.lon}&appid=bf37dce17aeb52a65d2320ff7cb20783&units=metric&exclude=minutely,hourly`
    );
    const forecastData2 = await forecastData.json();

    for (let i = 0; i < 7; i++) {
      const day = forecastData2.daily[i];
      const date = new Date(day.dt * 1000);
      const dayOfWeek = date.getDay();
      const weatherIcon = day.weather[0].icon;
      const temperature = Math.round(day.temp.day);

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div>
          <h2>${date.toLocaleString("en-US", { weekday: "short" })}</h2>
        </div>
        <div>
          <img src="./resources/icons/${weatherIcon}.png" alt="${weatherIcon}">
          <p class="temperature">${temperature}°C</p>
        </div>
      `;

      forecastSection.appendChild(card);
    }

    forecastSection.style.display = "grid";
    searchEmoji.style.display = "none";
  }
});

const darkModeButton = document.querySelector(".dark-mode-button");

darkModeButton.addEventListener("click", () => {
  const isDarkMode = !document.body.classList.contains("dark-mode");
  document.body.classList.toggle("dark-mode", isDarkMode);
  document.body.style.backgroundColor = `${isDarkMode ? "#1a1a1a" : "#f5f5f5"}`;
  document.body.style.color = `${isDarkMode ? "#fff" : "#000"}`;

  document.body.style.transition = "background-color .5s, color .5s";

  document
    .querySelectorAll("h1, div.temperature, div.weather-description, li")
    .forEach((element) => {
      element.style.color = isDarkMode ? "#dddcdc" : "#585858";
    });

  const darkModeButtonText = document.querySelector(".dark-mode-button");
  darkModeButtonText.textContent = isDarkMode ? "Light Mode" : "Dark Mode";

  document.getElementById("forecast").style.backgroundColor = "#ffffffb2";
});
