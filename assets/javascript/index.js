//imports section

import Youtube from "./youtube.js"
import FirebaseImplementation from "./firebase.js"

//grabbing DOM elements
const menuButton = document.getElementById("menu")
const sidenav = document.getElementById("sidenav")
const suggestButton = document.getElementById("suggest")
const suggestionForm = document.getElementById("suggestionForm")
const hamburger = document.getElementById("hamburger")
const featured = document.getElementById("featured")
const archives = document.getElementById("archives")
const featuredPlaceholder = document.getElementById("default-featured")
const archivedPlaceholder = document.getElementById("default-archives")
const player = document.getElementById("youtube-player")
const playerContainer = document.getElementById("player-container")
const sendRequest = document.getElementById("sendrequest")
const closePlayer = document.getElementById("close-player")
const controller = document.getElementById("controller")
const loginPrompt = document.getElementById("loginprompt")
const closeLoginPrompt = document.getElementById("closeloginprompt")

//useridentity
const usernameDisplay = document.getElementById("displayname")
const accountTypeDisplay = document.getElementById("displayaccount")
const accountMenu = document.getElementById("account")
const accountButton = document.getElementById("accountIcon")
const closeAccountBtn = document.getElementById("closeAccount")
const logoutBtn = document.getElementById("logoutbtn")
const switchPlayerBtn = document.getElementById("switchplayer")

//suggestion section
const artistName = document.getElementById("artistName")
const songTitle = document.getElementById("title")
const youTubeURL = document.getElementById("youtubeURL")

// Add error container for form validation
const formErrors = document.createElement("div")
formErrors.id = "formErrors"
formErrors.className = "error-container"
formErrors.style.color = "red"
formErrors.style.marginTop = "10px"
formErrors.style.display = "none"
suggestionForm.appendChild(formErrors)
const topten = document.getElementById("topten")
const toptenPlaceholder = document.querySelector("#topten > .default")

// Global variables to track autoplay functionality
let currentPlayingSectionId = null; // "featured", "topten", or "archives"
let currentPlayingIndex = -1;
let featuredVideoIds = [];
let hottestVideoIds = [];
let archiveVideoIds = [];

//globals
const redirecturl = "index.html"

const body = document.body
let toggleTracker = false
let accountTracker = false

let userInfo

//class instantiations
const playlist = new Youtube()
const firebase = new FirebaseImplementation()

// Set initial position for controller at the bottom right
controller.style.right = "20px";
controller.style.bottom = "20px";
controller.style.left = "auto";
controller.style.top = "auto";

//functions

// Implementation of our own YouTubeVideoId function since the external script failed to load
function extractYouTubeVideoId(url) {
  if (!url) return null

  // Regular expressions to match YouTube URL patterns
  const regexps = [
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/,
  ]

  // Try each regex pattern
  for (const regex of regexps) {
    const match = url.match(regex)
    if (match && match[1]) {
      return match[1]
    }
  }

  // If direct ID was passed and it's 11 characters
  if (url.length === 11) {
    return url
  }

  return null
}

// Function to validate YouTube URL
function isValidYoutubeUrl(url) {
  // Basic validation to check if it's a YouTube URL
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  if (!youtubeRegex.test(url)) {
    return false
  }

  // Try to extract video ID as additional validation
  try {
    const videoId = extractYouTubeVideoId(url)
    return videoId !== null && videoId.length > 0
  } catch (error) {
    console.error("Error validating YouTube URL:", error)
    return false
  }
}

// Function to collect all video IDs when the page loads
async function collectAllVideoIds() {
  // Get featured/top 10 videos
  const playlistArray = await playlist.prepareInfo();
  featuredVideoIds = [];
  for (var id in playlistArray) {
    featuredVideoIds.push(playlistArray[id].videoID);
  }
  
  // Get hottest videos
  const hottestSongs = await firebase.getHottestSongs();
  hottestVideoIds = hottestSongs.map(song => extractYouTubeVideoId(song.youtubeURL)).filter(id => id);
  
  // Get archive videos
  const archiveVideos = await firebase.getArchiveVideos();
  archiveVideoIds = archiveVideos.map(video => extractYouTubeVideoId(video.youtubeURL)).filter(id => id);
  
  console.log("Collected video IDs for autoplay:", {
    featured: featuredVideoIds.length,
    hottest: hottestVideoIds.length,
    archives: archiveVideoIds.length
  });
}

