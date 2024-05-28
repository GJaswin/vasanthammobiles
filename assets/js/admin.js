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

const db = firebase.firestore();

var database = firebase.database();

async function getShopKey() {
  const shopKeyRef = database.ref("/shopKey");
  await shopKeyRef
    .once("value")
    .then((snapshot) => {
      const shopKey = snapshot.val();
      if (shopKey) {
        document.getElementById("shop-key").textContent = shopKey;
      } else {
        alert("No Shop Key");
      }
    })
    .catch((error) => {
      alert(error);
    });
}

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    var uid = user.uid;
    var displayName = user.displayName;
    if (displayName != null) {
      console.log("Name: " + displayName);
    } else {
      alert("Set your Name in the 'My Account' section");
      window.location.href = "my-account.html";
    }
    var emailVerified = user.emailVerified;
    if (emailVerified) {
      document.getElementById("userName").textContent = displayName;
      await getShopKey();
      if (uid == "v0VOJEEfgUO8Zq4h7UhAmmX0dF12") {
        const preloader = document.querySelector("#preloader");
        preloader.remove();
      } else {
        alert("Only an Admin can access this page!");
        window.location.href = "index.html";
      }
    } else {
      alert("Verify your mail in the 'My account' section");
      window.location.href = "my-account.html";
    }
  } else {
    // User is signed out
    // ...
    window.location.href = "login.html";
  }
});

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("Signed Out Successfully!");
    })
    .catch((error) => {
      alert(error);
    });
}

function updateShopKey() {
  var shopKey = prompt("Enter new Shop Key");
  if (shopKey != null && shopKey != "") {
    database
      .ref("/")
      .update({
        shopKey: shopKey,
      })
      .then(() => {
        document.getElementById("shop-key").textContent = shopKey;
      })
      .catch((err) => {
        alert(err);
      });
  } else {
    alert("Enter a proper Shop Key!");
  }
}
