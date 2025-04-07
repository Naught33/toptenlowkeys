import FirebaseImplementation from "./firebase.js"
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  update,
  remove,
  push,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js"
import { getAuth, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"

const firebase = new FirebaseImplementation()

// DOM Elements
const artistNameElement = document.getElementById("artist-name")
const profileImageElement = document.getElementById("profile-image")
const artistBioElement = document.getElementById("artist-bio")
const artistBackstoryElement = document.getElementById("artist-backstory")
const songsCountElement = document.getElementById("songs-count")
const albumsCountElement = document.getElementById("albums-count")
const likesCountElement = document.getElementById("likes-count")

// Modal Elements
const editBioModal = document.getElementById("edit-bio-modal")
const editNameModal = document.getElementById("edit-name-modal")
const editBackstoryModal = document.getElementById("edit-backstory-modal")
const addSongModal = document.getElementById("add-song-modal")
const addAlbumModal = document.getElementById("add-album-modal")
const claimSongModal = document.getElementById("claim-song-modal")

// Buttons
const editBioBtn = document.getElementById("edit-bio")
const editNameBtn = document.getElementById("edit-name")
const editBackstoryBtn = document.getElementById("edit-backstory")
const changeProfileImageBtn = document.getElementById("change-profile-image")
const addSongBtn = document.getElementById("add-song")
const addAlbumBtn = document.getElementById("add-album")

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  // Check authentication status
  const user = await firebase.checkSignInStatus()
  if (!user) {
    firebase.redirectUser("../../index.html")
    return
  }

  // Extract username and account type from displayName
  const [username, accountType] = user.displayName.split(",")
  if (accountType !== "artist") {
    firebase.redirectUser("../../index.html")
    return
  }

  // Load artist data
  loadArtistData(user.uid, username)

  // Load artist songs
  loadArtistSongs(user.uid)

  // Load artist albums
  loadArtistAlbums(user.uid)

  // Load song claims
  loadSongClaims(username)

  // Set up event listeners
  setupEventListeners(user.uid, username)
})

function loadArtistData(uid, username) {
  const db = getDatabase()
  const artistRef = ref(db, `artists/${uid}`)

  onValue(artistRef, (snapshot) => {
    const artistData = snapshot.val() || {}

    // Display artist info
    artistNameElement.textContent = artistData.name || username
    document.getElementById("displayname").textContent = artistData.name || username

    // Display bio and backstory
    artistBioElement.textContent = artistData.bio || "Add your bio here to let fans know about you."
    artistBackstoryElement.textContent =
      artistData.backstory ||
      "Share your journey as an artist here. Tell your fans how you started, what inspires you, and where you're headed."

    // Display profile image if available
    if (artistData.profileImage) {
      profileImageElement.src = artistData.profileImage
    }

    // Update character counts in modals if they exist
    if (document.getElementById("bio-text")) {
      document.getElementById("bio-text").value = artistData.bio || ""
      document.getElementById("bio-char-count").textContent = (artistData.bio || "").length
    }

    if (document.getElementById("backstory-text")) {
      document.getElementById("backstory-text").value = artistData.backstory || ""
      document.getElementById("backstory-char-count").textContent = (artistData.backstory || "").length
    }

    if (document.getElementById("artist-name-input")) {
      document.getElementById("artist-name-input").value = artistData.name || username
    }
  })
}

