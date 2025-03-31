// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
    // Navigation elements
    const menuButton = document.getElementById("menu")
    const hamburger = document.getElementById("hamburger")
    const sidenav = document.getElementById("sidenav")
    const accountButton = document.getElementById("accountIcon")
    const accountMenu = document.getElementById("account")
    const closeAccountBtn = document.getElementById("closeAccount")
    const logoutBtn = document.getElementById("logoutbtn")
    const homeLink = document.getElementById("home-link")
    const profileLink = document.getElementById("profile-link")
    const songsLink = document.getElementById("songs-link")
    const albumsLink = document.getElementById("albums-link")
  
    // Tab navigation
    const tabButtons = document.querySelectorAll(".tab-button")
    const tabContents = document.querySelectorAll(".tab-content")
  
    // Profile elements
    const editNameBtn = document.getElementById("edit-name")
    const editBioBtn = document.getElementById("edit-bio")
    const editBackstoryBtn = document.getElementById("edit-backstory")
    const changeProfileImageBtn = document.getElementById("change-profile-image")
  
    // Song management
    const addSongBtn = document.getElementById("add-song")
    const addFirstSongBtn = document.getElementById("add-first-song")
  
    // Album management
    const addAlbumBtn = document.getElementById("add-album")
    const addFirstAlbumBtn = document.getElementById("add-first-album")
  
    // Modals
    const modals = document.querySelectorAll(".modal")
    const closeModalButtons = document.querySelectorAll(".close-modal")
    const editBioModal = document.getElementById("edit-bio-modal")
    const editNameModal = document.getElementById("edit-name-modal")
    const editBackstoryModal = document.getElementById("edit-backstory-modal")
    const addSongModal = document.getElementById("add-song-modal")
    const addAlbumModal = document.getElementById("add-album-modal")
    const claimSongModal = document.getElementById("claim-song-modal")
  
    // Modal action buttons
    const saveBioBtn = document.getElementById("save-bio")
    const cancelBioBtn = document.getElementById("cancel-bio")
    const saveNameBtn = document.getElementById("save-name")
    const cancelNameBtn = document.getElementById("cancel-name")
    const saveBackstoryBtn = document.getElementById("save-backstory")
    const cancelBackstoryBtn = document.getElementById("cancel-backstory")
    const saveSongBtn = document.getElementById("save-song")
    const cancelSongBtn = document.getElementById("cancel-song")
    const saveAlbumBtn = document.getElementById("save-album")
    const cancelAlbumBtn = document.getElementById("cancel-album")
    const submitClaimBtn = document.getElementById("submit-claim")
    const cancelClaimBtn = document.getElementById("cancel-claim")
  
    // Form inputs
    const bioTextarea = document.getElementById("bio-text")
    const bioCharCount = document.getElementById("bio-char-count")
    const artistNameInput = document.getElementById("artist-name-input")
    const backstoryTextarea = document.getElementById("backstory-text")
    const backstoryCharCount = document.getElementById("backstory-char-count")
    const songTitleInput = document.getElementById("song-title")
    const songAlbumInput = document.getElementById("song-album")
    const songYearInput = document.getElementById("song-year")
    const songYoutubeInput = document.getElementById("song-youtube")
    const songCoverInput = document.getElementById("song-cover")
    const songCoverPreview = document.getElementById("song-cover-preview")
    const albumTitleInput = document.getElementById("album-title")
    const albumYearInput = document.getElementById("album-year")
    const albumDescriptionInput = document.getElementById("album-description")
    const albumCoverInput = document.getElementById("album-cover")
    const albumCoverPreview = document.getElementById("album-cover-preview")
  
    // Toast notification
    const toast = document.getElementById("toast")
    const toastMessage = document.getElementById("toast-message")
    const toastIcon = document.getElementById("toast-icon")
  
    // Global variables
    let toggleTracker = false
    let accountTracker = false
    let currentClaimSong = null
  
    // Unsplash image URLs for placeholders
    const unsplashImages = {
      artistProfile: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
      songCovers: [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600&auto=format&fit=crop",
      ],
      albumCovers: [
        "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=600&auto=format&fit=crop",
      ],
    }
  
    const artistData = {
      name: "Artist Name",
      bio: "Add your bio here to let fans know about you.",
      backstory:
        "Share your journey as an artist here. Tell your fans how you started, what inspires you, and where you're headed.",
      profileImage: unsplashImages.artistProfile,
      songs: [],
      albums: [],
      stats: {
        songs: 0,
        albums: 0,
        likes: 0,
      },
    }
  
    // Sample data for demonstration
    const sampleSongs = [
      {
        id: 1,
        title: "Sunrise",
        album: "New Beginnings",
        year: 2023,
        youtubeUrl: "https://www.youtube.com/watch?v=sample1",
        coverUrl: unsplashImages.songCovers[0],
        likes: 24,
      },
      {
        id: 2,
        title: "Midnight Dreams",
        album: "New Beginnings",
        year: 2023,
        youtubeUrl: "https://www.youtube.com/watch?v=sample2",
        coverUrl: unsplashImages.songCovers[1],
        likes: 18,
      },
      {
        id: 3,
        title: "Electric Waves",
        album: "Single",
        year: 2024,
        youtubeUrl: "https://www.youtube.com/watch?v=sample3",
        coverUrl: unsplashImages.songCovers[2],
        likes: 32,
      },
    ]
  
    const sampleAlbums = [
      {
        id: 1,
        title: "New Beginnings",
        year: 2023,
        coverUrl: unsplashImages.albumCovers[0],
        songCount: 2,
        description: "My debut album exploring themes of hope and renewal.",
      },
      {
        id: 2,
        title: "Midnight Sessions",
        year: 2024,
        coverUrl: unsplashImages.albumCovers[1],
        songCount: 1,
        description: "A collection of songs created during late-night studio sessions.",
      },
    ]
  
    let sampleClaims = [
      {
        id: 1,
        title: "Lost in the Rhythm",
        artist: "Unknown Artist",
        submittedBy: "Music Fan",
        date: "2023-05-15",
        youtubeUrl: "https://www.youtube.com/watch?v=sample3",
      },
      {
        id: 2,
        title: "Echoes of Yesterday",
        artist: "Unknown Artist",
        submittedBy: "Top 10 Lowkeys Fan",
        date: "2023-06-22",
        youtubeUrl: "https://www.youtube.com/watch?v=sample4",
      },
    ]
  
    // Initialize the page
    function init() {
      // Load artist data (would normally come from a database/API)
      loadArtistData()
  
      // Set up event listeners
      setupEventListeners()
  
      // Update UI with artist data
      updateUI()
  
      // Update profile image in account menu
      document.querySelector(".bio img").src = artistData.profileImage
    }
  
    // Load artist data (simulated)
    function loadArtistData() {
      // In a real app, this would fetch data from a server
      // For demo purposes, we'll use the sample data
      artistData.songs = sampleSongs
      artistData.albums = sampleAlbums
      artistData.stats.songs = sampleSongs.length
      artistData.stats.albums = sampleAlbums.length
      artistData.stats.likes = sampleSongs.reduce((total, song) => total + song.likes, 0)
    }
  
    // Set up all event listeners
    function setupEventListeners() {
      // Navigation
      menuButton.addEventListener("click", toggleMenu)
      hamburger.addEventListener("click", toggleMenu)
      accountButton.addEventListener("click", toggleAccountBar)
      closeAccountBtn.addEventListener("click", closeAccountBar)
      logoutBtn.addEventListener("click", logOut)
      homeLink.addEventListener("click", () => (window.location.href = "../../index.html"))
  
      // Prevent event bubbling for sidenav and account menu
      sidenav.addEventListener("click", (e) => e.stopPropagation())
      accountMenu.addEventListener("click", (e) => e.stopPropagation())
  
      // Close menus when clicking on body
      document.body.addEventListener("click", () => {
        closeMenu()
        closeAccountBar()
      })
  
      // Tab navigation
      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const tab = button.getAttribute("data-tab")
          switchTab(tab)
        })
      })
  
      // Quick links
      profileLink.addEventListener("click", () => {
        closeMenu()
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
  
      songsLink.addEventListener("click", () => {
        closeMenu()
        switchTab("songs")
        document.querySelector(".music-management").scrollIntoView({ behavior: "smooth" })
      })
  
      albumsLink.addEventListener("click", () => {
        closeMenu()
        switchTab("albums")
        document.querySelector(".music-management").scrollIntoView({ behavior: "smooth" })
      })
  
      // Edit profile
      editNameBtn.addEventListener("click", openEditNameModal)
      editBioBtn.addEventListener("click", openEditBioModal)
      editBackstoryBtn.addEventListener("click", openEditBackstoryModal)
      changeProfileImageBtn.addEventListener("click", changeProfileImage)
  
      // Add content
      addSongBtn.addEventListener("click", openAddSongModal)
      addFirstSongBtn.addEventListener("click", openAddSongModal)
      addAlbumBtn.addEventListener("click", openAddAlbumModal)
      addFirstAlbumBtn.addEventListener("click", openAddAlbumModal)
  
      // Close modals
      closeModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const modal = button.closest(".modal")
          closeModal(modal)
        })
      })
  
      // Modal actions
      saveBioBtn.addEventListener("click", saveBio)
      cancelBioBtn.addEventListener("click", () => closeModal(editBioModal))
      saveNameBtn.addEventListener("click", saveName)
      cancelNameBtn.addEventListener("click", () => closeModal(editNameModal))
      saveBackstoryBtn.addEventListener("click", saveBackstory)
      cancelBackstoryBtn.addEventListener("click", () => closeModal(editBackstoryModal))
      saveSongBtn.addEventListener("click", saveSong)
      cancelSongBtn.addEventListener("click", () => closeModal(addSongModal))
      saveAlbumBtn.addEventListener("click", saveAlbum)
      cancelAlbumBtn.addEventListener("click", () => closeModal(addAlbumModal))
      submitClaimBtn.addEventListener("click", submitClaim)
      cancelClaimBtn.addEventListener("click", () => closeModal(claimSongModal))
  
      // Character counters
      bioTextarea.addEventListener("input", () => {
        bioCharCount.textContent = bioTextarea.value.length
      })
  
      backstoryTextarea.addEventListener("input", () => {
        backstoryCharCount.textContent = backstoryTextarea.value.length
      })
  
      // Image previews
      songCoverInput.addEventListener("change", previewSongCover)
      albumCoverInput.addEventListener("change", previewAlbumCover)
  
      // Close modals when clicking outside
      modals.forEach((modal) => {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            closeModal(modal)
          }
        })
      })
    }
  
    // Update UI with artist data
    function updateUI() {
      // Update profile section
      document.getElementById("artist-name").textContent = artistData.name
      document.getElementById("profile-image").src = artistData.profileImage
      document.getElementById("artist-bio").textContent = artistData.bio
      document.getElementById("artist-backstory").textContent = artistData.backstory
  
      // Update stats
      document.getElementById("songs-count").textContent = artistData.stats.songs
      document.getElementById("albums-count").textContent = artistData.stats.albums
      document.getElementById("likes-count").textContent = artistData.stats.likes
  
      // Update account menu
      document.getElementById("displayname").textContent = artistData.name
  
      // Populate songs
      populateSongs()
  
      // Populate albums
      populateAlbums()
  
      // Populate claims
      populateClaims()
    }
  
    // Populate songs list
    function populateSongs() {
      const songsContainer = document.getElementById("songs-container")
  
      // Clear container
      songsContainer.innerHTML = ""
  
      if (artistData.songs.length === 0) {
        // Show empty state
        const emptyState = document.createElement("div")
        emptyState.className = "empty-state"
        emptyState.innerHTML = `
                <i class="fa fa-music"></i>
                <p>You haven't added any songs yet.</p>
                <button id="add-first-song-empty" class="action-button">Add Your First Song</button>
            `
        songsContainer.appendChild(emptyState)
  
        // Add event listener to the new button
        document.getElementById("add-first-song-empty").addEventListener("click", openAddSongModal)
      } else {
        // Add songs
        artistData.songs.forEach((song) => {
          const songItem = document.createElement("div")
          songItem.className = "song-item"
          songItem.innerHTML = `
                    <img src="${song.coverUrl}" alt="${song.title}" class="song-cover">
                    <div class="song-info">
                        <h3 class="song-title">${song.title}</h3>
                        <p class="song-details">${song.album} • ${song.year} • ${song.likes} likes</p>
                    </div>
                    <div class="song-actions">
                        <button class="song-action-button edit-song" data-id="${song.id}">
                            <i class="fa fa-pencil"></i>
                        </button>
                        <button class="song-action-button delete-song" data-id="${song.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                `
          songsContainer.appendChild(songItem)
        })
  
        // Add event listeners to edit and delete buttons
        document.querySelectorAll(".edit-song").forEach((button) => {
          button.addEventListener("click", (e) => {
            const songId = Number.parseInt(e.currentTarget.getAttribute("data-id"))
            editSong(songId)
          })
        })
  
        document.querySelectorAll(".delete-song").forEach((button) => {
          button.addEventListener("click", (e) => {
            const songId = Number.parseInt(e.currentTarget.getAttribute("data-id"))
            deleteSong(songId)
          })
        })
      }
    }
  
    // Populate albums grid
    function populateAlbums() {
      const albumsContainer = document.getElementById("albums-container")
  
      // Clear container
      albumsContainer.innerHTML = ""
  
      if (artistData.albums.length === 0) {
        // Show empty state
        const emptyState = document.createElement("div")
        emptyState.className = "empty-state"
        emptyState.innerHTML = `
                <i class="fa fa-disc"></i>
                <p>You haven't added any albums yet.</p>
                <button id="add-first-album-empty" class="action-button">Add Your First Album</button>
            `
        albumsContainer.appendChild(emptyState)
  
        // Add event listener to the new button
        document.getElementById("add-first-album-empty").addEventListener("click", openAddAlbumModal)
      } else {
        // Add albums
        artistData.albums.forEach((album) => {
          const albumItem = document.createElement("div")
          albumItem.className = "album-item"
          albumItem.innerHTML = `
                    <div class="album-cover-container">
                        <img src="${album.coverUrl}" alt="${album.title}" class="album-cover">
                    </div>
                    <div class="album-info">
                        <h3 class="album-title">${album.title}</h3>
                        <p class="album-year">${album.year}</p>
                        <p class="album-songs-count">${album.songCount} songs</p>
                    </div>
                `
          albumsContainer.appendChild(albumItem)
  
          // Add click event to view album details
          albumItem.addEventListener("click", () => {
            viewAlbumDetails(album.id)
          })
        })
      }
    }
  
    // Populate claims list
    function populateClaims() {
      const claimsContainer = document.getElementById("claims-container")
  
      // Clear container
      claimsContainer.innerHTML = ""
  
      if (sampleClaims.length === 0) {
        // Show empty state
        const emptyState = document.createElement("div")
        emptyState.className = "empty-state"
        emptyState.innerHTML = `
                <i class="fa fa-search"></i>
                <p>No songs to claim at the moment.</p>
            `
        claimsContainer.appendChild(emptyState)
      } else {
        // Add claims
        sampleClaims.forEach((claim) => {
          const claimItem = document.createElement("div")
          claimItem.className = "claim-item"
          claimItem.innerHTML = `
                    <div class="claim-info">
                        <h3 class="claim-title">${claim.title}</h3>
                        <p class="claim-details">Submitted by ${claim.submittedBy} on ${formatDate(claim.date)}</p>
                    </div>
                    <button class="claim-button" data-id="${claim.id}">Claim Song</button>
                `
          claimsContainer.appendChild(claimItem)
        })
  
        // Add event listeners to claim buttons
        document.querySelectorAll(".claim-button").forEach((button) => {
          button.addEventListener("click", (e) => {
            const claimId = Number.parseInt(e.currentTarget.getAttribute("data-id"))
            openClaimModal(claimId)
          })
        })
      }
    }
  
    // Navigation Functions
    function toggleMenu(e) {
      e.stopPropagation()
      if (!toggleTracker) {
        sidenav.style.left = "0"
        sidenav.classList.add("sidenavOpen")
        toggleTracker = true
      } else {
        sidenav.style.left = "-300px"
        sidenav.classList.remove("sidenavOpen")
        toggleTracker = false
      }
    }
  
    function closeMenu() {
      if (toggleTracker) {
        sidenav.style.left = "-300px"
        sidenav.classList.remove("sidenavOpen")
        toggleTracker = false
      }
    }
  
    function toggleAccountBar(e) {
      e.stopPropagation()
      if (!accountTracker) {
        accountMenu.style.right = "0"
        accountMenu.classList.add("openAccount")
        accountTracker = true
      } else {
        accountMenu.style.right = "-300px"
        accountMenu.classList.remove("openAccount")
        accountTracker = false
      }
    }
  
    function closeAccountBar() {
      if (accountTracker) {
        accountMenu.style.right = "-300px"
        accountMenu.classList.remove("openAccount")
        accountTracker = false
      }
    }
  
    function logOut() {
      // In a real app, this would call a logout API
      showToast("Logged out successfully", "success")
      setTimeout(() => {
        window.location.href = "../../index.html"
      }, 1500)
    }
  
    // Tab Navigation
    function switchTab(tabId) {
      // Update tab buttons
      tabButtons.forEach((button) => {
        if (button.getAttribute("data-tab") === tabId) {
          button.classList.add("active")
        } else {
          button.classList.remove("active")
        }
      })
  
      // Update tab content
      tabContents.forEach((content) => {
        if (content.id === `${tabId}-tab`) {
          content.classList.add("active")
        } else {
          content.classList.remove("active")
        }
      })
    }
  
    // Modal Functions
    function openModal(modal) {
      modal.style.display = "block"
    }
  
    function closeModal(modal) {
      modal.style.display = "none"
    }
  
    // Profile Edit Functions
    function openEditNameModal() {
      artistNameInput.value = artistData.name
      openModal(editNameModal)
    }
  
    function saveName() {
      const newName = artistNameInput.value.trim()
      if (newName) {
        artistData.name = newName
        document.getElementById("artist-name").textContent = newName
        document.getElementById("displayname").textContent = newName
        closeModal(editNameModal)
        showToast("Name updated successfully", "success")
      } else {
        showToast("Please enter a valid name", "error")
      }
    }
  
    function openEditBioModal() {
      bioTextarea.value = artistData.bio
      bioCharCount.textContent = artistData.bio.length
      openModal(editBioModal)
    }
  
    function saveBio() {
      const newBio = bioTextarea.value.trim()
      if (newBio) {
        artistData.bio = newBio
        document.getElementById("artist-bio").textContent = newBio
        closeModal(editBioModal)
        showToast("Bio updated successfully", "success")
      } else {
        showToast("Please enter a valid bio", "error")
      }
    }
  
    function openEditBackstoryModal() {
      backstoryTextarea.value = artistData.backstory
      backstoryCharCount.textContent = artistData.backstory.length
      openModal(editBackstoryModal)
    }
  
    function saveBackstory() {
      const newBackstory = backstoryTextarea.value.trim()
      if (newBackstory) {
        artistData.backstory = newBackstory
        document.getElementById("artist-backstory").textContent = newBackstory
        closeModal(editBackstoryModal)
        showToast("Backstory updated successfully", "success")
      } else {
        showToast("Please enter a valid backstory", "error")
      }
    }
  
    function changeProfileImage() {
      // In a real app, this would open a file picker
      // For demo purposes, we'll rotate through some Unsplash images
      const randomIndex = Math.floor(Math.random() * unsplashImages.songCovers.length)
      const newProfileImage = unsplashImages.songCovers[randomIndex]
  
      artistData.profileImage = newProfileImage
      document.getElementById("profile-image").src = newProfileImage
      document.querySelector(".bio img").src = newProfileImage
  
      showToast("Profile image updated successfully", "success")
    }
  
    // Song Management Functions
    function openAddSongModal() {
      // Reset form
      songTitleInput.value = ""
      songAlbumInput.value = ""
      songYearInput.value = ""
      songYoutubeInput.value = ""
      songCoverInput.value = ""
      songCoverPreview.innerHTML = ""
      openModal(addSongModal)
    }
  
    function saveSong() {
      const title = songTitleInput.value.trim()
      const album = songAlbumInput.value.trim()
      const year = songYearInput.value.trim()
      const youtubeUrl = songYoutubeInput.value.trim()
  
      if (!title || !year || !youtubeUrl) {
        showToast("Please fill in all required fields", "error")
        return
      }
  
      // In a real app, this would send data to a server
      // For demo, use a random Unsplash image as the cover
      const randomIndex = Math.floor(Math.random() * unsplashImages.songCovers.length)
  
      const newSong = {
        id: artistData.songs.length + 1,
        title: title,
        album: album || "Single",
        year: Number.parseInt(year),
        youtubeUrl: youtubeUrl,
        coverUrl: unsplashImages.songCovers[randomIndex],
        likes: 0,
      }
  
      artistData.songs.push(newSong)
      artistData.stats.songs = artistData.songs.length
  
      // Update UI
      populateSongs()
      document.getElementById("songs-count").textContent = artistData.stats.songs
  
      closeModal(addSongModal)
      showToast("Song added successfully", "success")
    }
  
    function previewSongCover(e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          songCoverPreview.innerHTML = `<img src="${event.target.result}" alt="Song Cover Preview">`
        }
        reader.readAsDataURL(file)
      }
    }
  
    function editSong(songId) {
      const song = artistData.songs.find((s) => s.id === songId)
      if (song) {
        // In a real app, this would open the edit form with the song data
        showToast("Edit song functionality would be implemented here", "success")
      }
    }
  
    function deleteSong(songId) {
      // In a real app, this would show a confirmation dialog
      if (confirm("Are you sure you want to delete this song?")) {
        artistData.songs = artistData.songs.filter((s) => s.id !== songId)
        artistData.stats.songs = artistData.songs.length
        artistData.stats.likes = artistData.songs.reduce((total, song) => total + song.likes, 0)
  
        // Update UI
        populateSongs()
        document.getElementById("songs-count").textContent = artistData.stats.songs
        document.getElementById("likes-count").textContent = artistData.stats.likes
  
        showToast("Song deleted successfully", "success")
      }
    }
  
    // Album Management Functions
    function openAddAlbumModal() {
      // Reset form
      albumTitleInput.value = ""
      albumYearInput.value = ""
      albumDescriptionInput.value = ""
      albumCoverInput.value = ""
      albumCoverPreview.innerHTML = ""
      openModal(addAlbumModal)
    }
  
    function saveAlbum() {
      const title = albumTitleInput.value.trim()
      const year = albumYearInput.value.trim()
      const description = albumDescriptionInput.value.trim()
  
      if (!title || !year) {
        showToast("Please fill in all required fields", "error")
        return
      }
  
      // In a real app, this would send data to a server
      // For demo, use a random Unsplash image as the cover
      const randomIndex = Math.floor(Math.random() * unsplashImages.albumCovers.length)
  
      const newAlbum = {
        id: artistData.albums.length + 1,
        title: title,
        year: Number.parseInt(year),
        description: description,
        coverUrl: unsplashImages.albumCovers[randomIndex],
        songCount: 0,
      }
  
      artistData.albums.push(newAlbum)
      artistData.stats.albums = artistData.albums.length
  
      // Update UI
      populateAlbums()
      document.getElementById("albums-count").textContent = artistData.stats.albums
  
      closeModal(addAlbumModal)
      showToast("Album added successfully", "success")
    }
  
    function previewAlbumCover(e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          albumCoverPreview.innerHTML = `<img src="${event.target.result}" alt="Album Cover Preview">`
        }
        reader.readAsDataURL(file)
      }
    }
  
    function viewAlbumDetails(albumId) {
      // In a real app, this would navigate to the album details page
      showToast("Album details functionality would be implemented here", "success")
    }
  
    // Claim Management Functions
    function openClaimModal(claimId) {
      const claim = sampleClaims.find((c) => c.id === claimId)
      if (claim) {
        currentClaimSong = claim
        document.getElementById("claim-song-title").textContent = claim.title
        openModal(claimSongModal)
      }
    }
  
    function submitClaim() {
      const verificationType = document.getElementById("claim-verification").value
      const verificationProof = document.getElementById("claim-proof").value.trim()
  
      if (!verificationProof) {
        showToast("Please provide verification details", "error")
        return
      }
  
      // In a real app, this would send the claim to a server for review
      closeModal(claimSongModal)
      showToast("Claim submitted for review", "success")
  
      // Remove the claimed song from the list (in a real app, it might stay with a "pending" status)
      sampleClaims = sampleClaims.filter((c) => c.id !== currentClaimSong.id)
      populateClaims()
    }
  
    // Utility Functions
    function formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    }
  
    function showToast(message, type = "success") {
      toastMessage.textContent = message
  
      if (type === "error") {
        toastIcon.className = "fa fa-exclamation-circle"
      } else {
        toastIcon.className = "fa fa-check-circle"
      }
  
      toast.style.display = "block"
  
      // Hide toast after 3 seconds
      setTimeout(() => {
        toast.style.display = "none"
      }, 3000)
    }
  
    // Initialize the page
    init()
  })
  
  