// Function to play next video based on current position
function playNextVideo() {
  // If no section is currently playing, default to featured
  if (!currentPlayingSectionId) {
    currentPlayingSectionId = "featured";
    currentPlayingIndex = 0;
  } else {
    // Move to next video in current section
    currentPlayingIndex++;
  }
  
  let videoIdToPlay = null;
  
  // Check if we need to move to the next section
  if (currentPlayingSectionId === "featured") {
    if (currentPlayingIndex < featuredVideoIds.length) {
      videoIdToPlay = featuredVideoIds[currentPlayingIndex];
    } else {
      // Move to hottest section
      currentPlayingSectionId = "topten";
      currentPlayingIndex = 0;
      if (hottestVideoIds.length > 0) {
        videoIdToPlay = hottestVideoIds[currentPlayingIndex];
      }
    }
  }
  
  if (!videoIdToPlay && currentPlayingSectionId === "topten") {
    if (currentPlayingIndex < hottestVideoIds.length) {
      videoIdToPlay = hottestVideoIds[currentPlayingIndex];
    } else {
      // Move to archives section
      currentPlayingSectionId = "archives";
      currentPlayingIndex = 0;
      if (archiveVideoIds.length > 0) {
        videoIdToPlay = archiveVideoIds[currentPlayingIndex];
      }
    }
  }
  
  if (!videoIdToPlay && currentPlayingSectionId === "archives") {
    if (currentPlayingIndex < archiveVideoIds.length) {
      videoIdToPlay = archiveVideoIds[currentPlayingIndex];
    } else {
      // Loop back to featured
      currentPlayingSectionId = "featured";
      currentPlayingIndex = 0;
      if (featuredVideoIds.length > 0) {
        videoIdToPlay = featuredVideoIds[currentPlayingIndex];
      }
    }
  }
  
  // If we found a video to play, load it
  if (videoIdToPlay) {
    console.log(`Playing next video from ${currentPlayingSectionId}, index ${currentPlayingIndex}`);
    playerContainer.style.display = "block";
    controller.style.display = "none";
    player.setAttribute(
      "src",
      `https://www.youtube.com/embed/${videoIdToPlay}?autoplay=1&controls=1&showinfo=0&modestbranding=1&rel=0&enablejsapi=1`
    );
  }
}

// Set up YouTube iframe API
function loadYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// YouTube API callbacks
window.onYouTubeIframeAPIReady = function() {
  console.log("YouTube API ready");
};

// Function to listen for video end events
function setupYouTubePlayerListener() {
  // This listens for messages from the iframe
  window.addEventListener('message', function(event) {
    // Try to parse the data
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      return; // Not a JSON message
    }
    
    // Check if this is from YouTube and if video ended
    if (data.event === 'onStateChange' && data.info === 0) {
      console.log("Video ended, playing next");
      playNextVideo();
    }
  });
}

// Function to display error messages
function showError(message) {
  formErrors.textContent = message
  formErrors.style.display = "block"

  // Hide the error after 5 seconds
  setTimeout(() => {
    formErrors.style.display = "none"
  }, 5000)
}

// Function to show success messages
function showSuccess(message) {
  formErrors.textContent = message
  formErrors.style.color = "green"
  formErrors.style.display = "block"

  // Hide the success message after 3 seconds
  setTimeout(() => {
    formErrors.style.display = "none"
    formErrors.style.color = "red" // Reset to error color
  }, 3000)
}

// Function to clear all form fields
function clearForm() {
  artistName.value = ""
  songTitle.value = ""
  youTubeURL.value = ""
  formErrors.style.display = "none"
}

//function to check if user is signed in on load of the document
//we will also update the user name and account preferences
async function checkLogInStatus() {
  const resultBody = await firebase.checkSignInStatus()

  if (resultBody === null) {
    promptLogInSignUp()
    return
  }
  // console.log(resultBody);
  userInfo = resultBody
  return resultBody
}

