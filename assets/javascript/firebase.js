import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA53dQ-J8liKltHUu39WG8TdxPBkI6C9xY",
  authDomain: "toptenlowkeys.firebaseapp.com",
  databaseURL: "https://toptenlowkeys-default-rtdb.firebaseio.com",
  projectId: "toptenlowkeys",
  storageBucket: "toptenlowkeys.firebasestorage.app",
  messagingSenderId: "605570305793",
  appId: "1:605570305793:web:95004b6268b86943771500"
};
const app = initializeApp(firebaseConfig);



class FirebaseImplementation{
    constructor(){
        
    }

    signUpUserWithEmailandPassword(email, password,username,accountType){
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
      // Signed in 
          const user = userCredential.user;
          this.saveUsertoDB(user.uid,email,username,accountType)
          console.log(user);
      })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode+ " : " + errorMessage);
      });
    }

    saveUsertoDB(uid,email,username,accountType){
        const db = getDatabase();
        set(ref(db, 'users/' + accountType+ '/' + uid), {
        username: username,
        email: email
      });
    }

    authenticateUserWithEmailandpassword(email,pass){
        //implemet
    }

    createUserWithGoogle(){
      //implement
    }

    authenticateUserWithGoogle(){
      //implement
    }

    signInUser(){
      //implement
    }

    signOutUser(){
      //implement
    }

    checkAccountType(){
      //implement
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







