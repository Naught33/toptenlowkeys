//input handlers
const musicInput = document.getElementById('fileInput');
const player = document.getElementById('audioPlayer');
let currentSongIndex = 0;
let playlist = null;

//controls
const playPause = document.getElementById('play-pause');
const play = document.getElementById('play');
const pause = document.getElementById('pause');

//modal controls

const playPauseModal = document.getElementById('play-pause-modal');
const playModal = document.getElementById('play-modal');
const pauseModal = document.getElementById('pause-modal');
const displayModal = document.getElementById('display-modal');
const nextModal = document.getElementById('next-modal');
const prevModal = document.getElementById('prev-modal');

//other controls
const list = document.getElementById('list');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const display = document.getElementById('name');
const togglePlaying = document.getElementById('togglePlaying');
const closeModalPlayer = document.getElementById('close-modal');
const modalPlayer = document.getElementById('modal-player');
const disk = document.getElementById('disk');

//player tracker and other trackers
let isPlaying = false;
let isPlayerToggled = false;

//open and close the main player
function toggleMainPlayer(){
  if(!isPlayerToggled){
    modalPlayer.classList.add('modal-open');
    isPlayerToggled = true;
    return;
  }

  modalPlayer.classList.remove('modal-open');
  isPlayerToggled = false;
}

togglePlaying.addEventListener('click',()=>{
  toggleMainPlayer();
});

closeModalPlayer.addEventListener('click',()=>{
  toggleMainPlayer();
});


//player object
musicInput.addEventListener('change',(e)=>{
  if(playlist != null){
    let added = Array.from(e.target.files);
    added.forEach(file=>{
     playlist.push(file);
    let listitem = document.createElement('div');
    listitem.className = "file";
    listitem.innerHTML = `
     <div class="icon">
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#ffff"><path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/></svg>
          </p>
        </div>
        <div class="info">
        <h6>${file.name}</h6>
        <p>Unknown</p>
      </div>
    `;
    list.appendChild(listitem);
    listitem.addEventListener('click',()=>{
      currentSongIndex = playlist.indexOf(file);
      console.log(currentSongIndex);
      player.src = URL.createObjectURL(file);
      player.play();
      play.style.display = "none";
      playModal.style.display = "none";
      pause.style.display = "flex";
      pauseModal.style.display = "flex";
      display.innerText = file.name;
      displayModal.innerText = file.name;
      disk.classList.add('rotate');
      isPlaying = true;
      });
  });
  }else{
  playlist = Array.from(e.target.files);
  playlist.forEach(file=>{
    let listitem = document.createElement('div');
    listitem.className = "file";
    listitem.innerHTML = `
     <div class="icon">
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#ffff"><path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/></svg>
          </p>
        </div>
        <div class="info">
        <h6>${file.name}</h6>
        <p>Unknown</p>
      </div>
    `;
    list.appendChild(listitem);

    listitem.addEventListener('click',()=>{
        currentSongIndex = playlist.indexOf(file);
        player.src = URL.createObjectURL(file);
        player.play();
        play.style.display = "none";
        playModal.style.display = "none";
        pause.style.display = "flex";
        pauseModal.style.display = "flex";
        display.innerText = file.name;
        displayModal.innerText = file.name;
        disk.classList.add('rotate');
        isPlaying = true;
    });
  });
  }
});
//click handling

function playPauseAudio(){
  if(!isPlaying){
    player.play();
    play.style.display = "none";
    playModal.style.display = "none";
    pause.style.display = "flex";
    pauseModal.style.display = "flex";
    disk.classList.add('rotate');
    isPlaying = true;
    return;
  }
      player.pause();
      play.style.display = "flex";
      playModal.style.display = "flex";
      pause.style.display = "none";
      pauseModal.style.display = "none";
      disk.classList.remove('rotate');
      isPlaying = false;
}

function nextSong(){
  if(currentSongIndex === playlist.length-1){
    currentSongIndex = 0;
  }
  else{
    currentSongIndex++;
    }
    player.src = URL.createObjectURL(playlist[currentSongIndex]);
    player.play();
    display.innerText = playlist[currentSongIndex].name;
    displayModal.innerText = playlist[currentSongIndex].name;
    isPlaying = true;
}

function prevSong(){
  if(currentSongIndex === 0){
    currentSongIndex = playlist.length-1;
  }
  else{
    currentSongIndex--;
    }
    player.src = URL.createObjectURL(playlist[currentSongIndex]);
    player.play();
    display.innerText = playlist[currentSongIndex].name;
    displayModal.innerText = playlist[currentSongIndex].name;
    isPlaying = true;
}

playPause.addEventListener('click',()=>{
  playPauseAudio();
});

playPauseModal.addEventListener('click',()=>{
  playPauseAudio();
})

next.addEventListener('click',()=>{
  nextSong()
});

nextModal.addEventListener('click',()=>{
  nextSong();
});

prev.addEventListener('click',()=>{
 prevSong();
});

prevModal.addEventListener('click',()=>{
  prevSong();
});

player.addEventListener('ended',()=>{
  nextSong();
})



