const API_KEY = '7ded80d91f2b280ec979100cc8bbba94'

const getCurrentWeather = location => {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`

  let req = new XMLHttpRequest()
  req.open('GET', fetchUrl, true)
  req.addEventListener('load', () => {
    const currentWeather = JSON.parse(req.responseText)
    console.log('Current weather', currentWeather)
    showWeather(currentWeather)
  })
  req.send()
}

const getFutureWeather = async location => {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`

  const response = await fetch(fetchUrl)
  const { list } = await response.json()
  console.log('Future weather', list)
  showWeather(list)
}

const showWeather = data => {
  const isFuture = Array.isArray(data)

  // Get wrapper
  const wrapperElement = document.querySelector(
    isFuture ? '#future-weather-wrapper' : '#current-weather-wrapper'
  )

  // Clear wrapper children
  wrapperElement.innerHTML = ''

  // Create divs with weather information
  for (const forecast of isFuture ? data : [data]) {
    const forecastDiv = document.createElement('div')
    forecastDiv.classList.add('weather-box')

    // Add date
    const dateElement = document.createElement('p')
    dateElement.textContent = forecast.dt_txt || 'Current'
    forecastDiv.appendChild(dateElement)

    // Add temperatures
    const temperatureElement = document.createElement('p')
    temperatureElement.textContent = `Temperature: ${forecast.main.temp}C`
    forecastDiv.appendChild(temperatureElement)
    const feelsLikeElement = document.createElement('p')
    feelsLikeElement.textContent = `Feels like: ${forecast.main.feels_like}C`
    forecastDiv.appendChild(feelsLikeElement)

    // Add weather
    const weatherElement = document.createElement('p')
    weatherElement.textContent = forecast.weather[0].description
    forecastDiv.appendChild(weatherElement)

    // Append child to wrapper
    wrapperElement.appendChild(forecastDiv)
  }
}

const handleClick = () => {
  const location = document.querySelector('#location-input').value
  getFutureWeather(location)
  getCurrentWeather(location)
}

document.querySelector('#weather-button').addEventListener('click', handleClick)
