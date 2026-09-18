const weatherIcon = document.querySelector("#weather-icon");
const weatherReading = document.querySelector("#weather-reading");
const weatherStatus = document.querySelector("#weather-status");

const weatherDescriptions = {
	0: ["☀️", "Clear skies"],
	1: ["🌤️", "Mostly clear"],
	2: ["⛅", "Partly cloudy"],
	3: ["☁️", "Overcast"],
	45: ["🌫️", "Foggy"],
	48: ["🌫️", "Foggy"],
	51: ["🌦️", "Light drizzle"],
	53: ["🌦️", "Drizzle"],
	55: ["🌧️", "Heavy drizzle"],
	61: ["🌦️", "Light rain"],
	63: ["🌧️", "Rain"],
	65: ["🌧️", "Heavy rain"],
	71: ["🌨️", "Light snow"],
	73: ["❄️", "Snow"],
	75: ["❄️", "Heavy snow"],
	80: ["🌦️", "Rain showers"],
	81: ["🌧️", "Rain showers"],
	82: ["🌧️", "Heavy showers"],
	95: ["⛈️", "Thunderstorms"],
	96: ["⛈️", "Storms and hail"],
	99: ["⛈️", "Storms and hail"]
};

function showWeatherError(message) {
	weatherIcon.textContent = "◌";
	weatherReading.textContent = "Weather unavailable";
	weatherStatus.textContent = message;
}

async function loadWeather(position) {
	const { latitude, longitude } = position.coords;
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;

	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error("Weather request failed");
		const data = await response.json();
		const [icon, description] = weatherDescriptions[data.current.weather_code] || ["🌡️", "Current conditions"];
		weatherIcon.textContent = icon;
		weatherReading.textContent = `${Math.round(data.current.temperature_2m)}°F · ${description}`;
		weatherStatus.textContent = "Live from your browser location";
	} catch (error) {
		showWeatherError("We couldn't reach the weather service.");
	}
}

if ("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(loadWeather, () => {
		showWeatherError("Enable location to see your weather.");
	}, { enableHighAccuracy: false, timeout: 10000, maximumAge: 900000 });
} else {
	showWeatherError("Location is not supported by this browser.");
}
