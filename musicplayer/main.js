// Input handlers
const musicInput = document.getElementById("fileInput")
const player = document.getElementById("audioPlayer")
let currentSongIndex = 0
let playlist = []
let currentPlaylist = null

// Controls
const playPause = document.getElementById("play-pause")
const play = document.getElementById("play")
const pause = document.getElementById("pause")

// Modal controls
const playPauseModal = document.getElementById("play-pause-modal")
const playModal = document.getElementById("play-modal")
const pauseModal = document.getElementById("pause-modal")
const displayModal = document.getElementById("display-modal")
const nextModal = document.getElementById("next-modal")
const prevModal = document.getElementById("prev-modal")

// Other controls
const list = document.getElementById("list")
const next = document.getElementById("next")
const prev = document.getElementById("prev")
const display = document.getElementById("name")
const togglePlaying = document.getElementById("togglePlaying")
const closeModalPlayer = document.getElementById("close-modal")
const modalPlayer = document.getElementById("modal-player")
const disk = document.getElementById("disk")
const addToLibraryBtn = document.getElementById("add-to-library")
const searchInput = document.querySelector(".search input")
const searchButton = document.querySelector(".search button")

// Navigation elements
const navItems = document.querySelectorAll(".bottomnav ul li")
const libraryPage = document.getElementById("library-page")
const settingsPage = document.getElementById("settings-page")
const playlistsPage = document.getElementById("playlists-page")
const backButtons = document.querySelectorAll(".back-button")
const exploreButton = document.getElementById("explore-button")
const themeOptions = document.querySelectorAll(".theme-option")
const createPlaylistForm = document.getElementById("create-playlist-form")
const playlistNameInput = document.getElementById("playlist-name")
const playlistsList = document.getElementById("playlists-list")
const playlistSongs = document.getElementById("playlist-songs")

// Seek bar elements
const seekBar = document.getElementById("seek-bar")
const seekFill = document.getElementById("seek-fill")
const seekHandle = document.getElementById("seek-handle")
const currentTime = document.getElementById("current-time")
const totalTime = document.getElementById("total-time")

// Player tracker and other trackers
let isPlaying = false
let isPlayerToggled = false
let isDraggingSeekBar = false
let currentTheme = localStorage.getItem("theme") || "purple"

// Initialize the app
function initApp() {
  // Load saved theme
  document.body.className = currentTheme + "-theme"
  document.querySelector(`.theme-option.${currentTheme}`).classList.add("active")

  // Load library from local storage
  loadLibrary()

  // Load playlists from local storage
  loadPlaylists()

  // Set up event listeners
  setupEventListeners()
}

// Set up all event listeners
function setupEventListeners() {
  // Player controls
  playPause.addEventListener("click", playPauseAudio)
  playPauseModal.addEventListener("click", playPauseAudio)
  next.addEventListener("click", nextSong)
  nextModal.addEventListener("click", nextSong)
  prev.addEventListener("click", prevSong)
  prevModal.addEventListener("click", prevSong)
  player.addEventListener("ended", nextSong)

  // Modal controls
  togglePlaying.addEventListener("click", toggleMainPlayer)
  closeModalPlayer.addEventListener("click", toggleMainPlayer)

  // File input
  musicInput.addEventListener("change", handleFileInput)

  // Add to library
  addToLibraryBtn.addEventListener("click", addCurrentSongToLibrary)

  // Navigation
  navItems.forEach((item) => {
    item.addEventListener("click", handleNavigation)
  })

  backButtons.forEach((button) => {
    button.addEventListener("click", goBack)
  })

  exploreButton.addEventListener("click", () => {
    window.location.href = "../index.html"
  })

  // Theme options
  themeOptions.forEach((option) => {
    option.addEventListener("click", changeTheme)
  })

  // Create playlist
  createPlaylistForm.addEventListener("submit", createPlaylist)

  // Search
  searchButton.addEventListener("click", performSearch)
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      performSearch()
    }
  })

  // Seek bar
  seekBar.addEventListener("mousedown", startSeek)
  seekBar.addEventListener("touchstart", startSeek, { passive: false })
  document.addEventListener("mousemove", updateSeek)
  document.addEventListener("touchmove", updateSeek, { passive: false })
  document.addEventListener("mouseup", endSeek)
  document.addEventListener("touchend", endSeek)

  // Update seek bar as audio plays
  player.addEventListener("timeupdate", updateSeekBar)

  // When metadata is loaded, update total duration
  player.addEventListener("loadedmetadata", () => {
    totalTime.textContent = formatTime(player.duration)
  })
}

