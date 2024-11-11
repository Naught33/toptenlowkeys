//imports section

import Youtube from "./youtube.js";
import FirebaseImplementation from "./firebase.js";

//grabbing DOM elements
const menuButton = document.getElementById('menu');
const sidenav = document.getElementById('sidenav');
const suggestButton = document.getElementById('suggest');
const suggestionForm = document.getElementById('suggestionForm');
const hamburger = document.getElementById('hamburger');
const featured = document.getElementById('featured');
const archives = document.getElementById('archives');
const featuredPlaceholder = document.getElementById('default-featured');
const archivedPlaceholder = document.getElementById('default-archives');
const player = document.getElementById('youtube-player');
const playerContainer = document.getElementById('player-container');
const sedRequest = document.getElementById('sendrequest');
const closePlayer = document.getElementById('close-player');
const controller = document.getElementById('controller');
const loginPrompt = document.getElementById('loginprompt');
const closeLoginPrompt = document.getElementById('closeloginprompt');

//useridentity
const usernameDisplay = document.getElementById('displayname');
const accountTypeDisplay = document.getElementById('displayaccount');
const accountMenu = document.getElementById('account');
const accountButton = document.getElementById('accountIcon');
const closeAccountBtn = document.getElementById('closeAccount');
const logoutBtn = document.getElementById('logoutbtn');

//globals
const redirecturl = "index.html";


const body = document.body;
let toggleTracker = false;
let accountTracker = false;



//class instantiations
const playlist = new Youtube();
const firebase = new FirebaseImplementation();



//functions

//function to check if user is signed in on load of the document
//we will also update the user name and account preferences
async function checkLogInStatus(){

    const resultBody = await firebase.checkSignInStatus();

    if(resultBody === null){
        promptLogInSignUp();
        return;
    }
    console.log(resultBody);
    usernameDisplay.innerText = resultBody.displayName.split(',')[0];
    accountTypeDisplay.innerText = resultBody.displayName.split(',')[1];
    return resultBody;
}

//prompt the user to sign up or sign in if not signed in, this function will be called inside the checkLogInStatus();
function promptLogInSignUp(){
    loginPrompt.style.display = "flex";
}

//the following functions are a set of functions to sign up, log in or log out user

function logOut(){
    firebase.signOutUser(redirecturl);
}

//before we do anything, let us check if a user is signed in and if not, prompt the user to log in.
await checkLogInStatus();

async function populateArchives(){
firebase.getVideoURLs().then((urls) => {
    let myIDs = [];
    urls.forEach((url)=>{
        let card = document.createElement('div');
        card.setAttribute('class','card');
        card.style.background = `url('https://img.youtube.com/vi/${YouTubeVideoId(url)}/hqdefault.jpg')`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
        archives.appendChild(card);
        myIDs.push(YouTubeVideoId(url));
        });
        console.log(myIDs);
        let archiveChildren = document.querySelectorAll('#archives > .card');
        archiveChildren.forEach((element, index)=>{
        element.addEventListener('click', ()=>{
            playerContainer.style.display = "block";
            controller.style.display = "none";
            player.setAttribute(`src`,`https://www.youtube.com/embed/${myIDs[index]}?autoplay=1&controls=1&showinfo=0&modestbranding=1&rel=0`);
            
        });
    });
});
archives.removeChild(archivedPlaceholder);

}

await populateArchives()


async function getPosition(){
    let playlistArray = await playlist.prepareInfo();
    var indices = [];
for (var index in playlistArray) {
    indices.push(parseInt(index) + 1);
    }
    return indices;
}

async function getVideoId(){
    let playlistArray = await playlist.prepareInfo();
    var ids = [];
for (var id in playlistArray) {
    ids.push(`https://www.youtube.com/embed/${playlistArray[id].videoID}?autoplay=1&controls=1&showinfo=0&modestbranding=1&rel=0`);
    }
   
    return ids;
}


async function populateTopTen(){
    const playlistObject = await playlist.prepareInfo();
    const array = await getPosition();
    const links = await getVideoId();
    for(var video in playlistObject){
        let card = document.createElement('div');
        card.setAttribute("class","card");
        card.innerHTML = `<div class="like-container"><i style="font-size:24px" class="fa">&#xf004;</i> <p>0</p></div><h4>${array[video]}. ${playlistObject[video].title}</h4>`;
        card.style.background = `url(${playlistObject[video].thumbnailUrl})`;
        card.style.backgroundPosition = "center"; 
        card.style.backgroundSize = "cover";
        card.style.backgroundRepeat = "no-repeat";  
        featured.appendChild(card);
    }
    let featureChildren = document.querySelectorAll('#featured > .card');
    featureChildren.forEach((element, index)=>{
        element.addEventListener('click', ()=>{
            playerContainer.style.display = "block";
            controller.style.display = "none";
            player.setAttribute(`src`,`${links[index - 1]}`)
        });
    });

    featured.removeChild(featuredPlaceholder);
}

await populateTopTen();




function toggleMenu(){
    if(!toggleTracker){
        sidenav.classList.add("sidenavOpen");
        toggleTracker = true;
    }else{
        sidenav.classList.remove("sidenavOpen");
        suggestionForm.classList.remove("indicator");
        toggleTracker = false;
    }
}

function toggleAccountBar(){
    if(!accountTracker){
        accountMenu.classList.add("openAccount");
        accountTracker = true;
    }else{
        accountMenu.classList.remove("openAccount");
        accountTracker = false;
    }
}

function closeAccountBar(){
    if(accountTracker){
        accountMenu.classList.remove("openAccount");
        accountTracker = false;
    }
}

function closeMenu(){
    if(toggleTracker){
        sidenav.classList.remove("sidenavOpen");
        toggleTracker = false;
    }
}

function highlightForm(){
    if(!toggleTracker){
        sidenav.classList.add("sidenavOpen");
        toggleTracker = true;
        suggestionForm.classList.add("indicator");
        return;
    }
    suggestionForm.classList.add("indicator");
}


//event listeners

menuButton.addEventListener('click', (e)=>{
    e.stopPropagation();
    toggleMenu();
});

suggestButton.addEventListener('click',(e)=>{
    e.stopPropagation();
    highlightForm();
});

hamburger.addEventListener('click', (e)=>{
    e.stopPropagation();
    toggleMenu();
});


sedRequest.addEventListener('click', (e)=>{
    e.preventDefault();
    firebase.sendRequest();
})

body.addEventListener('click', ()=>{
    closeMenu();
    closeAccountBar();
});

sidenav.addEventListener("click", (e)=>{
    e.stopPropagation();
});

closePlayer.addEventListener('click',(e)=>{
    e.stopPropagation();
    playerContainer.style.display = "none";
    controller.style.display = "block";
});

controller.addEventListener('click',()=>{
    playerContainer.style.display = "flex";
    controller.style.display = "none";
});

closeLoginPrompt.addEventListener('click',()=>{
    loginPrompt.style.display = "none";
});

accountButton.addEventListener('click',(e)=>{
    e.stopPropagation();
    toggleAccountBar();
});

accountMenu.addEventListener('click',(e)=>{
    e.stopPropagation();
});

logoutBtn.addEventListener('click',()=>{
    logOut();
});

closeAccountBtn.addEventListener('click',()=>{
    closeAccountBar();
});

