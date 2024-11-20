import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getAuth, updateProfile, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

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

    signUpUserWithEmailandPassword(email, password,username,accountType,redirectURL){
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.saveUsertoDB(user.uid,email,username,accountType,redirectURL);
          this.updateUserProfile(username,accountType);
      })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode+ " : " + errorMessage);
      });
    }

    saveUsertoDB(uid,email,username,accountType,redirectURL){
        const db = getDatabase();
        set(ref(db, 'users/' + accountType+ '/' + uid), {
        username: username,
        email: email
      }).then(()=>{
        setTimeout(()=>{
          this.redirectUser(redirectURL);
        },1000);
      }).catch((error)=>{
        return "failed: " + error;
      });
    }

    updateUserProfile(username,accountType){
      const auth = getAuth(app);
      updateProfile(auth.currentUser, {
        displayName: username+","+accountType
        }).then(()=>{
          return "success";
        }).catch((error)=>{
          return "Error: " + error;
        });
    }

    authenticateUserWithEmailandpassword(email,pass,redirectURL){
        this.signInUser(email,pass,redirectURL)
    }

    createUserWithGoogle(){
      //implement
    }

    authenticateUserWithGoogle(){
      //implement
    }

    signInUser(email, password, redirectURL){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
      const user = userCredential.user;
      this.redirectUser(redirectURL);
      return "Logged in successfully!"
      })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + ": " + errorMessage);
    });
    }

    signOutUser(redirectURL){
      const auth = getAuth(app);

      signOut(auth).then(() => {
        this.redirectUser(redirectURL)
      }).catch((error) => {
        return "error: " + error;
      });
    }

    async checkSignInStatus(){
      const auth = getAuth(app);
      return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({
          "uid": user.uid,
          "email": user.email,
          "displayName": user.displayName
      });
        } else {
          resolve(null);
        }
      });
    });
    }

    
    sendRequest(songTitle, artist, url, username){
        const database = getDatabase();
        set(ref(database, "suggestions/"+ artist + " " +songTitle), {
            ArtistName: artist,
            youtubeURL: url,
            Title: songTitle,
            SuggestedBy: username,
            likeCount: 0,
            
        });

        // console.log(songTitle,artist,url,username);
    }
    
      getArchiveVideos(){
        const database = getDatabase();
        const videoLinksref = ref(database, "suggestions/");
        return new Promise((resolve, reject) => {
          onValue(videoLinksref, (snapshot) => {
            const suggestedURLs = [];
            snapshot.forEach((childSnapshot) => {
              // console.log(childSnapshot.val());
              const video = childSnapshot.val();
              suggestedURLs.push(video);
            });
            resolve(suggestedURLs);
          }, {
            onlyOnce: false
          });
        });
    }

    async likeSong(artistName, songTitle){
      let credentials = await this.checkSignInStatus();
      const database = getDatabase();
      const songRef = ref(database, "suggestions/"+ artistName + " " +songTitle+"/likeCount");
      const userRef = ref(database, "suggestions/"+ artistName + " " +songTitle+"/likedBy" + credentials.displayName);
      const snapshot = await get(userRef);
      let hasLiked = snapshot.exists() && snapshot.val().liked === true;
      let newLikeCount;
      
      if(hasLiked){
      await runTransaction(songRef,(currentLikeCount)=>{
        currentLikeCount--;
        newLikeCount = currentLikeCount;
        return currentLikeCount;
      });

      set(userRef, {
        liked: false
      });
      return newLikeCount;
      }
      runTransaction(songRef,(currentLikeCount)=>{
        currentLikeCount++;
        newLikeCount = currentLikeCount;
        return currentLikeCount;
      });
        set(userRef, {
          liked: true
      });
      return newLikeCount;
    }

    redirectUser(url){
      window.location.href = url;
    }
    

}
export default FirebaseImplementation;