// Handle file input
function handleFileInput(e) {
  const files = Array.from(e.target.files)

  if (files.length === 0) return

  if (playlist.length === 0) {
    playlist = files
    displayPlaylist(playlist)

    // Start playing the first song
    currentSongIndex = 0
    loadAndPlaySong(playlist[currentSongIndex])
  } else {
    // Add new files to the existing playlist
    playlist = [...playlist, ...files]
    displayPlaylist(playlist)
  }
}

// Display playlist in the list
function displayPlaylist(songs) {
  list.innerHTML = ""

  songs.forEach((file, index) => {
    const listItem = createSongListItem(file, index)
    list.appendChild(listItem)
  })
}

// Create a song list item
function createSongListItem(file, index) {
  const listItem = document.createElement("div")
  listItem.className = "file"
  listItem.innerHTML = `
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#ffff">
        <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/>
      </svg>
    </div>
    <div class="info">
      <h6>${file.name}</h6>
      <p>Audio File</p>
    </div>
  `

  listItem.addEventListener("click", () => {
    currentSongIndex = index
    loadAndPlaySong(file)
  })

  return listItem
}

// Load and play a song
function loadAndPlaySong(file) {
  const fileUrl = typeof file === "string" ? file : URL.createObjectURL(file)
  const fileName = typeof file === "string" ? getFileNameFromPath(file) : file.name

  player.src = fileUrl
  player
    .play()
    .then(() => {
      play.style.display = "none"
      playModal.style.display = "none"
      pause.style.display = "flex"
      pauseModal.style.display = "flex"
      display.innerText = fileName
      displayModal.innerText = fileName
      disk.classList.add("rotate")
      isPlaying = true
    })
    .catch((error) => {
      console.error("Error playing audio:", error)
      showToast("Error playing audio")
    })
}

// Get file name from path
function getFileNameFromPath(path) {
  return path.split("/").pop()
}

// Play/Pause audio
function playPauseAudio() {
  if (!playlist || playlist.length === 0) {
    showToast("No songs in playlist")
    return
  }

  if (!isPlaying) {
    player
      .play()
      .then(() => {
        play.style.display = "none"
        playModal.style.display = "none"
        pause.style.display = "flex"
        pauseModal.style.display = "flex"
        disk.classList.add("rotate")
        isPlaying = true
      })
      .catch((error) => {
        console.error("Error playing audio:", error)
        showToast("Error playing audio")
      })
  } else {
    player.pause()
    play.style.display = "flex"
    playModal.style.display = "flex"
    pause.style.display = "none"
    pauseModal.style.display = "none"
    disk.classList.remove("rotate")
    isPlaying = false
  }
}

// Next song
function nextSong() {
  if (!playlist || playlist.length === 0) {
    showToast("No songs in playlist")
    return
  }

  if (currentSongIndex === playlist.length - 1) {
    currentSongIndex = 0
  } else {
    currentSongIndex++
  }

  loadAndPlaySong(playlist[currentSongIndex])
}

// Previous song
function prevSong() {
  if (!playlist || playlist.length === 0) {
    showToast("No songs in playlist")
    return
  }

  if (currentSongIndex === 0) {
    currentSongIndex = playlist.length - 1
  } else {
    currentSongIndex--
  }

  loadAndPlaySong(playlist[currentSongIndex])
}

// Toggle main player
function toggleMainPlayer() {
  if (!isPlayerToggled) {
    modalPlayer.classList.add("modal-open")
    isPlayerToggled = true
  } else {
    modalPlayer.classList.remove("modal-open")
    isPlayerToggled = false
  }
}

// Format time in seconds to MM:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00"

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Update seek bar as audio plays
function updateSeekBar() {
  if (isDraggingSeekBar) return

  const percentage = (player.currentTime / player.duration) * 100
  seekFill.style.width = `${percentage}%`
  seekHandle.style.left = `${percentage}%`
  currentTime.textContent = formatTime(player.currentTime)
}

