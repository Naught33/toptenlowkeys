//imports
import FirebaseImplementation from "./firebase.js"

//grabbing DOM elements.
const artistOption = document.getElementById("options")
const fanSignUp = document.getElementsByClassName("fan")[0]
const artistSignUp = document.getElementsByClassName("artist")[0]
const signUpDialogue = document.getElementById("signup")
const loginDialogue = document.getElementById("login")
const switchToLogInBtn = document.getElementById("switchToLogIn")
const switcher = document.getElementsByClassName("switcher")[0]

//credentials
const artistName = document.getElementById("ausername")
const artistPass = document.getElementById("apassword")
const artistPassCon = document.getElementById("apasswordconfirm")
const artistEmail = document.getElementById("aemail")
const fanName = document.getElementById("username")
const fanPass = document.getElementById("password")
const fanPassCon = document.getElementById("passwordconfirm")
const fanEmail = document.getElementById("email")
const loginPass = document.getElementById("passlogin")
const loginEmail = document.getElementById("emaillogin")
const messageLogin = document.getElementById("messageLogin")
const messageSignup = document.getElementById("messageSignup")

//buttons
const signUpbtn = document.getElementById("signupartist")
const signUpbtnFan = document.getElementById("signupbtn")
const logInbtn = document.getElementById("loginbtn")
const signUpbtnGoogle = document.getElementById("signupgoogleartist")
const signUpbtnGoogleFan = document.getElementById("signupgoogle")
const logInbtnGoogle = document.getElementById("logingoogle")

//globals
const firebase = new FirebaseImplementation()
const redirecturl = "../../index.html"
let isLoginMode = false

// Initialize the page
function init() {
  // Hide artist and fan signup sections initially
  fanSignUp.style.display = "none"
  artistSignUp.style.display = "none"

  // Set up event listeners
  setupEventListeners()
}

// Set up all event listeners
function setupEventListeners() {
  // Artist/Fan option selection
  artistOption.addEventListener("click", (e) => {
    const target = e.target.closest(".ip")
    if (!target) return

    if (target.classList.contains("artistprompt")) {
      openSignUpMenu("artistprompt ip")
    } else if (target.classList.contains("fanprompt")) {
      openSignUpMenu("fanprompt ip")
    }
  })

  // Login/Signup toggle
  switchToLogInBtn.addEventListener("click", () => {
    if (isLoginMode) {
      closeLoginMenu()
    } else {
      openLoginMenu()
    }
  })

  // Login button
  logInbtn.addEventListener("click", () => {
    logInUser(loginEmail.value, loginPass.value)
  })

  // Artist signup button
  signUpbtn.addEventListener("click", () => {
    signUpArtist(artistName.value, artistPass.value, artistPassCon.value, artistEmail.value, "artist", redirecturl)
  })

  // Fan signup button
  signUpbtnFan.addEventListener("click", () => {
    signUpFan(fanName.value, fanPass.value, fanPassCon.value, fanEmail.value, "fan", redirecturl)
  })

  // Google login/signup buttons
  if (logInbtnGoogle) {
    logInbtnGoogle.addEventListener("click", () => {
      // Implement Google login
      sendMessagetoClient(messageLogin, "Google login coming soon", true)
    })
  }

  if (signUpbtnGoogle) {
    signUpbtnGoogle.addEventListener("click", () => {
      // Implement Google signup for artist
      sendMessagetoClient(messageSignup, "Google signup coming soon", true)
    })
  }

  if (signUpbtnGoogleFan) {
    signUpbtnGoogleFan.addEventListener("click", () => {
      // Implement Google signup for fan
      sendMessagetoClient(messageSignup, "Google signup coming soon", true)
    })
  }
}

// Open signup menu based on selection
function openSignUpMenu(accountType) {
  if (accountType === "artistprompt ip") {
    fanSignUp.style.display = "none"
    artistSignUp.style.display = "flex"
    disapear(artistOption)
    signUpDialogue.style.top = "0"
    return
  }

  if (accountType === "fanprompt ip") {
    artistSignUp.style.display = "none"
    fanSignUp.style.display = "flex"
    disapear(artistOption)
    signUpDialogue.style.top = "0"
    return
  }
}