function loadArtistSongs(uid) {
  const db = getDatabase()
  const songsRef = ref(db, `artists/${uid}/songs`)

  onValue(songsRef, (snapshot) => {
    const songsContainer = document.getElementById("songs-container")
    songsContainer.innerHTML = ""

    const songs = snapshot.val() || {}
    const songIds = Object.keys(songs)

    // Update song count
    songsCountElement.textContent = songIds.length

    if (songIds.length === 0) {
      // Show empty state
      songsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa fa-music"></i>
                    <p>You haven't added any songs yet.</p>
                    <button id="add-first-song" class="action-button">Add Your First Song</button>
                </div>
            `
      const firstSongBtn = document.getElementById("add-first-song")
      if (firstSongBtn) {
        firstSongBtn.addEventListener("click", () => {
          addSongModal.style.display = "block"
        })
      }
    } else {
      // Display songs
      songIds.forEach((songId) => {
        const song = songs[songId]
        const songElement = createSongElement(song, songId, uid)
        songsContainer.appendChild(songElement)
      })
    }

    // Update likes count
    updateLikesCount(uid)
  })
}

function createSongElement(song, songId, artistId) {
  const songElement = document.createElement("div")
  songElement.className = "song-item"
  songElement.innerHTML = `
        <img src="https://img.youtube.com/vi/${getYouTubeId(song.youtubeURL)}/0.jpg" alt="${song.title}" class="song-cover">
        <div class="song-info">
            <div class="song-details">
                <h3 class="song-title">${song.title}</h3>
                <p>${song.album ? "Album: " + song.album : "Single"}</p>
                <p>Released: ${song.year}</p>
            </div>
        </div>
        <div class="song-actions">
            <button class="action-button view-song" data-id="${songId}">
                <i class="fa fa-eye"></i> View
            </button>
            <button class="action-button cold remove-song" data-id="${songId}">
                <i class="fa fa-trash"></i> Remove
            </button>
        </div>
    `

  // Add event listeners
  songElement.querySelector(".view-song").addEventListener("click", () => {
    window.open(song.youtubeURL, "_blank")
  })

  songElement.querySelector(".remove-song").addEventListener("click", () => {
    if (confirm("Are you sure you want to remove this song?")) {
      removeSong(artistId, songId)
    }
  })

  return songElement
}

function removeSong(artistId, songId) {
  const db = getDatabase()
  const songRef = ref(db, `artists/${artistId}/songs/${songId}`)

  remove(songRef)
    .then(() => {
      showToast("Song removed successfully")
    })
    .catch((error) => {
      showToast("Error removing song", false)
      console.error(error)
    })
}

function loadArtistAlbums(uid) {
  const db = getDatabase()
  const albumsRef = ref(db, `artists/${uid}/albums`)

  onValue(albumsRef, (snapshot) => {
    const albumsContainer = document.getElementById("albums-container")
    albumsContainer.innerHTML = ""

    const albums = snapshot.val() || {}
    const albumIds = Object.keys(albums)

    // Update album count
    albumsCountElement.textContent = albumIds.length

    if (albumIds.length === 0) {
      // Show empty state
      albumsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa fa-disc"></i>
                    <p>You haven't added any albums yet.</p>
                    <button id="add-first-album" class="action-button">Add Your First Album</button>
                </div>
            `
      const firstAlbumBtn = document.getElementById("add-first-album")
      if (firstAlbumBtn) {
        firstAlbumBtn.addEventListener("click", () => {
          addAlbumModal.style.display = "block"
        })
      }
    } else {
      // Display albums
      albumIds.forEach((albumId) => {
        const album = albums[albumId]
        const albumElement = createAlbumElement(album, albumId, uid)
        albumsContainer.appendChild(albumElement)
      })
    }
  })
}

function createAlbumElement(album, albumId, artistId) {
  const albumElement = document.createElement("div")
  albumElement.className = "album-item"
  albumElement.innerHTML = `
        <div class="album-cover">
            <img src="${album.coverImage || "../images/default_album.jpg"}" alt="${album.title}">
        </div>
        <div class="album-info">
            <h3>${album.title}</h3>
            <p>Released: ${album.year}</p>
            <p>${album.songCount || 0} songs</p>
        </div>
        <div class="album-actions">
            <button class="action-button view-album" data-id="${albumId}">
                <i class="fa fa-eye"></i> View
            </button>
            <button class="action-button cold remove-album" data-id="${albumId}">
                <i class="fa fa-trash"></i> Remove
            </button>
        </div>
    `

  // Add event listeners
  albumElement.querySelector(".view-album").addEventListener("click", () => {
    // In a real app, this would show the album details
    alert(`Viewing album: ${album.title}`)
  })

  albumElement.querySelector(".remove-album").addEventListener("click", () => {
    if (confirm("Are you sure you want to remove this album?")) {
      removeAlbum(artistId, albumId)
    }
  })

  return albumElement
}

function removeAlbum(artistId, albumId) {
  const db = getDatabase()
  const albumRef = ref(db, `artists/${artistId}/albums/${albumId}`)

  remove(albumRef)
    .then(() => {
      showToast("Album removed successfully")
    })
    .catch((error) => {
      showToast("Error removing album", false)
      console.error(error)
    })
}