// Start seeking
function startSeek(e) {
  e.preventDefault()
  isDraggingSeekBar = true
  updateSeekPosition(e)
}

// Update seek position during drag
function updateSeek(e) {
  if (!isDraggingSeekBar) return
  e.preventDefault()
  updateSeekPosition(e)
}

// End seeking
function endSeek() {
  if (!isDraggingSeekBar) return

  isDraggingSeekBar = false
}

// Update seek position based on mouse/touch position
function updateSeekPosition(e) {
  const rect = seekBar.getBoundingClientRect()
  const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX
  let position = (clientX - rect.left) / rect.width

  // Clamp position between 0 and 1
  position = Math.max(0, Math.min(1, position))

  // Update UI
  const percentage = position * 100
  seekFill.style.width = `${percentage}%`
  seekHandle.style.left = `${percentage}%`

  // Update audio position
  player.currentTime = position * player.duration
  currentTime.textContent = formatTime(player.currentTime)
}

// Add current song to library
function addCurrentSongToLibrary() {
  if (!playlist || playlist.length === 0 || currentSongIndex < 0 || currentSongIndex >= playlist.length) {
    showToast("No song playing")
    return
  }

  const currentSong = playlist[currentSongIndex]

  // Can't save blob URLs to localStorage, so we'll save the file name
  // In a real app, you'd use IndexedDB to store the actual files
  const library = JSON.parse(localStorage.getItem("musicLibrary") || "[]")

  // Check if song already exists in library
  const songExists = library.some((song) => song.name === currentSong.name)

  if (songExists) {
    showToast("Song already in library")
    return
  }

  // Add song to library
  library.push({
    name: currentSong.name,
    path: currentSong.name, // In a real app, this would be a persistent path
    dateAdded: new Date().toISOString(),
  })

  localStorage.setItem("musicLibrary", JSON.stringify(library))
  showToast("Added to library")
}

// Load library from local storage
function loadLibrary() {
  const library = JSON.parse(localStorage.getItem("musicLibrary") || "[]")
  const libraryList = document.getElementById("library-list")

  if (library.length === 0) {
    libraryList.innerHTML = '<div class="no-results">No songs in library</div>'
    return
  }

  libraryList.innerHTML = ""

  library.forEach((song) => {
    const libraryItem = document.createElement("div")
    libraryItem.className = "library-item"
    libraryItem.innerHTML = `
      <div class="library-item-icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#ffff">
          <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/>
        </svg>
      </div>
      <div class="library-item-info">
        <h4>${song.name}</h4>
        <p>Added: ${new Date(song.dateAdded).toLocaleDateString()}</p>
      </div>
      <div class="library-actions">
        <div class="library-action play-song" data-song="${song.name}">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff">
            <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/>
          </svg>
        </div>
        <div class="library-action add-to-playlist" data-song="${song.name}">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff">
            <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/>
          </svg>
        </div>
      </div>
    `

    libraryList.appendChild(libraryItem)
  })

  // Add event listeners to play buttons
  document.querySelectorAll(".library-action.play-song").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const songName = button.getAttribute("data-song")
      playSongFromLibrary(songName)
    })
  })

  // Add event listeners to add-to-playlist buttons
  document.querySelectorAll(".library-action.add-to-playlist").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const songName = button.getAttribute("data-song")
      showAddToPlaylistDialog(songName)
    })
  })
}

// Play song from library
function playSongFromLibrary(songName) {
  // In a real app, you'd retrieve the actual file from IndexedDB
  // For this demo, we'll just use the current playlist if it contains the song

  const songIndex = playlist.findIndex((song) => song.name === songName)

  if (songIndex !== -1) {
    currentSongIndex = songIndex
    loadAndPlaySong(playlist[currentSongIndex])
    toggleMainPlayer()
  } else {
    showToast("Song not available in current session")
  }
}

