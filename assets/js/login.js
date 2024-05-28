const firebaseConfig = {
  apiKey: "AIzaSyA9lsXWjCKInhmQBYOD8Ln0iElBTOaX4tw",
  authDomain: "vasantham-mobiles.firebaseapp.com",
  databaseURL:
    "https://vasantham-mobiles-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vasantham-mobiles",
  storageBucket: "vasantham-mobiles.appspot.com",
  messagingSenderId: "695369590474",
  appId: "1:695369590474:web:a0f8c33a14fb9b2ebc7633",
  measurementId: "G-D1D1ELN8NK",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function login() {
  const email = document.getElementById("yourUsername").value;
  const password = document.getElementById("yourPassword").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("User signed in!");
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    var displayName = user.displayName;
    if (displayName != null) {
      console.log("Name is already present!");
    } else {
      alert("Close this Page! And Set your Name in the 'My Account' section");
      window.location.href = "my-account.html";
    }
    var emailVerified = user.emailVerified;
    if (emailVerified) {
      window.location.href = "index.html";
    } else {
      alert(
        "Close this Page! And Verify your mail in the 'My account' section"
      );
      window.location.href = "my-account.html";
    }
  } else {
    // User is signed out
    // ...
  }
});

function forgotPWD() {
  var mail = prompt("Enter the Email");
  if (prompt != null && prompt != "") {
    firebase
      .auth()
      .sendPasswordResetEmail(mail)
      .then(() => {
        // Password reset email sent!
        // ..
        alert("Password Reset Email Sent. Check your Mail Inbox!");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const preloader = document.querySelector('#preloader');
  preloader.remove();
})