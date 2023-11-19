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
    new Notification(text)
  } else if (Notification.permission !== 'denied') {
    // We need to ask the user for permission
    Notification.requestPermission().then(permission => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        new Notification(text)
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
document.getElementById('start-puzzle-button').addEventListener('click', () => {
  leafletImage(map, function (_, canvas) {
    // Calculate tile size
    const rows = 4
    const cols = 4
    const tileSize = canvas.width / rows

    // Get reference to box wrapper
    const puzzleBoxWrapper = document.getElementById('puzzle-box')

    // Array which will be shuffled before showing it to user
    const puzzleBoxArray = []

    // Split canvas into smaller canvases
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Create a canvas element
        const smallerCanvas = document.createElement('canvas')

        // Assign properties
        smallerCanvas.width = tileSize
        smallerCanvas.height = tileSize
        smallerCanvas.draggable = true
        smallerCanvas.dataset.id = row * rows + col

        // Assign event handlers
        smallerCanvas.addEventListener('dragstart', handleDragStart)

        // Get the context of the canvas
        var context = smallerCanvas.getContext('2d')

        // Draw image onto smaller canvas
        context.drawImage(
          canvas,
          col * tileSize,
          row * tileSize,
          tileSize,
          tileSize,
          0,
          0,
          tileSize,
          tileSize
        )

        // Append canvas into array
        puzzleBoxArray.push(smallerCanvas)
      }
    }

    // Shuffle array
    // shuffleArray(puzzleBoxArray)

    // Add shuffled canvases to dom
    for (const smallerCanvas of puzzleBoxArray) {
      puzzleBoxWrapper.appendChild(smallerCanvas)
    }
  })
})

const handleDragStart = event => {
  event.dataTransfer.setData('id', event.target.dataset.id)
}

const handleDrop = event => {
  event.preventDefault()

  // Get puzzle tile element
  const puzzleTileId = event.dataTransfer.getData('id')
  const puzzleTile = document.querySelector(`canvas[data-id="${puzzleTileId}"]`)

  // Before assigning tile, check if target does not have children. If so, move them to puzzle box
  const wrapperReference =
    event.target.tagName === 'CANVAS' ? event.target.parentNode : event.target

  if (wrapperReference.childNodes.length > 0) {
    const puzzleBoxReference = document.getElementById('puzzle-box')

    for (const childNode of wrapperReference.childNodes) {
      if (childNode.dataset.id !== puzzleTileId) {
        wrapperReference.removeChild(childNode)
        puzzleBoxReference.appendChild(childNode)
        break
      }
    }
  }

  // Assign tile into target
  wrapperReference.appendChild(puzzleTile)

  // Check if puzzle are finished
  checkIfFinished()
}

function allowDrop(event) {
  event.preventDefault()
}

// Helpers
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const checkIfFinished = () => {
  for (const puzzleTile of puzzleBoardReference.children) {

    if (puzzleTile.children.length === 0) {
      return
    }

    const puzzleId = puzzleTile.children[0].dataset.id
    const requiredId = puzzleTile.id.split('-')[2]

    if (puzzleId !== requiredId) {
      return
    }
  }

  createNotification('You did it!')
}

// Globals
let map
const puzzleBoardReference = document.getElementById('puzzle-board')

// Getting location
getLocation(main)

// Main
function main(location) {
  map = setMap(location)
}