// Show add to playlist dialog
function showAddToPlaylistDialog(songName) {
  const playlists = JSON.parse(localStorage.getItem("playlists") || "[]")

  if (playlists.length === 0) {
    showToast("Create a playlist first")
    return
  }

  // For simplicity, we'll just show a prompt
  const playlistNames = playlists.map((p) => p.name).join(", ")
  const selectedPlaylist = prompt(`Choose a playlist to add "${songName}" to: ${playlistNames}`)

  if (!selectedPlaylist) return

  const playlist = playlists.find((p) => p.name === selectedPlaylist)

  if (!playlist) {
    showToast("Playlist not found")
    return
  }

  // Check if song already exists in playlist
  if (playlist.songs.includes(songName)) {
    showToast("Song already in playlist")
    return
  }

  // Add song to playlist
  playlist.songs.push(songName)

  // Update playlists in localStorage
  localStorage.setItem("playlists", JSON.stringify(playlists))

  showToast(`Added to ${selectedPlaylist}`)

  // Refresh playlists display
  loadPlaylists()
}

// Load playlists from local storage
function loadPlaylists() {
  const playlists = JSON.parse(localStorage.getItem("playlists") || "[]")

  if (playlists.length === 0) {
    playlistsList.innerHTML = '<div class="no-results">No playlists created</div>'
    return
  }

  playlistsList.innerHTML = ""

  playlists.forEach((playlist) => {
    const playlistItem = document.createElement("div")
    playlistItem.className = "playlist-item"
    playlistItem.innerHTML = `
      <div>
        <h3>${playlist.name}</h3>
        <p>${playlist.songs.length} songs</p>
      </div>
      <div class="library-action">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff">
          <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/>
        </svg>
      </div>
    `

    playlistItem.addEventListener("click", () => {
      loadPlaylistSongs(playlist)
    })

    playlistsList.appendChild(playlistItem)
  })
}

// Load songs from a playlist
function loadPlaylistSongs(playlist) {
  currentPlaylist = playlist

  // Show playlist songs section
  playlistSongs.style.display = "block"
  document.getElementById("playlist-title").textContent = playlist.name

  const songsList = document.getElementById("playlist-songs-list")
  songsList.innerHTML = ""

  if (playlist.songs.length === 0) {
    songsList.innerHTML = '<div class="no-results">No songs in this playlist</div>'
    return
  }

  playlist.songs.forEach((songName) => {
    const songItem = document.createElement("div")
    songItem.className = "library-item"
    songItem.innerHTML = `
      <div class="library-item-icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#ffff">
          <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/>
        </svg>
      </div>
      <div class="library-item-info">
        <h4>${songName}</h4>
      </div>
      <div class="library-actions">
        <div class="library-action play-song" data-song="${songName}">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff">
            <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/>
          </svg>
        </div>
        <div class="library-action remove-from-playlist" data-song="${songName}">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
          </svg>
        </div>
      </div>
    `

    songsList.appendChild(songItem)
  })

  // Add event listeners to play buttons
  document.querySelectorAll("#playlist-songs-list .library-action.play-song").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const songName = button.getAttribute("data-song")
      playSongFromLibrary(songName)
    })
  })

  // Add event listeners to remove buttons
  document.querySelectorAll("#playlist-songs-list .library-action.remove-from-playlist").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const songName = button.getAttribute("data-song")
      removeFromPlaylist(songName)
    })
  })

  // Add play all button
  const playAllButton = document.createElement("button")
  playAllButton.className = "playlist-form"
  playAllButton.textContent = "Play All"
  playAllButton.addEventListener("click", () => {
    playPlaylist(playlist)
  })

  songsList.prepend(playAllButton)
}

// Remove song from playlist
function removeFromPlaylist(songName) {
  if (!currentPlaylist) return

  const playlists = JSON.parse(localStorage.getItem("playlists") || "[]")
  const playlistIndex = playlists.findIndex((p) => p.name === currentPlaylist.name)

  if (playlistIndex === -1) return

  // Remove song from playlist
  const songIndex = playlists[playlistIndex].songs.indexOf(songName)
  if (songIndex !== -1) {
    playlists[playlistIndex].songs.splice(songIndex, 1)
  }

  // Update playlists in localStorage
  localStorage.setItem("playlists", JSON.stringify(playlists))

  // Update current playlist
  currentPlaylist = playlists[playlistIndex]

  // Refresh playlist songs display
  loadPlaylistSongs(currentPlaylist)

  showToast("Removed from playlist")
}

