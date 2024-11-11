//imports

import FirebaseImplementation from "../javascript/firebase.js";

//grabbing DOM elements.
const artistOption = document.getElementById('options');
const fanSignUp = document.getElementsByClassName('fan')[0];
const artistSignUp = document.getElementsByClassName('artist')[0];
const signUpDialogue = document.getElementById('signup');
const loginDialogue = document.getElementById('login');
const toggleLoginSignUp = document.getElementById('switchToLogIn');
const switcher = document.getElementsByClassName('switcher')[0];

//credentials
const artistName = document.getElementById('ausername');
const artistPass = document.getElementById('apassword');
const artistPassCon = document.getElementById('apasswordconfirm');
const artistEmail = document.getElementById('aemail');
const fanName = document.getElementById('username');
const fanPass = document.getElementById('password');
const fanPassCon = document.getElementById('passwordconfirm');
const fanEmail = document.getElementById('email')
const loginPass = document.getElementById('passlogin');
const loginEmail = document.getElementById('emaillogin');
const accountType = document.getElementById('accounttype');
const messageLogin = document.getElementById('messageLogin');
const messageSignup = document.getElementById('messageSignup');

//buttons

const signUpbtn = document.getElementById('signupartist');
const signUpbtnFan = document.getElementById('signupbtn');
const logInbtn = document.getElementById('loginbtn');
const signUpbtnGoogle = document.getElementById('signupgoogleartist');
const signUpbtnGoogleFan = document.getElementById('signupgoogle');
const logInbtnGoogle = document.getElementById('logingoogle');

//globals
const firebase = new FirebaseImplementation();
const redirecturl = "../../index.html";

//functions
//this function will open a sign up dialogue box based on 
//the target of the click on parent element artistOption.

function openSignUpMenu(accountType){
    if(accountType ==="artistprompt ip"){
        fanSignUp.style.display = 'none';
        disapear(artistOption);
        signUpDialogue.style.top = 0;
        return;
    }

    if(accountType ==="fanprompt ip"){
        artistSignUp.style.display = 'none';
        disapear(artistOption);
        signUpDialogue.style.top = 0;
        return;
    }
}

//this function is used to open the login menu

function openLoginMenu(){
    loginDialogue.style.top = 0;
    disapear(artistOption);
    disapear(signUpDialogue);
    switcher.innerHTML = "Don't have an account? <span id='switchToLogIn'>Sign Up</span>"
    
}

function closeLoginMenu(){
    if(switcher.innerHTML === "Don't have an account? <span id='switchToLogIn'>Sign Up</span>"){
        switcher.innerHTML = "Already have an account? <span id='switchToLogIn'>Log In</>";
        disapear(loginDialogue);
        appear(artistOption);
    }
}

//change artist style
function disapear(element){
    element.style.top = '-100%';
    element.style.opacity = 0;
}

function appear(element){
    element.style.top = '0';
    element.style.opacity = 1;
}

//this section will handle user sign up and logins, submit
//credentials to firebase and log them in.

function logInUser(email,pass){
    if(!validateLogIn(email,pass)){
        return;
    }
    
    firebase.signInUser(email,pass,redirecturl);
}

function signUpFan(name,pass,passcon,email,accountType,redirectURL){
    if(!validateFanSignUp(name,pass,passcon,email)){
        return;
    }
    firebase.signUpUserWithEmailandPassword(email,pass,name,accountType,redirectURL);
}

function signUpArtist(name, pass,passcon,email,accountType,redirectURL){
    if(!validateArtistSignUp(name,pass,passcon,email)){
        return;
    }
    firebase.signUpUserWithEmailandPassword(email,pass,name,accountType,redirectURL);
}


//validation
function validateFanSignUp(name,pass,passcon,email){
    if(!validateArtistSignUp(name,pass,passcon,email)){
        return false;
    };
    return true;
}

function validateArtistSignUp(name,pass,passcon,email){
    if(
        name === '' ||
        pass === '' ||
        passcon === '' ||
        email === ''
    ){
        sendMessagetoClient(messageSignup,"Please fill in all fields",false);
        return false;
    }

    if(pass != passcon){
        sendMessagetoClient(messageSignup,"Passwords do not match",false);
        return false;
    }

    return true;
}

function validateLogIn(email,pass){
    if(email===''||pass===''){
        sendMessagetoClient(messageLogin,"Please fill in all the fields",false);
        return false;
    }
    return true;
}

function sendMessagetoClient(element,message,positive){
    element.innerText = message;
    element.style.opacity = 1;
    if(positive){
        element.style.color = "green";
        return;
    }
    element.style.color = "red";
}

//eventlisteners

artistOption.addEventListener('click',(e)=>{
    openSignUpMenu(e.target.className);
});

toggleLoginSignUp.addEventListener('click',()=>{
    openLoginMenu();
    closeLoginMenu();
});

logInbtn.addEventListener('click',()=>{
    logInUser(loginEmail.value,loginPass.value);
});

signUpbtn.addEventListener('click',()=>{
    console.log('clicked artist signup');
    signUpArtist(
        artistName.value,
        artistPass.value,
        artistPassCon.value,
        artistEmail.value,
        "artist",
        redirecturl
    );
});

signUpbtnFan.addEventListener('click',()=>{
    console.log('clicked fan signup!!');
    signUpFan(
        fanName.value,
        fanPass.value,
        fanPassCon.value,
        fanEmail.value,
        "fan",
        redirecturl
    )
});