async function updateDashboard(userInfo) {
  if (!userInfo) return
  usernameDisplay.innerText = userInfo.displayName.split(",")[0]
  accountTypeDisplay.innerText = userInfo.displayName.split(",")[1]

  // Check if user is a fan and add artist page navigation button
  const accountType = userInfo.displayName.split(",")[1]
  const preferencesDiv = document.querySelector(".preferences")

  // Remove any existing artist navigation button to avoid duplicates
  const existingArtistBtn = document.getElementById("artistPageBtn")
  if (existingArtistBtn) {
    existingArtistBtn.remove()
  }

  // If user is a fan, add the artist page navigation button
  if (accountType && accountType.trim().toLowerCase() === "fan") {
    const artistBtn = document.createElement("button")
    artistBtn.id = "artistPageBtn"
    artistBtn.className = "actionbtn"
    artistBtn.textContent = "Become an Artist"
    artistBtn.style.width = "100%"
    artistBtn.style.marginTop = "15px"

    // Add event listener to navigate to artist page
    artistBtn.addEventListener("click", () => {
      window.location.href = "/assets/html/artistpage.html"
    })

    // Add the button after the preference buttons
    preferencesDiv.appendChild(artistBtn)
  }
}

//prompt the user to sign up or sign in if not signed in, this function will be called inside the checkLogInStatus();
function promptLogInSignUp() {
  loginPrompt.style.display = "flex"
}

//the following functions are a set of functions to sign up, log in or log out user

function logOut() {
  firebase.signOutUser(redirecturl)
}

//before we do anything, let us check if a user is signed in and if not, prompt the user to log in.
await checkLogInStatus()
await updateDashboard(await checkLogInStatus())

async function populateArchives() {
  try {
    const videos = await firebase.getArchiveVideos()

    if (!videos || videos.length === 0) {
      console.log("No archived videos found")
      return
    }

    const myIDs = []
    videos.forEach((video) => {
      try {
        const videoId = extractYouTubeVideoId(video.youtubeURL)
        if (!videoId) {
          console.error("Could not extract video ID from URL:", video.youtubeURL)
          return
        }

        const card = document.createElement("div")
        card.setAttribute("class", "card")
        card.innerHTML = `<div class="like-container"><i style="font-size:24px" class="fa">&#xf004;</i> <p>${video.likeCount || 0}</p></div><h4 class="songInfo">${video.ArtistName || "Unknown"}-${video.Title || "Untitled"}</h4>`
        card.style.background = `url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg')`
        card.style.backgroundSize = "cover"
        card.style.backgroundPosition = "center"
        archives.appendChild(card)
        myIDs.push(videoId)
      } catch (err) {
        console.error("Error processing video:", err)
      }
    })

    const archiveChildren = document.querySelectorAll("#archives > .card")
    archiveChildren.forEach((element, index) => {
      element.addEventListener("click", (e) => {
        if (e.target.className === "fa") {
          e.stopPropagation()
          console.log("clicked like at pos: " + index)
          const songInfo = element.querySelector(".songInfo")
          if (!songInfo) return

          const parts = songInfo.textContent.split("-")
          if (parts.length < 2) return

          const artistName = parts[0]
          const songTitle = parts[1]

          firebase
            .likeSong(artistName, songTitle)
            .then((newLikeCount) => {
              const likeCounter = element.querySelector(".like-container > p")
              if (likeCounter) {
                likeCounter.innerText = newLikeCount
              }
            })
            .catch((err) => {
              console.error("Error liking song:", err)
            })
          return
        }

        if (index < myIDs.length) {
          playerContainer.style.display = "block"
          controller.style.display = "none"
          // Set current playing section and index for autoplay
          currentPlayingSectionId = "archives"
          currentPlayingIndex = index - 1
          player.setAttribute(
            "src",
            `https://www.youtube.com/embed/${myIDs[index - 1]}?autoplay=1&controls=1&showinfo=0&modestbranding=1&rel=0&enablejsapi=1`
          )
        }
      })
    })

    // Save IDs for autoplay
    archiveVideoIds = myIDs;

    // Remove placeholder if it exists and we have videos
    if (archivedPlaceholder && videos.length > 0) {
      archives.removeChild(archivedPlaceholder)
    }
  } catch (err) {
    console.error("Error populating archives:", err)
  }
}

