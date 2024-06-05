import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";






const firebaseConfig = {
  apiKey: "AIzaSyA53dQ-J8liKltHUu39WG8TdxPBkI6C9xY",
  authDomain: "toptenlowkeys.firebaseapp.com",
  projectId: "toptenlowkeys",
  storageBucket: "toptenlowkeys.appspot.com",
  messagingSenderId: "605570305793",
  appId: "1:605570305793:web:95004b6268b86943771500",
  databaseURL: "https://toptenlowkeys-default-rtdb.firebaseio.com/"
};


const app = initializeApp(firebaseConfig);



class FirebaseImplementation{
    constructor(){
        
    }

    
    sendRequest(){
        this.name = document.getElementById('artistName').value;
        this.url = document.getElementById('youtubeURL').value;
        this.title = document.getElementById('title').value;
        const database = getDatabase();
        set(ref(database, "suggestions/"+ this.name + " " +this.title), {
            ArtistName: this.name,
            youtubeURL: this.url,
            Title: this.title
            
        });

        console.log(this.name + " " + this.url);
    }
    
      getVideoURLs(){
        const database = getDatabase();
  const videoLinksref = ref(database, "suggestions/");
  return new Promise((resolve, reject) => {
    onValue(videoLinksref, (snapshot) => {
      const suggestedURLs = [];
      snapshot.forEach((childSnapshot) => {
        const url = childSnapshot.val().youtubeURL;
        suggestedURLs.push(url);
      });
      resolve(suggestedURLs);
    }, {
      onlyOnce: false
    });
  });
    }


}

export default FirebaseImplementation;