function loadSongClaims(artistName) {
  const db = getDatabase()
  const claimsRef = ref(db, "suggestions/")

  onValue(claimsRef, (snapshot) => {
    const claimsContainer = document.getElementById("claims-container")
    claimsContainer.innerHTML = ""

    const claims = snapshot.val() || {}
    const claimKeys = Object.keys(claims)

    if (claimKeys.length === 0) {
      // Show empty state
      claimsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa fa-search"></i>
                    <p>No songs to claim at the moment.</p>
                </div>
            `
    } else {
      // Display claims
      claimKeys.forEach((key) => {
        const claim = claims[key]
        // Only show claims that don't belong to this artist
        if (claim.ArtistName.toLowerCase() !== artistName.toLowerCase()) {
          const claimElement = createClaimElement(claim, key)
          claimsContainer.appendChild(claimElement)
        }
      })
    }
  })
}

function createClaimElement(claim, key) {
  const claimElement = document.createElement("div")
  claimElement.className = "claim-item"
  claimElement.innerHTML = `
        <img src="https://img.youtube.com/vi/${getYouTubeId(claim.youtubeURL)}/0.jpg" alt="${claim.Title}" class="claim-cover">
        <div class="claim-info">
            <div class="claim-details">
                <h3 class="claim-title">${claim.Title}</h3>
                <p>Artist: ${claim.ArtistName}</p>
                <p>Suggested by: ${claim.SuggestedBy}</p>
                <p>Likes: ${claim.likeCount || 0}</p>
            </div>
        </div>
        <div class="claim-actions">
            <button class="action-button view-claim" data-id="${key}">
                <i class="fa fa-eye"></i> View
            </button>
            <button class="action-button claim-song" data-id="${key}">
                <i class="fa fa-flag"></i> Claim
            </button>
        </div>
    `

  // Add event listeners
  claimElement.querySelector(".view-claim").addEventListener("click", () => {
    window.open(claim.youtubeURL, "_blank")
  })

  claimElement.querySelector(".claim-song").addEventListener("click", () => {
    openClaimModal(claim, key)
  })

  return claimElement
}

function openClaimModal(claim, key) {
  const modal = document.getElementById("claim-song-modal")
  document.getElementById("claim-song-title").textContent = claim.Title

  // Store the claim key in the modal for later use
  modal.dataset.claimKey = key

  modal.style.display = "block"
}

function setupEventListeners(uid, username) {
  // Edit bio
  if (editBioBtn) {
    editBioBtn.addEventListener("click", () => {
      editBioModal.style.display = "block"
    })
  }

  // Edit name
  if (editNameBtn) {
    editNameBtn.addEventListener("click", () => {
      editNameModal.style.display = "block"
    })
  }

  // Edit backstory
  if (editBackstoryBtn) {
    editBackstoryBtn.addEventListener("click", () => {
      editBackstoryModal.style.display = "block"
    })
  }

  // Change profile image
  if (changeProfileImageBtn) {
    changeProfileImageBtn.addEventListener("click", () => {
      document.getElementById("profile-image-input").click()
    })
  }

  // Add song button
  if (addSongBtn) {
    addSongBtn.addEventListener("click", () => {
      addSongModal.style.display = "block"
    })
  }

  // Add album button
  if (addAlbumBtn) {
    addAlbumBtn.addEventListener("click", () => {
      addAlbumModal.style.display = "block"
    })
  }

  // Modal close buttons
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".modal").style.display = "none"
    })
  })

  // Cancel buttons
  const cancelBio = document.getElementById("cancel-bio")
  if (cancelBio) {
    cancelBio.addEventListener("click", () => {
      editBioModal.style.display = "none"
    })
  }

  const cancelName = document.getElementById("cancel-name")
  if (cancelName) {
    cancelName.addEventListener("click", () => {
      editNameModal.style.display = "none"
    })
  }

  const cancelBackstory = document.getElementById("cancel-backstory")
  if (cancelBackstory) {
    cancelBackstory.addEventListener("click", () => {
      editBackstoryModal.style.display = "none"
    })
  }

  const cancelSong = document.getElementById("cancel-song")
  if (cancelSong) {
    cancelSong.addEventListener("click", () => {
      addSongModal.style.display = "none"
    })
  }

  const cancelAlbum = document.getElementById("cancel-album")
  if (cancelAlbum) {
    cancelAlbum.addEventListener("click", () => {
      addAlbumModal.style.display = "none"
    })
  }

  const cancelClaim = document.getElementById("cancel-claim")
  if (cancelClaim) {
    cancelClaim.addEventListener("click", () => {
      claimSongModal.style.display = "none"
    })
  }

  // Save bio
  const saveBio = document.getElementById("save-bio")
  if (saveBio) {
    saveBio.addEventListener("click", () => {
      const newBio = document.getElementById("bio-text").value
      saveArtistBio(uid, newBio)
      editBioModal.style.display = "none"
    })
  }

  // Save name
  const saveName = document.getElementById("save-name")
  if (saveName) {
    saveName.addEventListener("click", () => {
      const newName = document.getElementById("artist-name-input").value
      saveArtistName(uid, username, newName)
      editNameModal.style.display = "none"
    })
  }

  // Save backstory
  const saveBackstory = document.getElementById("save-backstory")
  if (saveBackstory) {
    saveBackstory.addEventListener("click", () => {
      const newBackstory = document.getElementById("backstory-text").value
      saveArtistBackstory(uid, newBackstory)
      editBackstoryModal.style.display = "none"
    })
  }

  // Add song
  const saveSong = document.getElementById("save-song")
  if (saveSong) {
    saveSong.addEventListener("click", () => {
      addNewSong(uid, username)
    })
  }

  // Add album
  const saveAlbum = document.getElementById("save-album")
  if (saveAlbum) {
    saveAlbum.addEventListener("click", () => {
      addNewAlbum(uid, username)
    })
  }

  // Submit claim
  const submitClaim = document.getElementById("submit-claim")
  if (submitClaim) {
    submitClaim.addEventListener("click", () => {
      submitSongClaim(uid, username)
    })
  }

  // Character counters
  const bioText = document.getElementById("bio-text")
  if (bioText) {
    bioText.addEventListener("input", (e) => {
      document.getElementById("bio-char-count").textContent = e.target.value.length
    })
  }

  const backstoryText = document.getElementById("backstory-text")
  if (backstoryText) {
    backstoryText.addEventListener("input", (e) => {
      document.getElementById("backstory-char-count").textContent = e.target.value.length
    })
  }

  // Profile image upload
  const profileImageInput = document.getElementById("profile-image-input")
  if (profileImageInput) {
    profileImageInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          profileImageElement.src = event.target.result
          saveProfileImage(uid, event.target.result)
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

function saveArtistBio(uid, bio) {
  const db = getDatabase()
  update(ref(db, `artists/${uid}`), {
    bio: bio,
  })
    .then(() => {
      showToast("Bio updated successfully")
    })
    .catch((error) => {
      showToast("Error updating bio", false)
      console.error(error)
    })
}

function saveArtistName(uid, username, name) {
  const db = getDatabase()
  const auth = getAuth()

  // Update in database
  update(ref(db, `artists/${uid}`), {
    name: name,
  })
    .then(() => {
      // Update in authentication
      return updateProfile(auth.currentUser, {
        displayName: `${name},Artist`,
      })
    })
    .then(() => {
      showToast("Name updated successfully")
    })
    .catch((error) => {
      showToast("Error updating name", false)
      console.error(error)
    })
}

function saveArtistBackstory(uid, backstory) {
  const db = getDatabase()
  update(ref(db, `artists/${uid}`), {
    backstory: backstory,
  })
    .then(() => {
      showToast("Backstory updated successfully")
    })
    .catch((error) => {
      showToast("Error updating backstory", false)
      console.error(error)
    })
}

function saveProfileImage(uid, imageData) {
  const db = getDatabase()
  update(ref(db, `artists/${uid}`), {
    profileImage: imageData,
  })
    .then(() => {
      showToast("Profile image updated successfully")
    })
    .catch((error) => {
      showToast("Error updating profile image", false)
      console.error(error)
    })
}

function addNewSong(uid, artistName) {
  const title = document.getElementById("song-title").value
  const album = document.getElementById("song-album").value
  const year = document.getElementById("song-year").value
  const youtubeURL = document.getElementById("song-youtube").value

  if (!title || !year || !youtubeURL) {
    showToast("Please fill in all required fields", false)
    return
  }

  const youtubeId = getYouTubeId(youtubeURL)
  if (!youtubeId) {
    showToast("Please enter a valid YouTube URL", false)
    return
  }

  const db = getDatabase()
  const songsRef = ref(db, `artists/${uid}/songs`)
  const newSongKey = push(songsRef).key
  const newSongRef = ref(db, `artists/${uid}/songs/${newSongKey}`)

  const songData = {
    title: title,
    album: album || null,
    year: year,
    youtubeURL: youtubeURL,
    youtubeId: youtubeId,
    addedAt: new Date().toISOString(),
  }

  set(newSongRef, songData)
    .then(() => {
      // Also add to suggestions as an official song
      set(ref(db, `suggestions/${artistName} ${title}`), {
        ArtistName: artistName,
        Title: title,
        youtubeURL: youtubeURL,
        SuggestedBy: artistName,
        likeCount: 0,
        isOfficial: true,
        artistId: uid,
      })

      showToast("Song added successfully")
      addSongModal.style.display = "none"
      resetSongForm()
    })
    .catch((error) => {
      showToast("Error adding song", false)
      console.error(error)
    })
}

function resetSongForm() {
  const songTitle = document.getElementById("song-title")
  if (songTitle) songTitle.value = ""

  const songAlbum = document.getElementById("song-album")
  if (songAlbum) songAlbum.value = ""

  const songYear = document.getElementById("song-year")
  if (songYear) songYear.value = ""

  const songYoutube = document.getElementById("song-youtube")
  if (songYoutube) songYoutube.value = ""

  const songCoverPreview = document.getElementById("song-cover-preview")
  if (songCoverPreview) songCoverPreview.innerHTML = ""
}

function addNewAlbum(uid, artistName) {
  const title = document.getElementById("album-title").value
  const year = document.getElementById("album-year").value
  const description = document.getElementById("album-description").value

  if (!title || !year) {
    showToast("Please fill in all required fields", false)
    return
  }

  const db = getDatabase()
  const albumsRef = ref(db, `artists/${uid}/albums`)
  const newAlbumKey = push(albumsRef).key
  const newAlbumRef = ref(db, `artists/${uid}/albums/${newAlbumKey}`)

  const albumData = {
    title: title,
    year: year,
    description: description || "",
    createdAt: new Date().toISOString(),
    songCount: 0, // Will be updated when songs are added
  }

  set(newAlbumRef, albumData)
    .then(() => {
      showToast("Album added successfully")
      addAlbumModal.style.display = "none"
      resetAlbumForm()
    })
    .catch((error) => {
      showToast("Error adding album", false)
      console.error(error)
    })
}

function resetAlbumForm() {
  const albumTitle = document.getElementById("album-title")
  if (albumTitle) albumTitle.value = ""

  const albumYear = document.getElementById("album-year")
  if (albumYear) albumYear.value = ""

  const albumDescription = document.getElementById("album-description")
  if (albumDescription) albumDescription.value = ""

  const albumCoverPreview = document.getElementById("album-cover-preview")
  if (albumCoverPreview) albumCoverPreview.innerHTML = ""
}

function submitSongClaim(uid, artistName) {
  const claimKey = claimSongModal.dataset.claimKey
  const verificationMethod = document.getElementById("claim-verification").value
  const proof = document.getElementById("claim-proof").value
  const notes = document.getElementById("claim-notes").value

  if (!proof) {
    showToast("Please provide verification details", false)
    return
  }

  const db = getDatabase()
  const claimRef = ref(db, `claims/${claimKey}`)

  const claimData = {
    claimKey: claimKey,
    artistId: uid,
    artistName: artistName,
    verificationMethod: verificationMethod,
    proof: proof,
    notes: notes || "",
    claimedAt: new Date().toISOString(),
    status: "pending",
  }

  set(claimRef, claimData)
    .then(() => {
      showToast("Claim submitted successfully. Our team will review it shortly.")
      claimSongModal.style.display = "none"
      resetClaimForm()
    })
    .catch((error) => {
      showToast("Error submitting claim", false)
      console.error(error)
    })
}

function resetClaimForm() {
  const claimVerification = document.getElementById("claim-verification")
  if (claimVerification) claimVerification.value = "youtube"

  const claimProof = document.getElementById("claim-proof")
  if (claimProof) claimProof.value = ""

  const claimNotes = document.getElementById("claim-notes")
  if (claimNotes) claimNotes.value = ""
}

function updateLikesCount(uid) {
  const db = getDatabase()
  const songsRef = ref(db, `artists/${uid}/songs`)

  get(songsRef).then((snapshot) => {
    const songs = snapshot.val() || {}
    const songTitles = Object.values(songs).map((song) => song.title)

    if (songTitles.length === 0) {
      likesCountElement.textContent = "0"
      return
    }

    // Get all suggestions that are official and belong to this artist
    const suggestionsRef = ref(db, "suggestions/")
    get(suggestionsRef).then((suggestionsSnapshot) => {
      const suggestions = suggestionsSnapshot.val() || {}
      let totalLikes = 0

      Object.values(suggestions).forEach((suggestion) => {
        if (suggestion.isOfficial && songTitles.includes(suggestion.Title)) {
          totalLikes += suggestion.likeCount || 0
        }
      })

      likesCountElement.textContent = totalLikes
    })
  })
}

function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

function showToast(message, isSuccess = true) {
  const toast = document.getElementById("toast")
  if (!toast) return

  const toastMessage = document.getElementById("toast-message")
  const toastIcon = document.getElementById("toast-icon")

  if (toastMessage) toastMessage.textContent = message
  if (toastIcon) toastIcon.className = isSuccess ? "fa fa-check-circle" : "fa fa-exclamation-circle"

  toast.className = `toast ${isSuccess ? "success" : "error"}`
  toast.style.display = "flex"

  // Hide after 3 seconds
  setTimeout(() => {
    toast.style.display = "none"
  }, 3000)
}