// Open login menu
function openLoginMenu() {
  isLoginMode = true
  loginDialogue.style.top = "0"
  disapear(artistOption)
  disapear(signUpDialogue)
  switcher.innerHTML = "Don't have an account? <span id='switchToLogIn'>Sign Up</span>"

  // Re-attach event listener to the new span
  setTimeout(() => {
    document.getElementById("switchToLogIn").addEventListener("click", () => {
      if (isLoginMode) {
        closeLoginMenu()
      } else {
        openLoginMenu()
      }
    })
  }, 0)
}

// Close login menu
function closeLoginMenu() {
  isLoginMode = false
  switcher.innerHTML = "Already have an account? <span id='switchToLogIn'>Log In</span>"
  disapear(loginDialogue)
  appear(artistOption)

  // Re-attach event listener to the new span
  setTimeout(() => {
    document.getElementById("switchToLogIn").addEventListener("click", () => {
      if (isLoginMode) {
        closeLoginMenu()
      } else {
        openLoginMenu()
      }
    })
  }, 0)
}

// Animation helpers
function disapear(element) {
  element.style.top = "-100%"
  element.style.opacity = "0"
}

function appear(element) {
  element.style.top = "0"
  element.style.opacity = "1"
}

// Login user
function logInUser(email, pass) {
  if (!validateLogIn(email, pass)) {
    return
  }

  try {
    firebase.signInUser(email, pass, redirecturl)
  } catch (error) {
    sendMessagetoClient(messageLogin, "Login failed: " + error.message, false)
  }
}

// Sign up fan
function signUpFan(name, pass, passcon, email, accountType, redirectURL) {
  if (!validateFanSignUp(name, pass, passcon, email)) {
    return
  }

  try {
    firebase.signUpUserWithEmailandPassword(email, pass, name, accountType, redirectURL)
  } catch (error) {
    sendMessagetoClient(messageSignup, "Signup failed: " + error.message, false)
  }
}

// Sign up artist
function signUpArtist(name, pass, passcon, email, accountType, redirectURL) {
  if (!validateArtistSignUp(name, pass, passcon, email)) {
    return
  }

  try {
    firebase.signUpUserWithEmailandPassword(email, pass, name, accountType, redirectURL)
  } catch (error) {
    sendMessagetoClient(messageSignup, "Signup failed: " + error.message, false)
  }
}

// Validation functions
function validateFanSignUp(name, pass, passcon, email) {
  if (!validateArtistSignUp(name, pass, passcon, email)) {
    return false
  }
  return true
}

function validateArtistSignUp(name, pass, passcon, email) {
  if (name === "" || pass === "" || passcon === "" || email === "") {
    sendMessagetoClient(messageSignup, "Please fill in all fields", false)
    return false
  }

  if (pass !== passcon) {
    sendMessagetoClient(messageSignup, "Passwords do not match", false)
    return false
  }

  // Basic email validation
  if (!email.includes("@") || !email.includes(".")) {
    sendMessagetoClient(messageSignup, "Please enter a valid email", false)
    return false
  }

  // Password strength check
  if (pass.length < 6) {
    sendMessagetoClient(messageSignup, "Password must be at least 6 characters", false)
    return false
  }

  return true
}

function validateLogIn(email, pass) {
  if (email === "" || pass === "") {
    sendMessagetoClient(messageLogin, "Please fill in all the fields", false)
    return false
  }

  // Basic email validation
  if (!email.includes("@") || !email.includes(".")) {
    sendMessagetoClient(messageLogin, "Please enter a valid email", false)
    return false
  }

  return true
}

// Display message to user
function sendMessagetoClient(element, message, positive) {
  element.innerText = message
  element.style.opacity = 1

  if (positive) {
    element.style.color = "#4caf50"
  } else {
    element.style.color = "#e94560"
  }

  // Auto-hide message after 5 seconds
  setTimeout(() => {
    element.style.opacity = 0
  }, 5000)
}

// Initialize the page
document.addEventListener("DOMContentLoaded", init)