await populateArchives()

async function getPosition() {
  try {
    const playlistArray = await playlist.prepareInfo()
    var indices = []
    for (var index in playlistArray) {
      indices.push(Number.parseInt(index) + 1)
    }
    return indices
  } catch (err) {
    console.error("Error getting positions:", err)
    return []
  }
}

async function getVideoId() {
  try {
    const playlistArray = await playlist.prepareInfo()
    var ids = []
    for (var id in playlistArray) {
      ids.push(
        `https://www.youtube.com/embed/${playlistArray[id].videoID}?autoplay=1&controls=1&showinfo=0&modestbranding=1&rel=0&enablejsapi=1`
      )
    }
    return ids
  } catch (err) {
    console.error("Error getting video IDs:", err)
    return []
  }
}

async function populateTopTen() {
  try {
    const playlistObject = await playlist.prepareInfo()
    const array = await getPosition()
    const links = await getVideoId()

    if (!playlistObject || Object.keys(playlistObject).length === 0) {
      console.log("No playlist items found")
      return
    }

    const ids = []
    for (var video in playlistObject) {
      const card = document.createElement("div")
      card.setAttribute("class", "card")
      card.innerHTML = `<div class="like-container"><i style="font-size:24px" class="fa">&#xf004;</i> <p>0</p></div><h4>${array[video] || "?"}. ${playlistObject[video].title || "Untitled"}</h4>`

      const thumbnail = playlistObject[video].thumbnailUrl
      if (thumbnail) {
        card.style.background = `url(${thumbnail})`
        card.style.backgroundPosition = "center"
        card.style.backgroundSize = "cover"
        card.style.backgroundRepeat = "no-repeat"
      }

      featured.appendChild(card)
      ids.push(playlistObject[video].videoID)
    }

    // Save IDs for autoplay
    featuredVideoIds = ids;

    const featureChildren = document.querySelectorAll("#featured > .card")
    featureChildren.forEach((element, index) => {
      element.addEventListener("click", () => {
        if (index > 0 && index <= links.length) {
          playerContainer.style.display = "block"
          controller.style.display = "none"
          // Set current playing section and index for autoplay
          currentPlayingSectionId = "featured"
          currentPlayingIndex = index - 1
          player.setAttribute(`src`, `${links[index - 1]}`)
        }
      })
    })

    // Remove placeholder if it exists and we have videos
    if (featuredPlaceholder && Object.keys(playlistObject).length > 0) {
      featured.removeChild(featuredPlaceholder)
    }
  } catch (err) {
    console.error("Error populating top ten:", err)
  }
}

await populateTopTen()

function toggleMenu() {
  if (!toggleTracker) {
    sidenav.classList.add("sidenavOpen")
    toggleTracker = true
  } else {
    sidenav.classList.remove("sidenavOpen")
    suggestionForm.classList.remove("indicator")
    toggleTracker = false
  }
}

function toggleAccountBar() {
  if (!accountTracker) {
    accountMenu.classList.add("openAccount")
    accountTracker = true
  } else {
    accountMenu.classList.remove("openAccount")
    accountTracker = false
  }
}

function closeAccountBar() {
  if (accountTracker) {
    accountMenu.classList.remove("openAccount")
    accountTracker = false
  }
}

function closeMenu() {
  if (toggleTracker) {
    sidenav.classList.remove("sidenavOpen")
    toggleTracker = false
  }
}

function highlightForm() {
  if (!toggleTracker) {
    sidenav.classList.add("sidenavOpen")
    toggleTracker = true
    suggestionForm.classList.add("indicator")
    return
  }
  suggestionForm.classList.add("indicator")
}

