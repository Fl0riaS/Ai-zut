// Geolocation
function getLocation(callback) {
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(callback)
  } else {
    x.innerHTML = 'Geolocation is not supported by this browser.'
  }
}

// Notifications
function createNotification(text) {
  if (!('Notification' in window)) {
    // Check if the browser supports notifications
    alert('This browser does not support desktop notification')
  } else if (Notification.permission === 'granted') {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification(text)
  } else if (Notification.permission !== 'denied') {
    // We need to ask the user for permission
    Notification.requestPermission().then(permission => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        const notification = new Notification(text)
      }
    })
  }
}

// Map
function setMap({ coords }) {
  const map = L.map('map').setView([coords.latitude, coords.longitude], 13)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  return map
}

function markLocation() {
  getLocation(({ coords }) => {
    L.marker([coords.latitude, coords.longitude]).addTo(map)
  })
}

// Puzzle
function startPuzzle() {
  const fullCanvas = document.getElementById('myScreenCanvas')
  const fullContext = canvas.getContext('2d')

  
}

// Globals
let map

// Getting location
getLocation(main)

// Main
function main(location) {
  map = setMap(location)
}
