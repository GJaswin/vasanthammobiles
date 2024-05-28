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


var originalShopKey;
var database = firebase.database();
var shopKeyRef = firebase.database().ref('shopKey');
shopKeyRef.once('value', (snapshot) => {
  const data = snapshot.val();
  originalShopKey = data;
});

var userName;

function updateName() {
  const user = firebase.auth().currentUser;

  user
    .updateProfile({
      displayName: userName,
    })
    .then(() => {
      console.log("Name Updated!")
    })
    .catch((error) => {
        console.log(error);
    });
}
function signup() {
  userName = document.getElementById("yourName").value;
  const shopKey = document.getElementById("shopKey").value;
  const email = document.getElementById("yourEmail").value;
  const password = document.getElementById("yourPassword").value;
  if (shopKey == originalShopKey && userName != "") {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log("Account Created!");
        document.getElementById("show-msg").classList.remove("invisible");
        sendVerificationEmail(user);
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
  } else {
    alert("Incorrect Shop Key");
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    var displayName = user.displayName;
    if(displayName!=null){
        console.log("Name is already present!");
    }else{
        updateName();
    }
    var emailVerified = user.emailVerified;
    if(emailVerified){
        window.location.href = 'index.html';
    }else{
        console.log("Email not verified");
    }
  } else {
    // User is signed out
    // ...
  }
});

function sendVerificationEmail(user) {
    user.sendEmailVerification()
        .then(() => {
            // Email sent
            alert('Verification email sent! Please check your inbox.');
            document.getElementById("show-msg").classList.remove("invisible");
            // Redirect to email verification page or continue monitoring verification status
            monitorEmailVerification(user);
        })
        .catch((error) => {
            console.error('Error sending verification email:', error);
        });
}

function monitorEmailVerification(user) {
    const intervalId = setInterval(() => {
        user.reload().then(() => {
            if (user.emailVerified) {
                clearInterval(intervalId); // Stop checking
                window.location.href = 'index.html'; // Redirect to index.html
            }
        });
    }, 2000); // Check every 2 seconds
}


document.addEventListener('DOMContentLoaded',()=>{
  const preloader = document.querySelector('#preloader');
  preloader.remove();
})