// Function to validate the form before submission
function validateForm() {
  if (!artistName.value.trim()) {
    showError("Please enter the artist name")
    artistName.focus()
    return false
  }

  if (!songTitle.value.trim()) {
    showError("Please enter the song title")
    songTitle.focus()
    return false
  }

  if (!youTubeURL.value.trim()) {
    showError("Please enter a YouTube URL")
    youTubeURL.focus()
    return false
  }

  if (!isValidYoutubeUrl(youTubeURL.value)) {
    showError("Please enter a valid YouTube URL")
    youTubeURL.focus()
    return false
  }

  return true
}

async function populateHottestSongs() {
  try {
    const hottestSongs = await firebase.getHottestSongs()

    if (!hottestSongs || hottestSongs.length === 0) {
      console.log("No hottest songs found")
      return
    }

    const myIDs = []
    hottestSongs.forEach((song) => {
      try {
        const videoId = extractYouTubeVideoId(song.youtubeURL)
        if (!videoId) {
          console.error("Could not extract video ID from URL:", song.youtubeURL)
          return
        }

        const card = document.createElement("div")
        card.setAttribute("class", "card")
        card.innerHTML = `<div class="like-container"><i style="font-size:24px" class="fa">&#xf004;</i> <p>${song.likeCount || 0}</p></div><h4 class="songInfo">${song.ArtistName || "Unknown"}-${song.Title || "Untitled"}</h4><p class="suggested-by">Suggested by: ${song.SuggestedBy || "Anonymous"}</p>`
        card.style.background = `url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg')`
        card.style.backgroundSize = "cover"
        card.style.backgroundPosition = "center"
        topten.appendChild(card)
        myIDs.push(videoId)
      } catch (err) {
        console.error("Error processing hottest song:", err)
      }
    })

    // Save IDs for autoplay
    hottestVideoIds = myIDs;

    const hottestChildren = document.querySelectorAll("#topten > .card")
    hottestChildren.forEach((element, index) => {
      element.addEventListener("click", (e) => {
        if (e.target.className === "fa") {
          e.stopPropagation()
          console.log("clicked like at pos: " + index)
          const songInfo = element.querySelector(".songInfo")
          if (!songInfo) return

          const parts = songInfo.textContent.split("-")
          if (parts.length < 2) return

          const artistName = parts[0]
          const songTitle = parts[1]

          firebase
            .likeSong(artistName, songTitle)
            .then((newLikeCount) => {
              const likeCounter = element.querySelector(".like-container > p")
              if (likeCounter) {
                likeCounter.innerText = newLikeCount
              }
            })
            .catch((err) => {
              console.error("Error liking song:", err)
            })
          return
        }

        if (index < myIDs.length) {
          playerContainer.style.display = "block"
          controller.style.display = "none"
          // Set current playing section and index for autoplay
          currentPlayingSectionId = "topten"
          currentPlayingIndex = index
          player.setAttribute(
            "src",
            `https://www.youtube.com/embed/${myIDs[index]}?autoplay=1&controls=1&showinfo=0&modestbranding=1&rel=0&enablejsapi=1`
          )
        }
      })
    })

    // Remove placeholder if it exists and we have songs
    if (toptenPlaceholder && hottestSongs.length > 0) {
      topten.removeChild(toptenPlaceholder)
    }
  } catch (err) {
    console.error("Error populating hottest songs:", err)
  }
}

await populateHottestSongs()

// Initialize YouTube API and set up autoplay
loadYouTubeAPI();
setupYouTubePlayerListener();
await collectAllVideoIds();

//event listeners

menuButton.addEventListener("click", (e) => {
  e.stopPropagation()
  toggleMenu()
})

suggestButton.addEventListener("click", (e) => {
  e.stopPropagation()
  highlightForm()
})

hamburger.addEventListener("click", (e) => {
  e.stopPropagation()
  toggleMenu()
})

