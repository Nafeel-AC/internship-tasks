const API_KEY = '1d3893eb095dbff8938ac1a80b4e2818';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
let cities = JSON.parse(localStorage.getItem('weatherCities')) || [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (cities.length === 0) {
        getCurrentLocation();
    } else {
        cities.forEach(city => fetchWeatherData(city));
    }

    // Add enter key support for search
    document.getElementById('cityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
});

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

async function searchWeather() {
    const cityInput = document.getElementById('cityInput');
    const cityName = cityInput.value.trim();
    
    if (!cityName) {
        showError('Please enter a city name');
        return;
    }

    if (cities.includes(cityName.toLowerCase())) {
        showError('City already added to dashboard');
        return;
    }

    await fetchWeatherData(cityName);
    cityInput.value = '';
}

async function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser');
        return;
    }

    showLoading();
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            hideLoading();
            showError('Unable to get your location. Please search for a city manually.');
        }
    );
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Weather data not found');
        }

        const data = await response.json();
        const cityName = data.name;
        
        if (!cities.includes(cityName.toLowerCase())) {
            cities.unshift(cityName.toLowerCase());
            localStorage.setItem('weatherCities', JSON.stringify(cities));
            await displayWeatherData(data);
            await fetchForecastData(cityName);
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showError('Failed to fetch weather data for your location');
    }
}

async function fetchWeatherData(cityName) {
    showLoading();
    
    try {
        const weatherResponse = await fetch(
            `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        
        if (!weatherResponse.ok) {
            throw new Error('City not found');
        }

        const weatherData = await weatherResponse.json();
        
        // Add city to list if not already present
        const cityLower = cityName.toLowerCase();
        if (!cities.includes(cityLower)) {
            cities.push(cityLower);
            localStorage.setItem('weatherCities', JSON.stringify(cities));
        }

        await displayWeatherData(weatherData);
        await fetchForecastData(cityName);
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showError(`Failed to fetch weather data: ${error.message}`);
    }
}

async function fetchForecastData(cityName) {
    try {
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        
        if (!forecastResponse.ok) {
            throw new Error('Forecast data not found');
        }

        const forecastData = await forecastResponse.json();
        displayForecastData(cityName, forecastData);
    } catch (error) {
        console.error('Failed to fetch forecast data:', error);
    }
}

function displayWeatherData(data) {
    const weatherGrid = document.getElementById('weatherGrid');
    const cityName = data.name;
    
    // Remove existing card if present
    const existingCard = document.getElementById(`card-${cityName.toLowerCase()}`);
    if (existingCard) {
        existingCard.remove();
    }

    const weatherCard = document.createElement('div');
    weatherCard.className = 'weather-card';
    weatherCard.id = `card-${cityName.toLowerCase()}`;

    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    weatherCard.innerHTML = `
        <div class="city-name">
            ${cityName}, ${data.sys.country}
            <button class="remove-btn" onclick="removeCity('${cityName.toLowerCase()}')" title="Remove city">×</button>
        </div>
        <div class="current-weather">
            <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <div class="weather-info">
                <div class="description">${data.weather[0].description}</div>
                <div>Feels like ${Math.round(data.main.feels_like)}°C</div>
            </div>
        </div>
        <div class="details">
            <div class="detail-item">
                <div class="detail-label">Humidity</div>
                <div class="detail-value">${data.main.humidity}%</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Wind Speed</div>
                <div class="detail-value">${data.wind.speed} m/s</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Pressure</div>
                <div class="detail-value">${data.main.pressure} hPa</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Visibility</div>
                <div class="detail-value">${(data.visibility / 1000).toFixed(1)} km</div>
            </div>
        </div>
        <div class="forecast" id="forecast-${cityName.toLowerCase()}">
            <div class="forecast-title">3-Day Forecast</div>
            <div class="forecast-grid" id="forecast-grid-${cityName.toLowerCase()}">
                Loading forecast...
            </div>
        </div>
    `;

    weatherGrid.appendChild(weatherCard);
}

function displayForecastData(cityName, forecastData) {
    const forecastGrid = document.getElementById(`forecast-grid-${cityName.toLowerCase()}`);
    
    if (!forecastGrid) return;

    // Get forecast for next 3 days (excluding today)
    const dailyForecasts = {};
    const today = new Date().toDateString();
    
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();
        
        if (dateString !== today && Object.keys(dailyForecasts).length < 3) {
            if (!dailyForecasts[dateString]) {
                dailyForecasts[dateString] = item;
            }
        }
    });

    const forecastItems = Object.values(dailyForecasts).slice(0, 3);
    
    forecastGrid.innerHTML = forecastItems.map(item => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        
        return `
            <div class="forecast-item">
                <div class="forecast-date">${dayName}</div>
                <img src="${iconUrl}" alt="${item.weather[0].description}" class="forecast-icon">
                <div class="forecast-temp">
                    ${Math.round(item.main.temp_max)}°/${Math.round(item.main.temp_min)}°
                </div>
            </div>
        `;
    }).join('');
}

function removeCity(cityName) {
    cities = cities.filter(city => city !== cityName);
    localStorage.setItem('weatherCities', JSON.stringify(cities));
    
    const card = document.getElementById(`card-${cityName}`);
    if (card) {
        card.remove();
    }
}