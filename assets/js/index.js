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

async function initialiseItems() {
  // Check if items are already in local storage
  const localItems = localStorage.getItem("items");
  if (localItems) {
    //console.log('Items already in local storage:', JSON.parse(localItems));
    document.getElementById("avl-items").textContent = "Available";
  } else {
    // Fetch items from Firebase Realtime Database
    const itemsRef = database.ref("/items");
    await itemsRef
      .once("value")
      .then((snapshot) => {
        const items = snapshot.val();
        if (items) {
          // Store items in local storage
          localStorage.setItem("items", JSON.stringify(items));
          document.getElementById("avl-items").textContent = "Loaded";
        } else {
          console.log("No items found in database.");
        }
      })
      .catch((error) => {
        document.getElementById("avl-items").textContent = error;
      });
  }
}


async function initialiseShops() {
  // Check if items are already in local storage
  const localShops = localStorage.getItem("shops");
  if (localShops) {
    //console.log('Items already in local storage:', JSON.parse(localItems));
    document.getElementById("avl-shops").textContent = "Available";
  } else {
    // Fetch items from Firebase Realtime Database
    const shopsRef = database.ref("/shops");
    await shopsRef
      .once("value")
      .then((snapshot) => {
        const shops = snapshot.val();
        if (shops) {
          // Store items in local storage
          localStorage.setItem("shops", JSON.stringify(shops));
          document.getElementById("avl-shops").textContent = "Loaded";
        } else {
          console.log("No items found in database.");
        }
      })
      .catch((error) => {
        document.getElementById("avl-shops").textContent = error;
      });
  }
}


function updateItems() {
  localStorage.removeItem("items");
  const itemsRef = database.ref("/items");
  itemsRef
    .once("value")
    .then((snapshot) => {
      const items = snapshot.val();
      if (items) {
        // Store items in local storage
        localStorage.setItem("items", JSON.stringify(items));
        document.getElementById("avl-items").textContent = "Updated";
      } else {
        console.log("No items found in database.");
      }
    })
    .catch((error) => {
      document.getElementById("avl-items").textContent = error;
    });
}

function updateShops() {
  localStorage.removeItem("shops");
  const shopsRef = database.ref("/shops");
  shopsRef
    .once("value")
    .then((snapshot) => {
      const shops = snapshot.val();
      if (shops) {
        // Store items in local storage
        localStorage.setItem("shops", JSON.stringify(shops));
        document.getElementById("avl-shops").textContent = "Updated";
      } else {
        console.log("No items found in database.");
      }
    })
    .catch((error) => {
      document.getElementById("avl-shops").textContent = error;
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
      await initialiseItems();
      await initialiseShops();
      const preloader = document.querySelector('#preloader');
      preloader.remove();
    } else {
      alert("Verify your mail in the 'My account' section");
      window.location.href = "my-account.html";
    }
  } else {
    // User is signed out
    // ...
    window.location.href = 'login.html';
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