// Enhanced event listener for form submission
sendRequest.addEventListener("click", async (e) => {
  e.preventDefault()
  formErrors.style.display = "none"

  // Validate the form
  if (!validateForm()) {
    return
  }

  // Check if user is logged in
  if (!userInfo) {
    showError("You must be logged in to submit suggestions")
    promptLogInSignUp()
    return
  }

  // Show loading state
  sendRequest.textContent = "Sending..."
  sendRequest.disabled = true

  try {
    // Send the request
    await firebase.sendRequest(songTitle.value, artistName.value, youTubeURL.value, userInfo.displayName.split(",")[0])

    // Show success message
    showSuccess("Suggestion submitted successfully!")

    // Clear the form
    clearForm()
  } catch (error) {
    console.error("Error submitting suggestion:", error)
    showError("Failed to submit suggestion. Please try again later.")
  } finally {
    // Reset button state
    sendRequest.textContent = "Suggest"
    sendRequest.disabled = false
  }
})

// Add event listeners for real-time validation
youTubeURL.addEventListener("blur", () => {
  if (youTubeURL.value.trim() && !isValidYoutubeUrl(youTubeURL.value)) {
    showError("Please enter a valid YouTube URL")
  } else {
    formErrors.style.display = "none"
  }
})

body.addEventListener("click", () => {
  closeMenu()
  closeAccountBar()
})

sidenav.addEventListener("click", (e) => {
  e.stopPropagation()
})

closePlayer.addEventListener("click", (e) => {
  e.stopPropagation()
  playerContainer.style.display = "none"
  controller.style.display = "block"
  // Position the controller in the bottom right corner
  controller.style.right = "20px";
  controller.style.bottom = "20px";
  controller.style.left = "auto";
  controller.style.top = "auto";
})

controller.addEventListener("click", () => {
  playerContainer.style.display = "flex"
  controller.style.display = "none"
})

closeLoginPrompt.addEventListener("click", () => {
  loginPrompt.style.display = "none"
})

accountButton.addEventListener("click", (e) => {
  e.stopPropagation()
  toggleAccountBar()
})

accountMenu.addEventListener("click", (e) => {
  e.stopPropagation()
})

logoutBtn.addEventListener("click", () => {
  logOut()
})

closeAccountBtn.addEventListener("click", () => {
  closeAccountBar()
})

switchPlayerBtn.addEventListener("click", () => {
  firebase.redirectUser("./musicplayer/localplayer.html")
})

// Make the player draggable
let isDragging = false
let offsetX, offsetY

// Get the player elements
const playerElement = document.getElementById("player-container")
const controllerElement = document.getElementById("controller")

// Function to make an element draggable
function makeDraggable(element) {
  // The area that will act as the "handle" for dragging
  const dragHandle = element.querySelector(".closer") || element

  dragHandle.addEventListener("mousedown", (e) => {
    isDragging = true

    // Calculate the offset of the mouse pointer relative to the element
    const rect = element.getBoundingClientRect()
    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top

    // Add a class for styling during drag
    element.classList.add("dragging")

    // Prevent default behavior to avoid text selection during drag
    e.preventDefault()
  })

  // Move the element when the mouse moves
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return

    // Calculate new position
    const x = e.clientX - offsetX
    const y = e.clientY - offsetY

    // Apply new position, ensuring the element stays within viewport
    element.style.left = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, x)) + "px"
    element.style.right = "auto" // Clear the right property when dragging
    element.style.top = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, y)) + "px"
    element.style.bottom = "auto" // Clear the bottom property when dragging
  })

  // Stop dragging when mouse button is released
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false
      element.classList.remove("dragging")
    }
  })

  // Touch events for mobile support
  dragHandle.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true

      const rect = element.getBoundingClientRect()
      const touch = e.touches[0]
      offsetX = touch.clientX - rect.left
      offsetY = touch.clientY - rect.top

      element.classList.add("dragging")
    },
    { passive: false },
  )

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return

      const touch = e.touches[0]
      const x = touch.clientX - offsetX
      const y = touch.clientY - offsetY

      element.style.left = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, x)) + "px"
      element.style.right = "auto"
      element.style.top = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, y)) + "px"
      element.style.bottom = "auto"

      // Prevent scrolling while dragging
      e.preventDefault()
    },
    { passive: false },
  )

  document.addEventListener("touchend", () => {
    if (isDragging) {
      isDragging = false
      element.classList.remove("dragging")
    }
  })
}

// Make both player and controller draggable
makeDraggable(playerElement)
makeDraggable(controllerElement)