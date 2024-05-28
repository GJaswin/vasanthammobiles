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

function updateName() {
  const user = firebase.auth().currentUser;

  var name = prompt("Enter Your Name to be Changed:");
  if (prompt != null && prompt != "") {
    user
      .updateProfile({
        displayName: name,
      })
      .then(() => {
        document.getElementById("userName").textContent = name;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    alert("Enter the name to be Updated!");
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    var displayName = user.displayName;
    var email = user.email;
    if (displayName != null) {
      document.getElementById("userName").textContent = displayName;
    } else {
      console.log(
        "Close this Page! And Set your Name in the 'My Account' section"
      );
    }
    var emailVerified = user.emailVerified;
    if (emailVerified) {
      document.getElementById("mailVerified").classList.remove("invisible");
      document.getElementById("userMail").textContent = email;
    } else {
      document.getElementById("userUMail").textContent = email;
      document.getElementById("mailVerify").classList.remove("invisible");
    }

    const preloader = document.querySelector('#preloader');
      preloader.remove();

  } else {
    // User is signed out
    // ...
    window.location.href = "index.html";
  }
});

function deleteAccount() {
  var surity = confirm("Are you sure to Delete your Account?");
  if (surity) {
    const user = firebase.auth().currentUser;

    user
      .delete()
      .then(() => {
        alert("User Deleted");
        window.location.href = "index.html";
      })
      .catch((error) => {
        // An error ocurred
        // ...
        alert(error);
      });
  }
}

function sendVerificationMail() {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification()
        .then(() => {
            // Email sent
            alert('Verification email sent! Please check your inbox.');
            // Redirect to email verification page or continue monitoring verification status
            monitorEmailVerification(user);
        })
        .catch((error) => {
            console.error('Error sending verification email:', error);
            alert(error);
        });
}

function monitorEmailVerification(user) {
    const intervalId = setInterval(() => {
        user.reload().then(() => {
            if (user.emailVerified) {
                clearInterval(intervalId); // Stop checking
                document.getElementById("mailVerified").classList.remove("invisible");
                document.getElementById("mailVerify").classList.add("invisible");
            }
        });
    }, 2000); // Check every 2 seconds
}