// Play all songs in a playlist
function playPlaylist(playlist) {
  if (!playlist || playlist.songs.length === 0) {
    showToast("No songs in playlist")
    return
  }

  // In a real app, you'd retrieve the actual files from IndexedDB
  // For this demo, we'll just use the current playlist if it contains the songs

  const firstSong = playlist.songs[0]
  const songIndex = this.playlist.findIndex((song) => song.name === firstSong)

  if (songIndex !== -1) {
    currentSongIndex = songIndex
    loadAndPlaySong(this.playlist[currentSongIndex])
    toggleMainPlayer()
  } else {
    showToast("Songs not available in current session")
  }
}

// Create a new playlist
function createPlaylist(e) {
  e.preventDefault()

  const playlistName = playlistNameInput.value.trim()

  if (!playlistName) {
    showToast("Please enter a playlist name")
    return
  }

  const playlists = JSON.parse(localStorage.getItem("playlists") || "[]")

  // Check if playlist already exists
  if (playlists.some((p) => p.name === playlistName)) {
    showToast("Playlist already exists")
    return
  }

  // Create new playlist
  playlists.push({
    name: playlistName,
    songs: [],
    dateCreated: new Date().toISOString(),
  })

  // Save to localStorage
  localStorage.setItem("playlists", JSON.stringify(playlists))

  // Reset form
  playlistNameInput.value = ""

  // Refresh playlists display
  loadPlaylists()

  showToast("Playlist created")
}

// Handle navigation
function handleNavigation(e) {
  const navItem = e.currentTarget
  const index = Array.from(navItems).indexOf(navItem)

  // Reset active state
  navItems.forEach((item) => item.classList.remove("active"))
  navItem.classList.add("active")

  // Handle navigation based on index
  switch (index) {
    case 0: // Home
      goBack()
      break
    case 1: // Explore
      window.location.href = "../index.html"
      break
    case 2: // Library
      libraryPage.style.display = "flex"
      loadLibrary()
      break
    case 3: // Settings
      settingsPage.style.display = "flex"
      break
  }
}

// Go back to main screen
function goBack() {
  libraryPage.style.display = "none"
  settingsPage.style.display = "none"
  playlistsPage.style.display = "none"

  // Reset active state
  navItems.forEach((item) => item.classList.remove("active"))
}

// Change theme
function changeTheme(e) {
  const themeOption = e.currentTarget
  const theme = themeOption.classList.contains("dark")
    ? "dark"
    : themeOption.classList.contains("light")
      ? "light"
      : "purple"

  // Update active state
  themeOptions.forEach((option) => option.classList.remove("active"))
  themeOption.classList.add("active")

  // Apply theme
  document.body.className = theme + "-theme"

  // Save theme preference
  localStorage.setItem("theme", theme)
  currentTheme = theme

  showToast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`)
}

// Perform search
function performSearch() {
  const query = searchInput.value.trim().toLowerCase()

  if (!query) {
    // If search is empty, show current playlist
    if (playlist && playlist.length > 0) {
      displayPlaylist(playlist)
    }
    return
  }

  // Search in library
  const library = JSON.parse(localStorage.getItem("musicLibrary") || "[]")
  const results = library.filter((song) => song.name.toLowerCase().includes(query))

  if (results.length === 0) {
    list.innerHTML = '<div class="no-results">No results found</div>'
    return
  }

  // Display results
  list.innerHTML = ""

  results.forEach((song) => {
    const listItem = document.createElement("div")
    listItem.className = "file"
    listItem.innerHTML = `
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#ffff">
          <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/>
        </svg>
      </div>
      <div class="info">
        <h6>${song.name}</h6>
        <p>Library</p>
      </div>
    `

    listItem.addEventListener("click", () => {
      playSongFromLibrary(song.name)
    })

    list.appendChild(listItem)
  })
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.textContent = message

  document.body.appendChild(toast)

  // Show toast
  setTimeout(() => {
    toast.classList.add("show")
  }, 10)

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show")

    // Remove from DOM after animation
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)

